<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { useDroppable } from '@dnd-kit/vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import {
  lowCodeRootGroup,
  useDesignerCanvasDrag,
} from '../composables/useCanvasDrag'
import DesignerCanvasEmptyState from './CanvasEmptyState.vue'
import DesignerCanvasToolbar from './CanvasToolbar.vue'
import DesignerContextMenu from './ContextMenu.vue'
import DesignerCanvasNode from './CanvasNode.vue'
import DesignerNodeActions from './NodeActions.vue'
import DesignerPreviewModal from './PreviewModal.vue'
import {
  findDesignerNode,
  findDesignerNodeLocation,
  flattenDesignerNodes,
} from '../utils/nodeTree'
import { useRangeSelection } from '@/composables/useRangeSelection'
import type { ScrollbarInstance } from '@/components/scrollbar'
import type {
  DesignerComponentType,
  DesignerDropTarget,
  DesignerNode,
  DesignerNodeAction,
  DesignerNodeActionKey,
  DesignerPlatform,
  DesignerPlatformOption,
  DesignerVersion,
} from '../types'

const props = defineProps<{
  activeVersionId: string
  canRedo: boolean
  canUndo: boolean
  nodes: DesignerNode[]
  platform: DesignerPlatform
  platformLabel: string
  platformWidth: number
  platforms: DesignerPlatformOption[]
  selectedId: string
  selectedIds: string[]
  sourcePanelOpen: boolean
  versions: DesignerVersion[]
}>()

const emit = defineEmits<{
  'add-empty': []
  'change-platform': [platform: DesignerPlatform]
  'change-version': [versionId: string]
  'clear-selection': []
  'canvas-active-change': [active: boolean]
  'drop-component': [type: DesignerComponentType, target: DesignerDropTarget]
  duplicate: [id: string]
  'duplicate-selected': []
  'move-down': [id: string]
  'move-node': [id: string, target: DesignerDropTarget]
  'move-up': [id: string]
  redo: []
  reorder: [orderedIds: string[], selectedId: string]
  remove: [id: string]
  'remove-selected': []
  'save-version': []
  select: [id: string]
  'select-many': [ids: string[]]
  'toggle-source': []
  undo: []
}>()

const isPreviewFullscreen = shallowRef(false)
const isPreviewModalOpen = shallowRef(false)
const nodeListRef = useTemplateRef<HTMLElement>('nodeListRef')
const canvasContentRef = useTemplateRef<HTMLElement>('canvasContentRef')
const rootDropRef = useTemplateRef<HTMLElement>('rootDropRef')
const canvasViewportRef = useTemplateRef<ScrollbarInstance>('canvasViewportRef')
const actionBarStyle = shallowRef<Record<string, string>>({})
const contextMenu = shallowRef<{
  id: string
  left: number
  top: number
}>()
const ignoreNextCanvasClick = shallowRef(false)

