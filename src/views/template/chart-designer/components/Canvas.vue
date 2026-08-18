<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import { CHART_DESIGNER_SELECTORS } from '../constants'
import { useChartCanvasDrag } from '../composables/useCanvasDrag'
import { useChartCanvasSelection } from '../composables/useCanvasSelection'
import type {
  ChartDataSource,
  ChartDesignerStats,
  ChartScreenConfig,
  ChartWidget,
} from '../types'
import CanvasHeader from './CanvasHeader.vue'
import CanvasWidget from './CanvasWidget.vue'
import SelectionActionBar from './SelectionActionBar.vue'
import ScreenTitleBar from './ScreenTitleBar.vue'

const props = defineProps<{
  activeSourceId: string
  dataSources: readonly ChartDataSource[]
  screenConfig: ChartScreenConfig
  selectedWidgetId: string
  selectedWidgetIds: readonly string[]
  stats: ChartDesignerStats
  widgets: readonly ChartWidget[]
}>()

const emit = defineEmits<{
  clearSelection: []
  duplicateSelectedWidgets: []
  duplicateWidget: [id: string]
  dropWidget: [event: DragEvent, insertIndex?: number]
  openDataSource: []
  removeSelectedWidgets: []
  removeWidget: [id: string]
  reorderWidgets: [orderedIds: string[], selectedId: string]
  selectDataSource: [id: string]
  selectManyWidgets: [ids: readonly string[]]
  selectWidget: [id: string]
  updateScreen: [patch: Partial<ChartScreenConfig>]
}>()

const screenStyle = computed(() => ({
  aspectRatio: `${props.screenConfig.width} / ${props.screenConfig.height}`,
}))
const canvasViewportStyle = computed(() => ({
  backgroundColor: props.screenConfig.canvasBackground,
}))
const widgetsRef = computed(() => props.widgets)
const selectedWidgetIdsRef = computed(() => props.selectedWidgetIds)
const widgetGridRef = useTemplateRef<HTMLElement>('widgetGridRef')
const screenRef = useTemplateRef<HTMLElement>('screenRef')

const {
  dragOverlayStyle,
  draggingWidget,
  isDraggingWidget,
  orderedWidgets,
  placeholderStyle,
  handlePaletteDragOver,
  handlePaletteDrop,
  handleWidgetPointerCancel,
  handleWidgetPointerDown,
  handleWidgetPointerEnd,
  handleWidgetPointerMove,
  refreshAfterDomUpdate,
} = useChartCanvasDrag({
  widgets: widgetsRef,
  onDropWidget: (event, insertIndex) => emit('dropWidget', event, insertIndex),
  onReorder: (orderedIds, selectedId) =>
    emit('reorderWidgets', orderedIds, selectedId),
  onSelect: (id) => emit('selectWidget', id),
})

const {
  activeSelectedWidgetIds,
  hasSelection,
  isMarqueeSelecting,
  marqueeStyle,
  selectedCount,
} = useChartCanvasSelection({
  canvas: screenRef,
  selectedWidgetIds: selectedWidgetIdsRef,
  widgets: widgetsRef,
  onClearSelection: () => emit('clearSelection'),
  onDuplicateSelected: () => emit('duplicateSelectedWidgets'),
  onRemoveSelected: () => emit('removeSelectedWidgets'),
  onSelectMany: (ids) => emit('selectManyWidgets', ids),
})

watch(
  () => props.widgets.map((widget) => widget.id).join('|'),
  () => refreshAfterDomUpdate(widgetGridRef.value ?? undefined),
  { flush: 'post', immediate: true }
)

function getSource(sourceId: string) {
  return props.dataSources.find((source) => source.id === sourceId)
}

function handleGridDragOver(event: DragEvent) {
  handlePaletteDragOver(event)
}

function handleGridDrop(event: DragEvent) {
  const grid = widgetGridRef.value
  if (!grid) return

  handlePaletteDrop(event, grid)
}

function handleWidgetPointerMoveWithGrid(event: PointerEvent) {
  const grid = widgetGridRef.value
  if (!grid) return

  handleWidgetPointerMove(event, grid)
}

function handleWidgetClick(id: string) {
  emit('selectWidget', id)
}
</script>

