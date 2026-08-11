<script setup lang="ts">
import type { ChartDataSource, ChartScreenConfig, ChartWidget } from '../types'
import WidgetPreview from './controls/WidgetPreview.vue'

const props = defineProps<{
  index: number
  isDragging: boolean
  isSelected: boolean
  screenConfig: ChartScreenConfig
  source?: ChartDataSource
  widget: ChartWidget
}>()

const emit = defineEmits<{
  duplicateWidget: [id: string]
  pointerCancel: [event: PointerEvent]
  pointerDown: [event: PointerEvent, widget: ChartWidget, index: number]
  pointerMove: [event: PointerEvent]
  pointerUp: [event: PointerEvent]
  removeWidget: [id: string]
  selectWidget: [id: string]
}>()
</script>

<template>
  <article
    class="chart-widget-card group min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-white/10 border-solid bg-[rgb(9_18_36_/_78%)] p-12 backdrop-blur transition hover:border-white/24"
    :class="{
      'opacity-35': isDragging,
      'ring-2 ring-primary': isSelected,
    }"
    data-testid="chart-designer-widget"
    :data-chart-selected-widget="isSelected ? 'true' : undefined"
    :data-chart-widget-id="widget.id"
    :style="{
      gridColumn: `span ${widget.colSpan}`,
      gridRow: `span ${widget.rowSpan}`,
    }"
    @click.stop="emit('selectWidget', widget.id)"
    @pointercancel="emit('pointerCancel', $event)"
    @pointerdown="emit('pointerDown', $event, widget, props.index)"
    @pointermove="emit('pointerMove', $event)"
    @pointerup="emit('pointerUp', $event)"
  >
    <div class="mb-8 flex items-start justify-between gap-8">
      <div class="min-w-0">
        <h4
          class="chart-widget-title m-0 truncate text-14px font-700 text-white"
        >
          {{ widget.title }}
        </h4>
        <p
          class="chart-widget-subtitle m-0 mt-3 truncate text-11px text-white/42"
        >
          {{ widget.subtitle }}
        </p>
      </div>
      <div class="flex opacity-0 transition group-hover:opacity-100">
        <a-button
          class="chart-widget-action-button"
          data-chart-widget-action="duplicate"
          size="small"
          @click.stop="emit('duplicateWidget', widget.id)"
        >
          <template #icon>
            <Icon name="i-lucide:copy" :size="14" />
          </template>
        </a-button>
        <a-button
          danger
          class="chart-widget-action-button ml-4"
          data-chart-widget-action="remove"
          size="small"
          @click.stop="emit('removeWidget', widget.id)"
        >
          <template #icon>
            <Icon name="i-lucide:trash-2" :size="14" />
          </template>
        </a-button>
      </div>
    </div>

    <WidgetPreview
      :source="source"
      :screen-config="screenConfig"
      :widget="widget"
    />
  </article>
</template>

<style scoped>
.chart-widget-action-button {
  width: 26px;
  padding-inline: 0;
}
</style>