const actionBarHeight = 40
const actionBarGap = 8
const emptyStyle: Record<string, string> = {}
const nodeTargets = computed(() => {
  const nodeCount = props.nodes.length
  const list = nodeListRef.value
  if (!list || !nodeCount) return []
  return Array.from(
    list.querySelectorAll<HTMLElement>('[data-low-code-node-id]')
  )
})
const selectedNodeTargets = computed(() => {
  const selectedIds = new Set(props.selectedIds)
  return nodeTargets.value.filter((element) =>
    selectedIds.has(element.dataset.lowCodeNodeId ?? '')
  )
})
const rangeContainer = computed(
  () => canvasViewportRef.value?.getScrollElement() ?? null
)
const rangeSelection = useRangeSelection<HTMLElement>({
  container: rangeContainer,
  getKey: (element) => element.dataset.lowCodeNodeId ?? '',
  multiple: true,
  observeScroll: true,
  selected: selectedNodeTargets,
  targets: nodeTargets,
  onChange: (elements) => {
    ignoreNextCanvasClick.value = true
    const ids = elements
      .map((element) => element.dataset.lowCodeNodeId ?? '')
      .filter(Boolean)
    if (ids.length) {
      emit('select-many', ids)
    } else {
      emit('clear-selection')
    }
  },
  onStart: () => {
    closeContextMenu()
    handleCanvasActiveChange(true)
  },
})
const isRangeSelecting = rangeSelection.isSelecting
const activeSelectedIds = computed(() => {
  if (!rangeSelection.isSelecting.value) return props.selectedIds
  return rangeSelection.activeSelected.value
    .map((element) => element.dataset.lowCodeNodeId ?? '')
    .filter(Boolean)
})
const activeSelectedIdSet = computed(() => new Set(activeSelectedIds.value))
const selectedIdSet = computed(() => new Set(props.selectedIds))
const selectedNodes = computed(() => {
  const ids = selectedIdSet.value
  return flattenDesignerNodes(props.nodes).filter((node) => ids.has(node.id))
})
const selectedNode = computed(() =>
  props.selectedIds.length === 1
    ? findDesignerNode(props.nodes, props.selectedId)
    : undefined
)
const selectedActionNodes = computed(() => selectedNodes.value)
const actionBarWidth = computed(() =>
  Math.max(78, actionBarActions.value.length * 36 + 10)
)
const marqueeSelectionStyle = rangeSelection.selectionStyle
const contextMenuActions = computed(() => {
  const actions: Array<{
    danger?: boolean
    disabled?: boolean
    icon: string
    key: DesignerNodeActionKey
    label: string
  }> = []

  if (selectedNodes.value.length <= 1 && selectedNode.value) {
    const location = findDesignerNodeLocation(props.nodes, props.selectedId)
    const index = location?.index ?? -1
    const siblingCount = location?.siblings.length ?? 0
    actions.push(
      {
        key: 'move-up',
        label: '上移',
        icon: 'i-lucide:arrow-up',
        disabled: index <= 0,
      },
      {
        key: 'move-down',
        label: '下移',
        icon: 'i-lucide:arrow-down',
        disabled: index < 0 || index >= siblingCount - 1,
      }
    )
  }

  actions.push(
    {
      key: 'copy',
      label: selectedNodes.value.length > 1 ? '复制选中' : '复制',
      icon: 'i-lucide:copy',
    },
    {
      key: 'delete',
      label: selectedNodes.value.length > 1 ? '删除选中' : '删除',
      icon: 'i-lucide:trash-2',
      danger: true,
    }
  )

  return actions
})
const contextMenuStyle = computed<Record<string, string>>(() => {
  const menu = contextMenu.value
  if (!menu) return emptyStyle

  return {
    transform: `translate3d(${menu.left}px, ${menu.top}px, 0)`,
  }
})
const deviceShellStyle = computed(() => ({
  width: `${props.platformWidth}px`,
  ...(isPreviewFullscreen.value ? { maxWidth: 'calc(100vw - 36px)' } : {}),
}))
const nodeOrderKey = computed(() =>
  props.nodes.map((node) => node.id).join('|')
)
const selectedNodeLayoutKey = computed(() => {
  if (!selectedNodes.value.length) return ''
  return selectedNodes.value
    .map((node) => `${node.id}:${node.type}:${node.style.gridColumn ?? 12}`)
    .join('|')
})

let actionBarFrameId: number | undefined

const { isDraggingNode } = useDesignerCanvasDrag({
  nodes: computed(() => props.nodes),
  rootElement: rootDropRef,
  onDropComponent: (type, target) => {
    emit('drop-component', type, target)
  },
  onMoveNode: (id, target) => {
    emit('move-node', id, target)
  },
  onReorder: (orderedIds, selectedId) => {
    emit('reorder', orderedIds, selectedId)
  },
})

useDroppable({
  accept: ['low-code-node', 'low-code-palette'],
  collisionPriority: -1,
  data: { kind: 'root' },
  element: rootDropRef,
  id: lowCodeRootGroup,
  type: 'low-code-root',
})

const actionBarActions = computed(() => {
  if (!selectedActionNodes.value.length) return []
  if (selectedActionNodes.value.length > 1) {
    return getSelectionActions()
  }

  const location = findDesignerNodeLocation(props.nodes, props.selectedId)
  return getNodeActions(location?.index ?? -1, location?.siblings.length ?? 0)
})

watch(
  [
    () => props.selectedId,
    () => props.selectedIds.join('|'),
    nodeOrderKey,
    selectedNodeLayoutKey,
    () => props.platformWidth,
    actionBarWidth,
  ],
  scheduleActionBarPositionUpdate,
  { flush: 'post', immediate: true }
)

onKeyStroke(
  'Escape',
  () => {
    if (contextMenu.value) {
      closeContextMenu()
      return
    }

    if (rangeSelection.isSelecting.value) {
      rangeSelection.cancelSelection()
      return
    }

    if (isPreviewFullscreen.value) {
      exitPreviewFullscreen()
    }
  },
  { dedupe: true }
)

