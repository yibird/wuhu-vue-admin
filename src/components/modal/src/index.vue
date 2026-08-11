<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  shallowRef,
  useAttrs,
  watch,
} from 'vue'
import type { ModalProps as AntdvModalProps } from 'antdv-next'
import type {
  ModalEmits,
  ModalInstance,
  ModalPosition,
  ModalSlots,
  ModalProps,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ModalProps>(), {
  fullscreen: undefined,
})
const emit = defineEmits<ModalEmits>()
const slots = defineSlots<ModalSlots>()
const attrs = useAttrs()
const instance = getCurrentInstance()

const internalFullscreen = shallowRef(false)
const isFullscreen = computed(
  () => props.fullscreen ?? internalFullscreen.value
)
const hasEnhancedHeader = computed(() =>
  Boolean(props.draggable || props.fullscreenable)
)
const forwardedSlotNames = computed(() =>
  (Object.keys(slots) as (keyof ModalSlots)[]).filter(
    (slotName) => slotName !== 'title' || !hasEnhancedHeader.value
  )
)

const omittedModalPropNames = new Set([
  'draggable',
  'exitFullscreenText',
  'fullscreen',
  'fullscreenable',
  'fullscreenText',
  'onCancel',
  'onOk',
  'onUpdate:open',
  'rootClass',
  'width',
  'wrapClassName',
])

function hasOwnProperty(object: object, property: string) {
  return Object.prototype.hasOwnProperty.call(object, property)
}

