<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { message } from 'antdv-next'
import {
  CanvasStage as ReportCanvasStage,
  DataSourceModal as ReportDataSourceModal,
  DesignerCanvas as ReportDesignerCanvas,
  FieldPanel as ReportFieldPanel,
  RightTabs as ReportRightTabs,
  SchemaModal as ReportSchemaModal,
  TemplateSettingsModal as ReportTemplateSettingsModal,
  Toolbar as ReportToolbar,
} from './components'
import {
  defaultDataSourceConfig,
  enterpriseCapabilityGroups,
  exportOptions,
  requirementPhases,
} from './data'
import { useReportDesigner } from './composables/useReportDesigner'
import type { DataSourceConfig } from './types'

type SourceModalMode = 'create' | 'edit'

const {
  activeSourceId,
  dataSources,
  designerStats,
  enabledFields,
  exportStatus,
  exportWarning,
  fields,
  filters,
  isLoading,
  isProcessing,
  loadError,
  processingError,
  previewRows,
  reportSchema,
  rows,
  schemaSource,
  settings,
  sorts,
  sourceConfig,
  summaryValues,
  templateStatus,
  templates,
  addField,
  addComputedField,
  addFilter,
  addSort,
  deleteTemplate,
  deleteDataSource,
  exportReport,
  formatCell,
  importReportSchema,
  loadActiveSourceData,
  loadTemplate,
  moveField,
  removeField,
  renameFieldKey,
  reorderFields,
  removeComputedField,
  removeFilter,
  removeSort,
  saveTemplate,
  saveDataSource,
  selectDataSource,
  testFormatCell,
  toggleField,
  updateField,
  updateFilter,
  updateSettings,
  updateSort,
} = useReportDesigner()

const rowCount = computed(() => rows.value.length)
const dataBusy = computed(() => isLoading.value || isProcessing.value)
const dataError = computed(() => loadError.value || processingError.value)
const fieldCount = computed(() => fields.value.length)
const reportViewMode = shallowRef<'table' | 'chart'>('table')
const sourceModalOpen = shallowRef(false)
const sourceModalMode = shallowRef<SourceModalMode>('create')
const editingSourceId = shallowRef<string>()
const sourceModalConfig = shallowRef<DataSourceConfig>(
  createSourceConfig({ kind: 'rest', name: '' })
)
const templateSettingsOpen = shallowRef(false)
const schemaModalOpen = shallowRef(false)
const schemaDraft = shallowRef('')
const schemaError = shallowRef('')

function createSourceConfig(patch: Partial<DataSourceConfig> = {}) {
  return {
    ...defaultDataSourceConfig,
    ...patch,
  }
}

function openCreateSource() {
  editingSourceId.value = undefined
  sourceModalMode.value = 'create'
  sourceModalConfig.value = createSourceConfig({ kind: 'rest', name: '' })
  sourceModalOpen.value = true
}

function openEditSource() {
  editingSourceId.value = activeSourceId.value
  sourceModalMode.value = 'edit'
  sourceModalConfig.value = createSourceConfig(sourceConfig)
  sourceModalOpen.value = true
}

function saveSource(config: DataSourceConfig) {
  saveDataSource({
    config,
    id: sourceModalMode.value === 'edit' ? editingSourceId.value : undefined,
  })
}

function openSchemaModal() {
  schemaDraft.value = schemaSource.value
  schemaError.value = ''
  schemaModalOpen.value = true
}

function closeSchemaModal() {
  schemaModalOpen.value = false
}

function updateSchemaDraft(value: string) {
  schemaDraft.value = value
  schemaError.value = ''
}

function formatSchemaDraft() {
  try {
    schemaDraft.value = JSON.stringify(JSON.parse(schemaDraft.value), null, 2)
    schemaError.value = ''
  } catch (error) {
    schemaError.value =
      error instanceof Error ? error.message : 'Schema 格式化失败'
  }
}

function applySchemaDraft() {
  try {
    importReportSchema(schemaDraft.value)
    schemaDraft.value = schemaSource.value
    schemaError.value = ''
    message.success('报表 Schema 已应用')
  } catch (error) {
    schemaError.value =
      error instanceof Error ? error.message : 'Schema 解析失败'
    message.error(schemaError.value)
  }
}

async function copySchemaDraft() {
  try {
    await navigator.clipboard.writeText(schemaDraft.value)
    message.success('报表 Schema 已复制')
  } catch {
    message.error('复制失败，请检查浏览器权限')
  }
}

