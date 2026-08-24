<script setup lang="ts">
import { CHART_DESIGNER_SELECTORS } from './constants'
import { chartPalette, favoriteChartPalette } from './data'
import {
  AiPanel,
  Canvas,
  DataSourceModal,
  Header,
  HistoryModal,
  Inspector,
  PalettePanel,
  PreviewModal,
  SchemaModal,
  ShareModal,
} from './components'
import { cloneDataSource, cloneWidget } from './composables/schema'
import { useChartDesigner } from './composables/useDesigner'
import { useChartSchemaWorkspace } from './composables/useSchemaWorkspace'
import type { ChartDesignerSchema, ChartPaletteItem } from './types'

const {
  activeSourceId,
  aiBusy,
  aiMessages,
  aiPrompt,
  aiSuggestions,
  dataSources,
  designerStats,
  jsonDraft,
  screenConfig,
  selectedFields,
  selectedWidget,
  selectedWidgetId,
  selectedWidgetIds,
  widgets,
  addWidget,
  applyAiToSelectedWidget,
  applySuggestion,
  clearSelection,
  copySchema,
  duplicateSelectedWidgets,
  duplicateWidget,
  exportSchema,
  generateFromPrompt,
  getSchemaText,
  importJsonSource,
  removeSelectedWidgets,
  removeWidget,
  reorderWidgets,
  selectDataSource,
  selectManyWidgets,
  selectWidget,
  updateDataSource,
  updateScreenConfig,
  updateWidget,
} = useChartDesigner()

const dataSourceModalOpen = shallowRef(false)

const {
  history,
  historyOpen,
  previewOpen,
  schemaDraft,
  schemaError,
  schemaOpen,
  shareOpen,
  shareUrl,
  copyShareUrl,
  formatSchemaDraft,
  openHistory,
  openPreview,
  openSchema,
  openShare,
  restoreHistory,
} = useChartSchemaWorkspace({
  applySchema,
  getSchemaText,
})

function getPaletteDragKey(item: ChartPaletteItem) {
  return `${item.kind}:${item.type}`
}

function handlePaletteDragStart(item: ChartPaletteItem, event: DragEvent) {
  const key = getPaletteDragKey(item)
  event.dataTransfer?.setData('chart-palette-item', key)
  event.dataTransfer?.setData('text/plain', key)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
  }
}

function handleCanvasDrop(event: DragEvent, insertIndex?: number) {
  const key = event.dataTransfer?.getData('chart-palette-item')
  const item = chartPalette.find(
    (paletteItem) => getPaletteDragKey(paletteItem) === key
  )
  if (!item) return

  addWidget(item, insertIndex)
}

function applySchema(schema: ChartDesignerSchema) {
  screenConfig.value = { ...schema.screen }
  dataSources.value = schema.dataSources.map(cloneDataSource)
  widgets.value = schema.widgets.map(cloneWidget)
  activeSourceId.value = dataSources.value[0]?.id ?? ''
  selectManyWidgets(widgets.value[0] ? [widgets.value[0].id] : [])
}
</script>

<template>
  <WView :full="true" :padding="0" class="chart-designer-page">
    <main
      class="h-[calc(100dvh-90px)] min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] gap-12 overflow-hidden bg-page p-12 max-[980px]:p-8"
      :data-testid="CHART_DESIGNER_SELECTORS.page"
    >
      <Header
        :stats="designerStats"
        @copy-schema="copySchema"
        @export-schema="exportSchema"
        @open-history="openHistory"
        @open-preview="openPreview"
        @open-schema="openSchema"
        @open-share="openShare"
      />

      <section
        class="min-h-0 min-w-0 grid grid-cols-[280px_minmax(560px,1fr)_340px] gap-12 overflow-hidden max-[1500px]:grid-cols-[260px_minmax(500px,1fr)_320px] max-[980px]:grid-cols-[220px_minmax(440px,1fr)_300px]"
      >
        <div
          class="min-h-0 grid grid-rows-[minmax(0,1fr)] gap-12 overflow-hidden max-[980px]:min-h-[720px]"
        >
          <PalettePanel
            :favorites="favoriteChartPalette"
            :palette="chartPalette"
            @add-widget="addWidget"
            @drag-start="handlePaletteDragStart"
          />
        </div>

        <Canvas
          :active-source-id="activeSourceId"
          :data-sources="dataSources"
          :screen-config="screenConfig"
          :selected-widget-id="selectedWidgetId"
          :selected-widget-ids="selectedWidgetIds"
          :stats="designerStats"
          :widgets="widgets"
          @clear-selection="clearSelection"
          @duplicate-selected-widgets="duplicateSelectedWidgets"
          @duplicate-widget="duplicateWidget"
          @drop-widget="handleCanvasDrop"
          @open-data-source="dataSourceModalOpen = true"
          @remove-selected-widgets="removeSelectedWidgets"
          @remove-widget="removeWidget"
          @reorder-widgets="reorderWidgets"
          @select-data-source="selectDataSource"
          @select-many-widgets="selectManyWidgets"
          @select-widget="selectWidget"
          @update-screen="updateScreenConfig"
        />

        <div
          class="min-h-0 grid grid-rows-[minmax(360px,0.64fr)_minmax(240px,0.36fr)] gap-12 overflow-hidden max-[980px]:min-h-[720px]"
        >
          <Inspector
            :data-sources="dataSources"
            :fields="selectedFields"
            :widget="selectedWidget"
            @duplicate-widget="duplicateWidget"
            @remove-widget="removeWidget"
            @update-widget="updateWidget"
          />
          <AiPanel
            v-model:prompt="aiPrompt"
            :busy="aiBusy"
            :can-update-selected="!!selectedWidget"
            :messages="aiMessages"
            :suggestions="aiSuggestions"
            @apply-suggestion="applySuggestion"
            @generate="generateFromPrompt()"
            @update-selected="applyAiToSelectedWidget()"
          />
        </div>
      </section>

      <DataSourceModal
        v-model:json-draft="jsonDraft"
        v-model:open="dataSourceModalOpen"
        :active-source-id="activeSourceId"
        :data-sources="dataSources"
        @import-json="importJsonSource"
        @select-source="selectDataSource"
        @update-source="updateDataSource"
      />
      <SchemaModal
        v-model:draft="schemaDraft"
        v-model:open="schemaOpen"
        :error="schemaError"
        @copy="copySchema"
        @export="exportSchema"
        @format="formatSchemaDraft"
      />
      <HistoryModal
        v-model:open="historyOpen"
        :history="history"
        @restore="restoreHistory"
      />
      <PreviewModal
        v-model:open="previewOpen"
        :data-sources="dataSources"
        :screen-config="screenConfig"
        :widgets="widgets"
      />
      <ShareModal
        v-model:open="shareOpen"
        :url="shareUrl"
        @copy="copyShareUrl"
      />
    </main>
  </WView>
</template>