function hyphenatePropertyName(property: string) {
  return property.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

function getModalBindings(): AntdvModalProps {
  const rawProps = instance?.vnode.props ?? {}
  const forwarded: Record<string, unknown> = {}

  for (const [propName, value] of Object.entries(props)) {
    if (omittedModalPropNames.has(propName)) continue

    const wasProvided =
      hasOwnProperty(rawProps, propName) ||
      hasOwnProperty(rawProps, hyphenatePropertyName(propName))
    if (wasProvided) forwarded[propName] = value
  }

  return { ...forwarded, ...attrs } as AntdvModalProps
}
const rootClass = computed(() =>
  [
    props.rootClass,
    'w-modal-root',
    props.draggable && 'w-modal-root--draggable',
    isFullscreen.value && 'w-modal-root--fullscreen',
  ]
    .filter(Boolean)
    .join(' ')
)
const wrapClassName = computed(() =>
  [
    props.wrapClassName,
    'w-modal-wrap',
    props.draggable && 'w-modal-wrap--draggable',
    isFullscreen.value && 'w-modal-wrap--fullscreen',
  ]
    .filter(Boolean)
    .join(' ')
)
const modalWidth = computed(() => (isFullscreen.value ? '100vw' : props.width))

const TitleContent = () => slots.title?.() ?? props.title ?? null

interface DragSession {
  initialRect: DOMRect
  startPointer: ModalPosition
  startOffset: ModalPosition
}

const modalPosition: ModalPosition = { x: 0, y: 0 }
let dragSession: DragSession | null = null
let modalElement: HTMLElement | null = null

function setFullscreen(fullscreen: boolean) {
  if (fullscreen === isFullscreen.value) return

  if (props.fullscreen === undefined) internalFullscreen.value = fullscreen
  emit('update:fullscreen', fullscreen)
  emit('fullscreenChange', fullscreen)
}

function toggleFullscreen() {
  setFullscreen(!isFullscreen.value)
}

function resetModalPosition() {
  modalPosition.x = 0
  modalPosition.y = 0
  modalElement?.style.removeProperty('--w-modal-translate-x')
  modalElement?.style.removeProperty('--w-modal-translate-y')
  modalElement?.classList.remove('w-modal--translated')
  modalElement = null
}

function resetPosition() {
  stopDragging()
  resetModalPosition()
}

function setModalPosition(element: HTMLElement, position: ModalPosition) {
  modalPosition.x = position.x
  modalPosition.y = position.y
  element.style.setProperty('--w-modal-translate-x', `${position.x}px`)
  element.style.setProperty('--w-modal-translate-y', `${position.y}px`)
  element.classList.add('w-modal--translated')
}

function getPointerPosition(event: PointerEvent): ModalPosition {
  return { x: event.clientX, y: event.clientY }
}

function clampDragOffset(
  initialRect: DOMRect,
  offset: ModalPosition
): ModalPosition {
  const horizontalMin = 8 - initialRect.left
  const horizontalMax = window.innerWidth - 8 - initialRect.right
  const verticalMin = 8 - initialRect.top
  const verticalMax = window.innerHeight - 48 - initialRect.bottom
  const boundedHorizontalMax = Math.max(horizontalMin, horizontalMax)
  const boundedVerticalMax = Math.max(verticalMin, verticalMax)

  return {
    x:
      offset.x >= horizontalMin && offset.x <= boundedHorizontalMax
        ? offset.x
        : Math.min(Math.max(offset.x, horizontalMin), boundedHorizontalMax),
    y: Math.min(Math.max(offset.y, verticalMin), boundedVerticalMax),
  }
}

function handleTitlePointerDown(event: PointerEvent) {
  if (!props.draggable || isFullscreen.value || event.button !== 0) return

  const target = event.target as HTMLElement | null
  if (
    target?.closest(
      'button, a, input, textarea, select, [role="button"], [data-modal-no-drag]'
    )
  ) {
    return
  }

  const element = (event.currentTarget as HTMLElement).closest<HTMLElement>(
    '.ant-modal'
  )
  if (!element) return

  event.preventDefault()
  modalElement = element
  dragSession = {
    initialRect: element.getBoundingClientRect(),
    startOffset: { ...modalPosition },
    startPointer: getPointerPosition(event),
  }
  element.classList.add('w-modal--dragging')
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointercancel', handlePointerUp)
  emit('dragStart', event)
}

function handlePointerMove(event: PointerEvent) {
  if (!dragSession || !modalElement) return

  event.preventDefault()
  const pointer = getPointerPosition(event)
  const offset = clampDragOffset(dragSession.initialRect, {
    x: dragSession.startOffset.x + pointer.x - dragSession.startPointer.x,
    y: dragSession.startOffset.y + pointer.y - dragSession.startPointer.y,
  })
  setModalPosition(modalElement, offset)
}

function handlePointerUp() {
  if (!dragSession) return

  const position = { ...modalPosition }
  stopDragging()
  emit('dragEnd', position)
}

function stopDragging() {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointercancel', handlePointerUp)
  modalElement?.classList.remove('w-modal--dragging')
  dragSession = null
}

function handleOk(event: MouseEvent) {
  emit('ok', event)
}

function handleCancel(event: MouseEvent | KeyboardEvent) {
  stopDragging()
  emit('cancel', event)
}

function handleOpenChange(open: boolean) {
  if (!open) {
    resetPosition()
    setFullscreen(false)
  }
  emit('update:open', open)
}

watch(
  () => props.open,
  (open, previousOpen) => {
    if (previousOpen && !open) {
      resetPosition()
      setFullscreen(false)
    }
  }
)

onBeforeUnmount(() => {
  stopDragging()
  resetModalPosition()
})

defineExpose<ModalInstance>({
  resetPosition,
  setFullscreen,
  toggleFullscreen,
})
</script>

<template>
  <a-modal
    v-bind="getModalBindings()"
    :root-class="rootClass"
    :width="modalWidth"
    :wrap-class-name="wrapClassName"
    @cancel="handleCancel"
    @ok="handleOk"
    @update:open="handleOpenChange"
  >
    <template v-if="hasEnhancedHeader" #title>
      <div
        class="w-modal-title min-w-0 flex items-center gap-8 pr-32"
        :class="{
          'cursor-move select-none': draggable && !isFullscreen,
        }"
        @pointerdown="handleTitlePointerDown"
      >
        <div class="min-w-0 flex-1">
          <TitleContent />
        </div>
        <a-tooltip
          v-if="fullscreenable"
          :title="
            isFullscreen
              ? exitFullscreenText || 'Exit fullscreen'
              : fullscreenText || 'Enter fullscreen'
          "
        >
          <a-button
            type="text"
            size="small"
            class="shrink-0"
            :aria-label="
              isFullscreen
                ? exitFullscreenText || 'Exit fullscreen'
                : fullscreenText || 'Enter fullscreen'
            "
            @click.stop="toggleFullscreen"
            @pointerdown.stop
          >
            <template #icon>
              <Icon
                :name="
                  isFullscreen ? 'i-lucide:minimize-2' : 'i-lucide:maximize-2'
                "
                :size="16"
              />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </template>

    <template
      v-for="slotName in forwardedSlotNames"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </a-modal>
</template>

<style scoped>
:global(.w-modal--translated) {
  transform: translate3d(
    var(--w-modal-translate-x, 0),
    var(--w-modal-translate-y, 0),
    0
  ) !important;
}

:global(.w-modal--dragging) {
  user-select: none;
}

:global(.w-modal-root--fullscreen .ant-modal-wrap) {
  overflow: hidden;
}

:global(.w-modal-root--fullscreen .ant-modal) {
  top: 0;
  width: 100vw !important;
  max-width: 100vw;
  height: 100vh;
  padding-bottom: 0;
  margin: 0;
  transform: none !important;
}

:global(.w-modal-root--fullscreen .ant-modal-content) {
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-radius: 0;
}

:global(.w-modal-root--fullscreen .ant-modal-body) {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
