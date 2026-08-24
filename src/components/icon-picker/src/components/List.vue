<script setup lang="ts">
import { useVirtualizer } from '@tanstack/vue-virtual'
import Preview from './Preview.vue'
import type { CSSProperties } from 'vue'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { IconSelectorOption } from '../types'

const ROW_HEIGHT = 72

const props = withDefaults(
  defineProps<{
    columns: number
    emptyText: string
    fillHeight?: boolean
    iconSize: number
    items: readonly IconSelectorOption[]
    maxHeight: number
    motion?: boolean
    overscan?: number
    selectedValue?: string
    showNameTooltip?: boolean
  }>(),
  {
    fillHeight: false,
    motion: false,
    overscan: 4,
    selectedValue: undefined,
    showNameTooltip: false,
  }
)

const emit = defineEmits<{
  select: [option: IconSelectorOption]
}>()

const scrollElement = useTemplateRef<HTMLDivElement>('scrollElement')
const overflowTooltipValue = shallowRef<string>()
const safeColumns = computed(() => Math.max(2, props.columns))
const rowCount = computed(() =>
  Math.ceil(props.items.length / safeColumns.value)
)

const virtualizerOptions = computed(() => ({
  count: rowCount.value,
  estimateSize: () => ROW_HEIGHT,
  getItemKey: (index: number) =>
    props.items[index * safeColumns.value]?.value ?? index,
  getScrollElement: () => scrollElement.value,
  overscan: props.overscan,
  useAnimationFrameWithResizeObserver: true,
}))

const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>(
  virtualizerOptions
)
const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const viewportHeight = computed(() => {
  if (props.fillHeight) return props.maxHeight
  return Math.min(props.maxHeight, Math.max(ROW_HEIGHT, totalSize.value))
})
const viewportStyle = computed<CSSProperties>(() => ({
  height: `${viewportHeight.value}px`,
}))
const surfaceStyle = computed<CSSProperties>(() => ({
  height: `${totalSize.value}px`,
}))
const emptyStyle = computed<CSSProperties | undefined>(() =>
  props.fillHeight ? { height: `${props.maxHeight}px` } : undefined
)

watch(
  () => props.items,
  async () => {
    overflowTooltipValue.value = undefined
    await nextTick()
    virtualizer.value.scrollToOffset(0)
  }
)

function getRowItems(rowIndex: number) {
  const start = rowIndex * safeColumns.value
  return props.items.slice(start, start + safeColumns.value)
}

function getRowStyle(row: VirtualItem): CSSProperties {
  return {
    gridTemplateColumns: `repeat(${safeColumns.value}, minmax(0, 1fr))`,
    transform: `translate3d(0, ${row.start}px, 0)`,
  }
}

function getVirtualRowKey(row: VirtualItem) {
  return typeof row.key === 'bigint' ? row.key.toString() : row.key
}

function handleNameTooltipShow(event: Event, option: IconSelectorOption) {
  if (!props.showNameTooltip) return

  const button = event.currentTarget as HTMLElement
  const label = button.querySelector<HTMLElement>('[data-icon-name]')
  overflowTooltipValue.value =
    label && label.scrollWidth > label.clientWidth ? option.value : undefined
}

function handleNameTooltipHide(option: IconSelectorOption) {
  if (overflowTooltipValue.value === option.value) {
    overflowTooltipValue.value = undefined
  }
}

function handleViewportScroll() {
  overflowTooltipValue.value = undefined
}
</script>

<template>
  <div
    v-if="items.length"
    ref="scrollElement"
    class="w-icon-selector-viewport min-h-0 w-full overflow-x-hidden overflow-y-auto p-6"
    :style="viewportStyle"
    role="listbox"
    aria-label="图标列表"
    @scroll.passive="handleViewportScroll"
  >
    <div class="relative w-full" :style="surfaceStyle">
      <div
        v-for="virtualRow in virtualRows"
        :key="getVirtualRowKey(virtualRow)"
        class="absolute left-0 top-0 grid h-64 w-full gap-6 will-change-transform"
        :style="getRowStyle(virtualRow)"
      >
        <button
          v-for="(option, columnIndex) in getRowItems(virtualRow.index)"
          :key="option.value"
          type="button"
          class="w-icon-selector-option group relative box-border h-64 min-w-0 flex cursor-pointer flex-col items-center justify-center gap-5 rounded-6 border-1 border-color-1 border-solid bg-container px-5 text-main transition-colors hover:(border-primary bg-hover) focus-visible:(border-primary outline-none ring-2 ring-primary/15) disabled:(cursor-not-allowed bg-disabled text-disabled)"
          :class="{
            'border-primary bg-selected text-primary':
              option.value === selectedValue,
            'w-icon-selector-option--motion': motion,
          }"
          :disabled="option.disabled"
          :aria-selected="option.value === selectedValue"
          :aria-posinset="virtualRow.index * safeColumns + columnIndex + 1"
          :aria-setsize="items.length"
          :title="
            showNameTooltip ? undefined : `${option.label} (${option.value})`
          "
          role="option"
          @mousedown.prevent
          @pointerenter="handleNameTooltipShow($event, option)"
          @pointerleave="handleNameTooltipHide(option)"
          @focus="handleNameTooltipShow($event, option)"
          @blur="handleNameTooltipHide(option)"
          @click="emit('select', option)"
        >
          <Preview
            :name="option.value"
            :size="iconSize + 4"
            class="w-icon-selector-option__preview pointer-events-none shrink-0"
          />
          <a-tooltip
            v-if="showNameTooltip"
            :open="overflowTooltipValue === option.value"
            :title="`${option.label} (${option.value})`"
            placement="bottom"
          >
            <span
              data-icon-name
              class="w-full truncate text-center text-xs leading-16"
            >
              {{ option.label }}
            </span>
          </a-tooltip>
          <span
            v-else
            data-icon-name
            class="w-full truncate text-center text-xs leading-16"
          >
            {{ option.label }}
          </span>
          <Icon
            v-if="option.value === selectedValue"
            name="i-lucide:check"
            :size="12"
            class="pointer-events-none absolute right-4 top-4 text-primary"
          />
        </button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="h-160 flex items-center justify-center"
    :style="emptyStyle"
  >
    <a-empty :description="emptyText" />
  </div>
</template>

<style scoped lang="less">
.w-icon-selector {
  &-viewport {
    overscroll-behavior: contain;
    scrollbar-color: rgb(var(--w-border-color-3)) transparent;
    scrollbar-width: thin;
  }

  &-option {
    &--motion {
      transition:
        color var(--w-motion-duration-base) var(--w-motion-ease-standard),
        background-color var(--w-motion-duration-base)
          var(--w-motion-ease-standard),
        border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
        transform var(--w-motion-duration-base) var(--w-motion-ease-enter);

      .w-icon-selector-option__preview {
        transition: transform var(--w-motion-duration-base)
          var(--w-motion-ease-enter);
      }

      &:active:not(:disabled) {
        transform: scale(0.97);
      }

      @media (hover: hover) {
        &:hover:not(:disabled) {
          transform: translateY(-2px);

          .w-icon-selector-option__preview {
            transform: scale(1.08);
          }
        }
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &-option--motion,
    &-option--motion .w-icon-selector-option__preview {
      transition: none;
    }
  }
}
</style>