onBeforeUnmount(() => {
  if (actionBarFrameId !== undefined) {
    window.cancelAnimationFrame(actionBarFrameId)
  }
  rangeSelection.cancelSelection()
})

function getNodeActions(
  index: number,
  siblingCount: number
): DesignerNodeAction[] {
  return [
    {
      key: 'up',
      label: '上移',
      icon: 'i-lucide:arrow-up',
      disabled: index <= 0,
    },
    {
      key: 'down',
      label: '下移',
      icon: 'i-lucide:arrow-down',
      disabled: index < 0 || index >= siblingCount - 1,
    },
    {
      key: 'copy',
      label: '复制',
      icon: 'i-lucide:copy',
    },
    {
      key: 'delete',
      label: '删除',
      icon: 'i-lucide:trash-2',
      danger: true,
    },
  ]
}

function getSelectionActions(): DesignerNodeAction[] {
  return [
    {
      key: 'copy',
      label: '复制选中',
      icon: 'i-lucide:copy',
    },
    {
      key: 'delete',
      label: '删除选中',
      icon: 'i-lucide:trash-2',
      danger: true,
    },
  ]
}

function handleNodeAction(action: DesignerNodeActionKey) {
  const hasMultipleSelection = selectedActionNodes.value.length > 1
  const id = props.selectedId

  if (action === 'up') {
    if (!id || hasMultipleSelection) return
    emit('move-up', id)
    return
  }

  if (action === 'down') {
    if (!id || hasMultipleSelection) return
    emit('move-down', id)
    return
  }

  if (action === 'copy') {
    if (hasMultipleSelection) {
      emit('duplicate-selected')
      return
    }

    if (!id) return
    emit('duplicate', id)
    return
  }

  if (hasMultipleSelection) {
    emit('remove-selected')
    return
  }

  if (!id) return
  emit('remove', id)
}

function closeContextMenu() {
  contextMenu.value = undefined
}

function getSafeContextMenuPosition(event: MouseEvent) {
  const menuWidth = 172
  const menuHeight = 82
  const gap = 8
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  return {
    left: Math.min(
      Math.max(event.clientX, gap),
      Math.max(gap, viewportWidth - menuWidth - gap)
    ),
    top: Math.min(
      Math.max(event.clientY, gap),
      Math.max(gap, viewportHeight - menuHeight - gap)
    ),
  }
}

function openContextMenu(event: MouseEvent, node: DesignerNode) {
  event.preventDefault()
  event.stopPropagation()
  if (!props.selectedIds.includes(node.id)) {
    emit('select', node.id)
  }

  const position = getSafeContextMenuPosition(event)
  contextMenu.value = {
    id: node.id,
    left: position.left,
    top: position.top,
  }
}

function handleContextMenuAction(action: DesignerNodeActionKey) {
  const targetId = contextMenu.value?.id || props.selectedId
  closeContextMenu()

  if (action === 'move-up') {
    if (!targetId) return
    emit('move-up', targetId)
    return
  }

  if (action === 'move-down') {
    if (!targetId) return
    emit('move-down', targetId)
    return
  }

  if (!targetId) return

  if (action === 'copy') {
    emit('duplicate', targetId)
    return
  }

  if (action === 'delete') {
    emit('remove', targetId)
  }
}

