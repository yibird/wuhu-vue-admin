<script setup lang="ts">
import { shallowRef } from 'vue'
import CapabilityPanel from './CapabilityPanel.vue'
import ExperiencePanel from './ExperiencePanel.vue'
import TransformPanel from './TransformPanel.vue'
import type {
  ExportFormat,
  FieldType,
  ReportCapabilityGroup,
  ReportDesignerSchema,
  ReportField,
  ReportFilter,
  ReportSettings,
  ReportSort,
  ReportSummary,
  ReportTemplateSnapshot,
} from '../types'

defineProps<{
  capabilityGroups: ReportCapabilityGroup[]
  fields: ReportField[]
  filters: ReportFilter[]
  rowCount: number
  schema: ReportDesignerSchema
  settings: ReportSettings
  sorts: ReportSort[]
  summaries: ReportSummary[]
  templateStatus: string
  templates: ReportTemplateSnapshot[]
}>()

const emit = defineEmits<{
  addComputedField: [
    payload: {
      expression: string
      key: string
      label: string
      type: FieldType
    },
  ]
  addFilter: []
  addSort: []
  deleteTemplate: [id: string]
  export: [format: ExportFormat]
  loadTemplate: [id: string]
  removeComputedField: [key: string]
  removeFilter: [id: string]
  removeSort: [id: string]
  saveTemplate: [name: string]
  updateField: [key: string, patch: Partial<ReportField>]
  updateFilter: [id: string, patch: Partial<ReportFilter>]
  updateSettings: [patch: Partial<ReportSettings>]
  updateSort: [id: string, patch: Partial<ReportSort>]
}>()

function handleUpdateField(key: string, patch: Partial<ReportField>) {
  emit('updateField', key, patch)
}
function handleUpdateFilter(id: string, patch: Partial<ReportFilter>) {
  emit('updateFilter', id, patch)
}
function handleUpdateSort(id: string, patch: Partial<ReportSort>) {
  emit('updateSort', id, patch)
}

const viewMode = defineModel<'table' | 'chart'>('viewMode', {
  default: 'table',
})
const activeTab = shallowRef('experience')
</script>

<template>
  <aside
    class="report-right-tabs grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8px border-1 border-color-2 border-solid bg-container"
  >
    <header
      class="flex min-h-44px items-center gap-8px border-b-1 border-b-solid border-color-2 px-12px"
    >
      <Icon name="i-lucide:panel-right" :size="18" class="text-info" />
      <h2 class="m-0 flex-1 text-15px text-primary font-700">配置面板</h2>
    </header>

    <a-tabs
      v-model:active-key="activeTab"
      class="report-right-tabs__tabs min-h-0"
      destroy-on-hidden
      size="small"
    >
      <a-tab-pane key="experience" tab="模板与视图">
        <Scrollbar class="h-full min-h-0" content-class="min-h-full p-12px">
          <ExperiencePanel
            v-model:view-mode="viewMode"
            :fields="fields"
            :row-count="rowCount"
            :settings="settings"
            :summaries="summaries"
            :templates="templates"
            @delete-template="emit('deleteTemplate', $event)"
            @export="emit('export', $event)"
            @load-template="emit('loadTemplate', $event)"
            @save-template="emit('saveTemplate', $event)"
            @update-settings="emit('updateSettings', $event)"
          />
        </Scrollbar>
      </a-tab-pane>

      <a-tab-pane key="transform" tab="数据加工">
        <Scrollbar class="h-full min-h-0" content-class="min-h-full p-12px">
          <TransformPanel
            :fields="fields"
            :filters="filters"
            :sorts="sorts"
            :template-status="templateStatus"
            :templates="templates"
            @add-computed-field="emit('addComputedField', $event)"
            @add-filter="emit('addFilter')"
            @add-sort="emit('addSort')"
            @delete-template="emit('deleteTemplate', $event)"
            @load-template="emit('loadTemplate', $event)"
            @remove-computed-field="emit('removeComputedField', $event)"
            @remove-filter="emit('removeFilter', $event)"
            @remove-sort="emit('removeSort', $event)"
            @save-template="emit('saveTemplate', $event)"
            @update-field="handleUpdateField"
            @update-filter="handleUpdateFilter"
            @update-sort="handleUpdateSort"
          />
        </Scrollbar>
      </a-tab-pane>

      <a-tab-pane key="capability" tab="生产能力">
        <Scrollbar class="h-full min-h-0" content-class="min-h-full p-12px">
          <CapabilityPanel
            :field-count="fields.length"
            :groups="capabilityGroups"
            :row-count="rowCount"
            :schema-version="schema.version"
          />
        </Scrollbar>
      </a-tab-pane>
    </a-tabs>
  </aside>
</template>

<style scoped lang="less">
.report-right-tabs__tabs {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  overflow: hidden;
}

.report-right-tabs__tabs :deep(.ant-tabs-nav) {
  flex: none;
  padding: 0 12px;
  margin: 0;
}

.report-right-tabs__tabs :deep(.ant-tabs-content-holder),
.report-right-tabs__tabs :deep(.ant-tabs-content),
.report-right-tabs__tabs :deep(.ant-tabs-tabpane) {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.report-right-tabs__tabs :deep(.report-experience-panel),
.report-right-tabs__tabs :deep(.transform-panel) {
  min-height: 100%;
}
</style>