<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-elevated)]"
  >
    <CanvasHeader
      :active-source-id="activeSourceId"
      :data-sources="dataSources"
      :screen-config="screenConfig"
      :stats="stats"
      @open-data-source="emit('openDataSource')"
      @select-source="emit('selectDataSource', $event)"
      @update-screen="emit('updateScreen', $event)"
    />

    <Scrollbar
      class="min-h-0"
      content-class="min-h-full p-16"
      :style="canvasViewportStyle"
    >
      <div
        ref="screenRef"
        class="chart-screen relative mx-auto min-w-860 overflow-hidden rounded-8 border-1 border-white/12 border-solid p-18 shadow-[0_32px_90px_rgb(0_0_0_/_35%)]"
        :class="[
          `chart-screen--${screenConfig.theme}`,
          `chart-screen-preview--${screenConfig.previewMode}`,
        ]"
        :style="screenStyle"
        :data-testid="CHART_DESIGNER_SELECTORS.canvasDropzone"
        data-chart-canvas-dropzone="true"
        data-chart-marquee-area="true"
        @dragover="handleGridDragOver"
        @drop="handleGridDrop"
        @click.self="emit('clearSelection')"
      >
        <SelectionActionBar
          v-if="hasSelection"
          :selected-count="selectedCount"
          @copy="emit('duplicateSelectedWidgets')"
          @remove="emit('removeSelectedWidgets')"
        />

        <ScreenTitleBar :screen-config="screenConfig" :stats="stats" />

        <div
          ref="widgetGridRef"
          class="chart-screen__grid"
          @dragover="handleGridDragOver"
          @drop="handleGridDrop"
        >
          <CanvasWidget
            v-for="(widget, index) in orderedWidgets"
            :key="widget.id"
            :index="index"
            :is-dragging="draggingWidget?.id === widget.id"
            :is-selected="activeSelectedWidgetIds.includes(widget.id)"
            :screen-config="screenConfig"
            :source="getSource(widget.sourceId)"
            :widget="widget"
            @duplicate-widget="emit('duplicateWidget', $event)"
            @pointer-cancel="handleWidgetPointerCancel"
            @pointer-down="handleWidgetPointerDown"
            @pointer-move="handleWidgetPointerMoveWithGrid"
            @pointer-up="handleWidgetPointerEnd"
            @remove-widget="emit('removeWidget', $event)"
            @select-widget="handleWidgetClick"
          />

          <div
            v-if="isDraggingWidget"
            class="chart-widget-placeholder rounded-8 border-1 border-dashed border-primary bg-primary/12"
            :style="placeholderStyle"
          ></div>
        </div>

        <div
          v-if="isMarqueeSelecting"
          class="pointer-events-none absolute left-0 top-0 z-30 rounded-6 border-1 border-primary border-solid bg-primary/14"
          :style="marqueeStyle"
        ></div>

        <div
          v-if="isDraggingWidget && draggingWidget"
          class="chart-widget-drag-overlay pointer-events-none fixed left-0 top-0 z-3000"
          :style="dragOverlayStyle"
        >
          <div
            class="h-full min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-primary border-solid bg-[rgb(9_18_36_/_92%)] p-12 shadow-[0_18px_44px_rgb(0_0_0_/_35%)]"
          >
            <h4 class="m-0 truncate text-14px font-700 text-white">
              {{ draggingWidget.title }}
            </h4>
            <p class="m-0 mt-6 text-12px text-white/56">拖拽调整布局位置</p>
          </div>
        </div>
      </div>
    </Scrollbar>
  </section>
</template>

<style scoped>
.chart-screen {
  background:
    linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px),
    linear-gradient(0deg, rgb(255 255 255 / 5%) 1px, transparent 1px),
    radial-gradient(circle at 18% 14%, rgb(34 211 238 / 18%), transparent 30%),
    radial-gradient(circle at 80% 4%, rgb(59 130 246 / 18%), transparent 28%),
    rgb(4 13 28);
  background-size:
    44px 44px,
    44px 44px,
    auto,
    auto,
    auto;
}

.chart-screen--light {
  background:
    linear-gradient(90deg, rgb(15 23 42 / 7%) 1px, transparent 1px),
    linear-gradient(0deg, rgb(15 23 42 / 7%) 1px, transparent 1px),
    rgb(241 245 249);
}

.chart-screen--matrix {
  background:
    linear-gradient(90deg, rgb(34 197 94 / 9%) 1px, transparent 1px),
    linear-gradient(0deg, rgb(34 197 94 / 9%) 1px, transparent 1px),
    rgb(3 12 10);
}

.chart-screen-preview--light .chart-widget-card {
  background: rgb(255 255 255 / 78%);
  border-color: rgb(15 23 42 / 10%);
}

.chart-screen-preview--light .chart-widget-title {
  color: rgb(15 23 42);
}

.chart-screen-preview--light .chart-widget-subtitle {
  color: rgb(71 85 105 / 72%);
}

.chart-screen__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: minmax(128px, 1fr);
  gap: 12px;
  min-height: calc(100% - 72px);
}
</style>
