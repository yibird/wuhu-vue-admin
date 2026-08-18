<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  watch,
  type CSSProperties,
} from 'vue'
import { useMessageMiniMap } from './useMessageMiniMap'
import type {
  MessageMiniMapEmits,
  MessageMiniMapItem,
  MessageMiniMapProps,
} from './types'

const props = defineProps<MessageMiniMapProps>()
const emit = defineEmits<MessageMiniMapEmits>()

const { hoverIndex, getScaleX, getStrength } = useMessageMiniMap()
const preview = shallowRef<MessageMiniMapItem>()
const activeId = shallowRef<MessageMiniMapItem['id']>()
const markerStep = 15
let scrollFrame = 0

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
  emit('select', item)
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

<template>
  <nav
    class="message-minimap"
    aria-label="消息导航缩略图"
    @mouseleave="handleLeave"
  >
    <button
      v-for="(item, index) in messages"
      :key="item.id"
      type="button"
      class="message-marker"
      :class="[
        `message-marker--${item.type ?? 'assistant'}`,
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

    <Transition name="message-preview">
      <div v-if="preview" class="message-preview" :style="previewStyle">
        <span class="message-preview__type">
          {{
            preview.type === 'user'
              ? '我的消息'
              : preview.type === 'tool'
                ? '系统消息'
                : 'Agent 消息'
          }}
        </span>
        <span class="message-preview__content">{{ preview.preview }}</span>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.message-minimap {
  position: absolute;
  top: 50%;
  right: 12px;
  z-index: 8;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  justify-content: center;
  width: 64px;
  max-height: calc(100% - 48px);
  padding: 12px 8px;
  pointer-events: auto;
  transform: translateY(-50%);
}

.message-marker {
  --message-marker-offset-x: 0px;
  --message-marker-scale-x: 0.375;
  --message-marker-scale-y: 1;

  flex: 0 0 auto;
  width: 40px;
  height: 3px;
  min-height: 3px;
  padding: 0;
  cursor: pointer;
  background: rgb(var(--w-text-secondary));
  border: 0;
  border-radius: 999px;
  transform: translate3d(var(--message-marker-offset-x), 0, 0)
    scaleX(var(--message-marker-scale-x)) scaleY(var(--message-marker-scale-y));
  transform-origin: right center;
  transition:
    transform var(--w-motion-duration-slow) var(--w-motion-ease-enter),
    opacity var(--w-motion-duration-base) var(--w-motion-ease-enter),
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-moderate) var(--w-motion-ease-standard);
  will-change: transform, opacity;
}

.message-marker--user {
  background: rgb(var(--w-color-primary));
}

.message-marker--tool {
  background: rgb(var(--w-color-warning));
}

.message-marker:hover,
.message-marker:focus-visible {
  --message-marker-scale-y: 1.35;

  outline: none;
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

  position: absolute;
  top: 50%;
  right: calc(100% + 10px);
  display: grid;
  gap: 4px;
  width: 210px;
  padding: 9px 10px;
  pointer-events: none;
  background: rgb(var(--w-bg-container) / 96%);
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 6px;
  box-shadow: var(--w-shadow-elevated);
  backdrop-filter: blur(12px);
  transform: translate3d(0, calc(-50% + var(--message-preview-offset-y)), 0);
  transition: transform var(--w-motion-duration-slow) var(--w-motion-ease-enter);
  will-change: transform, opacity;
}

.message-preview__type {
  font-size: 11px;
  font-weight: 600;
  color: rgb(var(--w-color-primary));
}

.message-preview__content {
  display: -webkit-box;
  overflow: hidden;
  font-size: 12px;
  line-height: 18px;
  color: rgb(var(--w-text-main));
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
}

.message-preview-enter-active,
.message-preview-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-slow) var(--w-motion-ease-enter);
}

.message-preview-enter-from,
.message-preview-leave-to {
  opacity: 0;
  transform: translate3d(8px, calc(-50% + var(--message-preview-offset-y)), 0)
    scale(0.96);
}

@media (width <= 900px) {
  .message-minimap {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .message-marker,
  .message-preview,
  .message-preview-enter-active,
  .message-preview-leave-active {
    transition-duration: 1ms;
  }
}
</style>
