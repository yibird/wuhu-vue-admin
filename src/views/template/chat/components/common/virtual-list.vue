<template>
  <Scrollbar
    ref="scrollbarRef"
    class="min-h-0 h-full w-full"
    content-class="min-h-full p-10"
    :events="scrollbarEvents"
  >
    <div
      v-if="items.length"
      class="relative w-full"
      role="list"
      :aria-label="ariaLabel"
      :style="surfaceStyle"
    >
      <div
        v-for="virtualItem in virtualItems"
        :key="getVirtualItemKey(virtualItem)"
        :ref="measureElement"
        :data-index="virtualItem.index"
        class="absolute left-0 top-0 w-full will-change-transform"
        role="listitem"
        :style="getItemStyle(virtualItem)"
      >
        <slot :item="getItem(virtualItem.index)" :index="virtualItem.index" />
      </div>
    </div>
    <div v-else class="h-full min-h-full">
      <slot name="empty" />
    </div>
  </Scrollbar>
</template>

<script setup lang="ts" generic="T">
import { useVirtualizer } from '@tanstack/vue-virtual'
import { Scrollbar } from '@/components'
import type { ScrollbarInstance } from '@/components/scrollbar'
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { EventListeners } from 'overlayscrollbars'
import type { VirtualItem } from '@tanstack/vue-virtual'

const props = withDefaults(
  defineProps<{
    items: readonly T[]
    estimateSize?: number | ((item: T, index: number) => number)
    overscan?: number
    ariaLabel?: string
    getItemKey?: (item: T, index: number) => string | number
  }>(),
  {
    estimateSize: 64,
    overscan: 6,
    ariaLabel: undefined,
    getItemKey: undefined,
  }
)

const emits = defineEmits<{
  scroll: [event: Event]
}>()

defineSlots<{
  default(props: { item: T; index: number }): unknown
  empty(): unknown
}>()

/**
 * 滚动容器交给项目统一的 Scrollbar 组件(OverlayScrollbars),
 * 虚拟列表仍然以它的 viewport 作为滚动元素
 */
const scrollbarRef = useTemplateRef<ScrollbarInstance>('scrollbarRef')
const getScrollElement = () => scrollbarRef.value?.getScrollElement() ?? null

/**
 * 实际的滚动事件发生在 OverlayScrollbars 的 viewport 上,
 * 不会冒泡到根节点,因此通过组件的 events 选项转发
 */
const scrollbarEvents = {
  scroll: (_instance, event) => emits('scroll', event),
} satisfies EventListeners

const virtualizerOptions = computed(() => ({
  count: props.items.length,
  getScrollElement,
  estimateSize: (index: number) =>
    typeof props.estimateSize === 'function'
      ? props.estimateSize(props.items[index] as T, index)
      : props.estimateSize,
  getItemKey: (index: number) =>
    props.getItemKey?.(props.items[index] as T, index) ?? index,
  overscan: props.overscan,
  useAnimationFrameWithResizeObserver: true,
}))

const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(virtualizerOptions)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const surfaceStyle = computed<CSSProperties>(() => ({
  height: `${totalSize.value}px`,
}))
function getItemStyle(item: VirtualItem): CSSProperties {
  return {
    transform: `translate3d(0, ${item.start}px, 0)`,
  }
}

function getItem(index: number) {
  return props.items[index] as T
}

function getVirtualItemKey(item: VirtualItem) {
  return typeof item.key === 'bigint' ? item.key.toString() : item.key
}

function measureElement(element: Element | ComponentPublicInstance | null) {
  const target =
    element instanceof HTMLElement
      ? element
      : element instanceof Element
        ? null
        : element?.$el
  if (target instanceof HTMLElement) virtualizer.value.measureElement(target)
}

defineExpose<{
  getScrollElement: () => HTMLElement | null
  scrollToIndex: (index: number) => void
}>({
  getScrollElement,
  scrollToIndex: (index: number) =>
    virtualizer.value.scrollToIndex(index, { align: 'start' }),
})
</script>
