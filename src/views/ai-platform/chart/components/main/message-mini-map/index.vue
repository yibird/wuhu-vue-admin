<template>
  <nav
    class="absolute top-1/2 right-12 z-8 max-h-[calc(100%-48px)] w-64 flex flex-col items-end justify-center gap-12 px-8 py-12 pointer-events-auto -translate-y-1/2 max-[900px]:hidden"
    aria-label="消息导航缩略图"
    @mouseleave="handleLeave"
  >
    <button
      v-for="(item, index) in messages"
      :key="item.id"
      type="button"
      class="message-marker h-3 min-h-3 w-40 flex-none rounded-full border-0 p-0 cursor-pointer origin-right focus-visible:outline-none"
      :class="[
        markerColorMap[item.type ?? 'assistant'],
        { 'is-active': activeId === item.id },
      ]"
      :style="getMarkerStyle(index)"
      :title="item.preview"
      :aria-label="`跳转到消息：${item.preview || item.id}`"
      @mouseenter="handleEnter(index)"
      @focus="handleEnter(index)"
      @blur="handleLeave"
      @click="jump(item)"
    />

    <Transition name="fade-slide-right">
      <div
        v-if="preview"
        class="message-preview absolute top-1/2 right-[calc(100%+10px)] w-210 grid gap-4 px-10 py-9 pointer-events-none bg-[rgb(var(--w-bg-container)/96%)] b-1-muted rounded-6 shadow-lg backdrop-blur-12"
        :style="previewStyle"
      >
        <span class="text-11px text-primary font-600">
          {{
            preview.type === 'user'
              ? '我的消息'
              : preview.type === 'tool'
                ? '系统消息'
                : 'Agent 消息'
          }}
        </span>
        <span class="message-preview__content text-12px leading-18px text-main">
          {{ preview.preview }}
        </span>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { useMessageMiniMap } from './hooks'
import type { CSSProperties } from 'vue'
import type {
  MessageMiniMapEmits,
  MessageMiniMapItem,
  MessageMiniMapProps,
} from './types'

const props = defineProps<MessageMiniMapProps>()
const emits = defineEmits<MessageMiniMapEmits>()

const { hoverIndex, getScaleX, getStrength } = useMessageMiniMap()
const preview = shallowRef<MessageMiniMapItem>()
const activeId = shallowRef<MessageMiniMapItem['id']>()
const markerStep = 15
let scrollFrame = 0

/** 标记条配色：按消息类型对应 UnoCSS 背景色 class */
const markerColorMap: Record<
  NonNullable<MessageMiniMapItem['type']>,
  string
> = {
  user: 'bg-[rgb(var(--w-color-primary))]',
  tool: 'bg-[rgb(var(--w-color-warning))]',
  assistant: 'bg-[rgb(var(--w-text-secondary))]',
}

const previewStyle = computed(() => {
  if (!preview.value || props.messages.length === 0) return undefined
  const index = props.messages.findIndex(
    (item) => item.id === preview.value?.id
  )
  if (index < 0) return undefined
  const offset = (index - (props.messages.length - 1) / 2) * markerStep
  return { '--message-preview-offset-y': `${offset}px` } as CSSProperties
})

function handleEnter(index: number) {
  hoverIndex.value = index
  preview.value = props.messages[index]
}

function handleLeave() {
  hoverIndex.value = -1
  preview.value = undefined
}

function getMarkerStyle(index: number): CSSProperties {
  const strength = getStrength(index)

  return {
    '--message-marker-scale-x': getScaleX(index).toFixed(4),
    '--message-marker-offset-x': `${(-2 * strength).toFixed(2)}px`,
    opacity: 0.35 + strength * 0.65,
  }
}

function jump(item: MessageMiniMapItem) {
  activeId.value = item.id
  item.el?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  emits('select', item)
}

function updateActiveMessage() {
  cancelAnimationFrame(scrollFrame)
  scrollFrame = requestAnimationFrame(() => {
    if (!props.container || props.messages.length === 0) return

    const viewportRect = props.container.getBoundingClientRect()
    const viewportCenter = viewportRect.top + viewportRect.height / 2
    let closestItem: MessageMiniMapItem | undefined
    let closestDistance = Number.POSITIVE_INFINITY

    for (const item of props.messages) {
      if (!item.el) continue
      const rect = item.el.getBoundingClientRect()
      const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestItem = item
      }
    }

    activeId.value = closestItem?.id
  })
}

watch(
  () => props.container,
  (container, _previousContainer, onCleanup) => {
    if (!container) return
    container.addEventListener('scroll', updateActiveMessage, { passive: true })
    updateActiveMessage()
    onCleanup(() =>
      container.removeEventListener('scroll', updateActiveMessage)
    )
  },
  { immediate: true }
)

watch(
  () => props.messages,
  () => updateActiveMessage(),
  { flush: 'post' }
)

onBeforeUnmount(() => cancelAnimationFrame(scrollFrame))
</script>

<style scoped>
/**
 * 标记条与预览卡的位移动画由 JS 写入的 CSS 变量驱动，
 * 悬浮/激活态需要改写同一变量，无法用原子类表达，故保留在此处。
 */
.message-marker {
  --message-marker-offset-x: 0px;
  --message-marker-scale-x: 0.375;
  --message-marker-scale-y: 1;

  transform: translate3d(var(--message-marker-offset-x), 0, 0)
    scaleX(var(--message-marker-scale-x)) scaleY(var(--message-marker-scale-y));
  transition:
    transform 300ms var(--w-motion-ease-enter),
    opacity 200ms var(--w-motion-ease-enter),
    background-color 200ms var(--w-motion-ease),
    box-shadow 300ms var(--w-motion-ease);
  will-change: transform, opacity;
}

.message-marker:hover,
.message-marker:focus-visible {
  --message-marker-scale-y: 1.35;

  background: rgb(var(--w-color-primary));
  box-shadow:
    0 0 0 2px rgb(var(--w-color-primary) / 14%),
    0 0 10px rgb(var(--w-color-primary) / 20%);
}

.message-marker.is-active {
  --message-marker-scale-y: 1.25;

  background: rgb(var(--w-color-primary));
  box-shadow: 0 0 0 2px rgb(var(--w-color-primary) / 14%);
  opacity: 1 !important;
}

.message-marker.is-active:hover,
.message-marker.is-active:focus-visible {
  --message-marker-scale-y: 1.35;

  box-shadow:
    0 0 0 2px rgb(var(--w-color-primary) / 18%),
    0 0 12px rgb(var(--w-color-primary) / 22%);
}

.message-preview {
  --message-preview-offset-y: 0px;

  transform: translate3d(0, calc(-50% + var(--message-preview-offset-y)), 0);
  transition: transform 300ms var(--w-motion-ease-enter);
  will-change: transform, opacity;
}

/** 多行文本截断所需的 -webkit-box 组合写法，原子类无法完整表达 */
.message-preview__content {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
}

@media (prefers-reduced-motion: reduce) {
  .message-marker,
  .message-preview {
    transition: none;
  }
}
</style>