function updateActionBarPosition() {
  const list = nodeListRef.value
  const content = canvasContentRef.value
  const viewport = getCanvasViewportElement()
  const ids = props.selectedIds
  if (!ids.length || !list || !content || !viewport) {
    actionBarStyle.value = {}
    return
  }

  const selectedRects = ids
    .map((id) =>
      list.querySelector<HTMLElement>(`[data-low-code-node-id="${id}"]`)
    )
    .filter((element): element is HTMLElement => !!element)
    .map((element) => element.getBoundingClientRect())
  if (!selectedRects.length) {
    actionBarStyle.value = {}
    return
  }

  const selectionRect = selectedRects.reduce(
    (rect, item) => ({
      bottom: Math.max(rect.bottom, item.bottom),
      left: Math.min(rect.left, item.left),
      right: Math.max(rect.right, item.right),
      top: Math.min(rect.top, item.top),
    }),
    {
      bottom: selectedRects[0].bottom,
      left: selectedRects[0].left,
      right: selectedRects[0].right,
      top: selectedRects[0].top,
    }
  )
  const viewportRect = viewport.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  const visibleRight = Math.min(selectionRect.right, viewportRect.right)
  const visibleTop = Math.max(selectionRect.top, viewportRect.top)
  const viewportLeft = viewportRect.left - contentRect.left
  const viewportTop = viewportRect.top - contentRect.top
  const viewportRight = viewportLeft + viewport.clientWidth
  const viewportBottom = viewportTop + viewport.clientHeight
  const preferredLeft = visibleRight - contentRect.left - actionBarWidth.value
  const preferredTop =
    visibleTop - contentRect.top - actionBarHeight - actionBarGap
  const minLeft = viewportLeft + actionBarGap
  const maxLeft = Math.max(
    minLeft,
    viewportRight - actionBarWidth.value - actionBarGap
  )
  const minTop = viewportTop + actionBarGap
  const maxTop = Math.max(
    minTop,
    viewportBottom - actionBarHeight - actionBarGap
  )
  const left = Math.min(Math.max(preferredLeft, minLeft), maxLeft)
  const top =
    preferredTop >= minTop
      ? Math.min(preferredTop, maxTop)
      : Math.min(
          Math.max(visibleTop - contentRect.top + actionBarGap, minTop),
          maxTop
        )

  actionBarStyle.value = {
    transform: `translate3d(${left}px, ${top}px, 0)`,
  }
}

function scheduleActionBarPositionUpdate() {
  void nextTick(() => {
    if (actionBarFrameId !== undefined) return

    actionBarFrameId = window.requestAnimationFrame(() => {
      actionBarFrameId = undefined
      updateActionBarPosition()
    })
  })
}

function isCanvasBlankTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return (
    (!!target.closest('[data-low-code-marquee-area]') ||
      !!target.closest('[data-low-code-canvas-content]') ||
      !!target.closest('[data-low-code-canvas-viewport]')) &&
    !target.closest(
      '[data-low-code-node-id], [data-low-code-node-action], button, input, textarea, select, [contenteditable="true"]'
    )
  )
}

function handleNodeSelect(node: DesignerNode) {
  handleCanvasActiveChange(true)
  emit('select', node.id)
}

function handleCanvasActiveChange(active: boolean) {
  emit('canvas-active-change', active)
}

function handleCanvasMouseMove() {
  handleCanvasActiveChange(true)
}

function handleCanvasBackgroundClick(event: MouseEvent) {
  if (ignoreNextCanvasClick.value) {
    ignoreNextCanvasClick.value = false
    return
  }

  if (isDraggingNode.value || rangeSelection.isSelecting.value) return
  if (!isCanvasBlankTarget(event.target)) return

  emit('clear-selection')
}

function getCanvasViewportElement() {
  return canvasViewportRef.value?.getScrollElement() ?? null
}

function enterPreviewFullscreen() {
  isPreviewFullscreen.value = true
  closeContextMenu()
  void nextTick(updateActionBarPosition)
}

function exitPreviewFullscreen() {
  isPreviewFullscreen.value = false
  closeContextMenu()
  void nextTick(updateActionBarPosition)
}

function openPreviewModal() {
  isPreviewModalOpen.value = true
  closeContextMenu()
}
</script>