function exportSchemaDraft() {
  try {
    JSON.parse(schemaDraft.value)
    const url = URL.createObjectURL(
      new Blob([schemaDraft.value], {
        type: 'application/schema+json;charset=utf-8',
      })
    )
    const link = document.createElement('a')
    const fileName = settings.fileName.trim().replace(/[\\/:*?"<>|]/g, '-')
    link.href = url
    link.download = `${fileName || 'report-export'}.schema.json`
    link.click()
    URL.revokeObjectURL(url)
    schemaError.value = ''
    message.success('报表 Schema 已导出')
  } catch (error) {
    schemaError.value =
      error instanceof Error ? error.message : 'Schema 不是合法 JSON'
    message.error(schemaError.value)
  }
}
</script>

<template>
  <WView
    :full="true"
    :padding="0"
    class="w-full h-[calc(100vh-90px)] min-h-0 max-h-[calc(100vh-90px)] overflow-hidden bg-page"
  >
    <main
      class="report-designer box-border w-full min-w-0 h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-12 overflow-hidden p-12 text-main max-[640px]:p-8"
    >
      <ReportToolbar
        :export-options="exportOptions"
        :export-status="exportStatus"
        :phases="requirementPhases"
        :row-count="rowCount"
        :schema-version="reportSchema.version"
        :template-type="settings.templateType"
        @export="exportReport"
        @open-schema="openSchemaModal"
        @open-template-settings="templateSettingsOpen = true"
      />

      <section
        class="report-designer__workspace min-w-0 h-full min-h-0 grid gap-12 overflow-hidden max-[640px]:gap-8"
      >
        <ReportFieldPanel
          :fields="fields"
          :format-cell="formatCell"
          :sample-rows="previewRows"
          :test-format-cell="testFormatCell"
          @add-field="addField"
          @move-field="moveField"
          @remove-field="removeField"
          @rename-field-key="renameFieldKey"
          @reorder-fields="reorderFields"
          @toggle-field="toggleField"
          @update-field="updateField"
        />

        <ReportCanvasStage
          :active-source-id="activeSourceId"
          :config="sourceConfig"
          :data-sources="dataSources"
          :field-count="fieldCount"
          :is-loading="dataBusy"
          :load-error="dataError"
          :row-count="rowCount"
          @create-source="openCreateSource"
          @delete-source="deleteDataSource"
          @edit-source="openEditSource"
          @load-source="loadActiveSourceData"
          @open-template-settings="templateSettingsOpen = true"
          @select-source="selectDataSource"
        >
          <ReportDesignerCanvas
            class="h-full"
            :fields="enabledFields"
            :format-cell="formatCell"
            :preview-rows="previewRows"
            :row-count="rowCount"
            :settings="settings"
            :stats="designerStats"
            :summaries="summaryValues"
            :view-mode="reportViewMode"
            :warning="exportWarning"
          />
        </ReportCanvasStage>

        <ReportRightTabs
          v-model:view-mode="reportViewMode"
          :capability-groups="enterpriseCapabilityGroups"
          :fields="fields"
          :filters="filters"
          :row-count="rowCount"
          :schema="reportSchema"
          :settings="settings"
          :sorts="sorts"
          :summaries="summaryValues"
          :template-status="templateStatus"
          :templates="templates"
          @add-computed-field="addComputedField"
          @add-filter="addFilter"
          @add-sort="addSort"
          @delete-template="deleteTemplate"
          @export="exportReport"
          @load-template="loadTemplate"
          @remove-computed-field="removeComputedField"
          @remove-filter="removeFilter"
          @remove-sort="removeSort"
          @save-template="saveTemplate"
          @update-field="updateField"
          @update-filter="updateFilter"
          @update-settings="updateSettings"
          @update-sort="updateSort"
        />
      </section>

      <ReportDataSourceModal
        v-model:open="sourceModalOpen"
        :config="sourceModalConfig"
        :mode="sourceModalMode"
        @save="saveSource"
      />

      <ReportTemplateSettingsModal
        v-model:open="templateSettingsOpen"
        :settings="settings"
        @update-settings="updateSettings"
      />

      <ReportSchemaModal
        :error="schemaError"
        :open="schemaModalOpen"
        :source-code="schemaDraft"
        @apply="applySchemaDraft"
        @close="closeSchemaModal"
        @copy="copySchemaDraft"
        @export="exportSchemaDraft"
        @format="formatSchemaDraft"
        @source-change="updateSchemaDraft"
      />
    </main>
  </WView>
</template>

<style scoped lang="less">
.report-designer {
  background:
    linear-gradient(
      90deg,
      rgb(var(--w-border-color-1) / 58%) 1px,
      transparent 1px
    ),
    linear-gradient(
      0deg,
      rgb(var(--w-border-color-1) / 58%) 1px,
      transparent 1px
    ),
    rgb(var(--w-bg-page));
  background-size: 36px 36px;
}

.report-designer__workspace {
  grid-template:
    'field canvas right' minmax(0, 1fr)
    / 340px minmax(520px, 1fr) 380px;
}

.report-designer__workspace :deep(.field-panel) {
  grid-area: field;
  max-height: 100%;
}

.report-designer__workspace :deep(.report-canvas-stage) {
  grid-area: canvas;
  max-height: 100%;
}

.report-designer__workspace :deep(.report-right-tabs) {
  grid-area: right;
  max-height: 100%;
}

@media (width <= 1800px) {
  .report-designer__workspace {
    grid-template:
      'field canvas right' minmax(0, 1fr)
      / 320px minmax(0, 1fr) 360px;
  }
}

@media (width <= 1280px) {
  .report-designer__workspace {
    grid-template:
      'field' minmax(420px, 0.32fr)
      'canvas' minmax(560px, 0.42fr)
      'right' minmax(420px, 0.26fr)
      / 1fr;
  }

  .report-designer__workspace :deep(.field-panel),
  .report-designer__workspace :deep(.report-canvas-stage),
  .report-designer__workspace :deep(.report-right-tabs) {
    min-height: 0;
  }
}
</style>
