<script setup lang="ts" generic="T">
import { computed, useTemplateRef } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { ScrollbarInstance, ScrollbarProps } from '@/components/scrollbar'

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

defineSlots<{
  default(props: { item: T; index: number }): unknown
  empty(): unknown
}>()

const scrollbar = useTemplateRef<ScrollbarInstance>('scrollbar')
const scrollbarOptions = {
  overflow: { x: 'hidden', y: 'scroll' },
} satisfies ScrollbarProps['options']

const virtualizerOptions = computed(() => ({
  count: props.items.length,
  getScrollElement: () => scrollbar.value?.getScrollElement() ?? null,
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
</script>

<template>
  <Scrollbar
    ref="scrollbar"
    :defer="false"
    :options="scrollbarOptions"
    class="min-h-0 overflow-hidden"
    content-class="min-h-full"
  >
    <div
      v-if="items.length"
      class="virtual-list-surface relative w-full"
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

<style scoped>
.virtual-list-surface {
  animation: chat-virtual-list-enter var(--w-motion-duration-moderate)
    var(--w-motion-ease-enter) both;
}

@keyframes chat-virtual-list-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 6px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .virtual-list-surface {
    animation: none;
  }
}
</style>