<template>
  <Teleport to="body" :disabled="!isPreviewFullscreen">
    <main
      data-low-code-preview-root
      :data-low-code-preview-fullscreen="isPreviewFullscreen"
      :class="[
        'low-code-canvas-root min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-container',
        isPreviewFullscreen
          ? 'is-fullscreen fixed inset-0 z-[10000] size-screen rounded-0 border-0 shadow-none'
          : 'rounded-8 border-1 border-color-2 border-solid shadow-[var(--w-shadow-elevated)]',
      ]"
      @pointerenter="handleCanvasActiveChange(true)"
      @pointerleave="handleCanvasActiveChange(false)"
    >
      <DesignerCanvasToolbar
        :active-version-id="activeVersionId"
        :can-redo="canRedo"
        :can-undo="canUndo"
        :is-preview-fullscreen="isPreviewFullscreen"
        :platform="platform"
        :platforms="platforms"
        :source-panel-open="sourcePanelOpen"
        :versions="versions"
        @change-platform="$emit('change-platform', $event)"
        @change-version="$emit('change-version', $event)"
        @enter-fullscreen="enterPreviewFullscreen"
        @exit-fullscreen="exitPreviewFullscreen"
        @preview="openPreviewModal"
        @redo="$emit('redo')"
        @save-version="$emit('save-version')"
        @toggle-source="$emit('toggle-source')"
        @undo="$emit('undo')"
      />

      <Scrollbar
        ref="canvasViewportRef"
        data-low-code-canvas-viewport
        class="min-h-0 bg-page"
        content-class="relative min-h-full"
        @scroll="
          () => {
            closeContextMenu()
            updateActionBarPosition()
          }
        "
      >
        <div
          ref="canvasContentRef"
          data-low-code-canvas-content
          class="relative min-h-full p-18"
          @mousemove="handleCanvasMouseMove"
          @click="handleCanvasBackgroundClick"
          @contextmenu.prevent
        >
          <div
            ref="rootDropRef"
            data-low-code-marquee-area
            data-low-code-root-drop-zone
            class="low-code-device-shell mx-auto min-h-full rounded-10 border-1 border-color-2 border-solid bg-main p-14 shadow-[0_20px_50px_rgb(15_23_42_/_12%)]"
            :style="deviceShellStyle"
          >
            <div class="mb-12 flex items-center justify-between">
              <div class="flex items-center gap-8">
                <span class="size-10 rounded-full bg-error" />
                <span class="size-10 rounded-full bg-warning" />
                <span class="size-10 rounded-full bg-success" />
              </div>
              <span class="text-xs text-muted"
                >{{ platformLabel }} Preview</span
              >
            </div>

            <DesignerCanvasEmptyState
              v-if="nodes.length === 0"
              @add="$emit('add-empty')"
            />

            <div
              v-else
              ref="nodeListRef"
              class="grid grid-cols-12 select-none gap-12"
              data-low-code-root-node-list
            >
              <template v-for="(node, index) in nodes" :key="node.id">
                <DesignerCanvasNode
                  :active-selected-ids="activeSelectedIdSet"
                  :node="node"
                  :node-index="index"
                  @contextmenu="openContextMenu"
                  @select="handleNodeSelect"
                />
              </template>
            </div>
          </div>

          <div
            v-if="isRangeSelecting"
            class="pointer-events-none absolute left-0 top-0 z-20 rounded-6 border-1 border-primary border-solid bg-primary/10 shadow-[0_0_0_1px_rgb(var(--w-color-primary)_/_18%)] will-change-transform"
            :style="marqueeSelectionStyle"
          />

          <DesignerNodeActions
            v-if="
              selectedActionNodes.length && !isDraggingNode && !isRangeSelecting
            "
            class="absolute left-0 top-0 z-30 will-change-transform"
            :actions="actionBarActions"
            :node-type="selectedNode?.type ?? 'selection'"
            :style="actionBarStyle"
            @action="handleNodeAction"
          />
        </div>
      </Scrollbar>
    </main>
  </Teleport>

  <DesignerContextMenu
    :actions="contextMenuActions"
    :open="!!contextMenu"
    :position-style="contextMenuStyle"
    @action="handleContextMenuAction"
    @close="closeContextMenu"
  />

  <DesignerPreviewModal
    v-model:open="isPreviewModalOpen"
    :nodes="nodes"
    :platform="platform"
    :platforms="platforms"
  />
</template>

<style scoped>
.low-code-canvas-root {
  transform-origin: center;
  transition:
    border-radius var(--w-motion-duration-fast) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-fast) var(--w-motion-ease-standard),
    opacity var(--w-motion-duration-fast) var(--w-motion-ease-standard);
}

.low-code-canvas-root.is-fullscreen {
  animation: low-code-fullscreen-in var(--w-motion-duration-fast)
    var(--w-motion-ease-enter);
}

.low-code-canvas-root.is-fullscreen .low-code-device-shell {
  max-width: calc(100vw - 36px);
}

.low-code-device-shell {
  box-sizing: border-box;
  max-width: none;
  transition: width var(--w-motion-duration-fast) var(--w-motion-ease-enter);
}

.low-code-designer-node__content {
  pointer-events: none;
}

.low-code-designer-node__content :deep(*) {
  pointer-events: none !important;
}

:global(body.low-code-designer--dragging),
:global(body.low-code-designer--dragging *) {
  cursor: grabbing !important;
  user-select: none !important;
}

@keyframes low-code-fullscreen-in {
  from {
    opacity: 0.92;
    transform: scale(0.992);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
