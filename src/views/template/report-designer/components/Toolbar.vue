<script setup lang="ts">
import { computed } from 'vue'
import type {
  ExportFormat,
  ExportOption,
  ReportTemplateType,
  RequirementPhase,
} from '../types'

const props = defineProps<{
  exportOptions: ExportOption[]
  exportStatus: string
  phases: RequirementPhase[]
  rowCount: number
  schemaVersion: string
  templateType: ReportTemplateType
}>()

const emit = defineEmits<{
  export: [format: ExportFormat]
  openSchema: []
  openTemplateSettings: []
}>()

const exportMenuItems = computed(() => {
  return props.exportOptions.map((option) => ({
    key: option.format,
    label: option.label,
    title: option.description,
  }))
})

const templateTypeLabels: Record<ReportTemplateType, string> = {
  bi: 'BI 报表',
  delivery: '出库单',
  detail: '明细表',
  finance: '财务报表',
  group: '分组报表',
  inbound: '入库单',
  invoice: '发票',
  label: '标签打印',
  masterDetail: '主从报表',
  statement: '对账单',
  summary: '汇总表',
}

const templateTypeLabel = computed(() => templateTypeLabels[props.templateType])

function isExportFormat(value: string): value is ExportFormat {
  return props.exportOptions.some((option) => option.format === value)
}

function handleExportMenuClick(event: { key: string | number }) {
  const format = String(event.key)
  if (!isExportFormat(format)) return
  emit('export', format)
}
</script>

<template>
  <header class="report-toolbar">
    <div class="report-toolbar__title">
      <span>Template / Report Designer</span>
      <h1>报表设计器</h1>
    </div>

    <div class="report-toolbar__plan" aria-label="需求规划">
      <article v-for="phase in phases" :key="phase.phase">
        <strong>{{ phase.phase }}</strong>
        <span>{{ phase.title }}</span>
      </article>
    </div>

    <div class="report-toolbar__actions">
      <span class="report-toolbar__status">
        <Icon name="i-lucide:database" :size="15" />
        {{ rowCount.toLocaleString('zh-CN') }} 行 · {{ exportStatus }}
      </span>
      <span class="report-toolbar__status report-toolbar__status--schema">
        <Icon name="i-lucide:file-json-2" :size="15" />
        {{ templateTypeLabel }} · Schema v{{ schemaVersion }}
      </span>
      <a-button @click="emit('openTemplateSettings')">
        <template #icon>
          <Icon name="i-lucide:settings-2" />
        </template>
        模板设置
      </a-button>
      <a-button @click="emit('openSchema')">
        <template #icon>
          <Icon name="i-lucide:file-code-2" />
        </template>
        Schema
      </a-button>
      <a-dropdown
        :menu="{ items: exportMenuItems, onClick: handleExportMenuClick }"
        :trigger="['click']"
      >
        <a-button type="primary">
          <template #icon>
            <Icon name="i-lucide:download" />
          </template>
          导出
          <Icon name="i-lucide:chevron-down" class="ml-4px" />
        </a-button>
      </a-dropdown>
    </div>
  </header>
</template>

<style scoped lang="less">
.report-toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) minmax(280px, 1fr) minmax(
      420px,
      1.3fr
    );
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
  box-shadow: var(--w-shadow-card);
}

.report-toolbar__title {
  min-width: 0;
}

.report-toolbar__title span {
  display: block;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.4;
  color: #0f766e;
}

.report-toolbar__title h1 {
  margin: 3px 0 0;
  font-size: 20px;
  line-height: 1.25;
  color: rgb(var(--w-text-color));
}

.report-toolbar__plan {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.report-toolbar__plan article {
  min-width: 0;
  min-height: 44px;
  padding: 8px 10px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.report-toolbar__plan strong {
  display: block;
  font-size: 12px;
  line-height: 1.2;
  color: #0f766e;
}

.report-toolbar__plan span {
  display: block;
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  line-height: 1.3;
  color: rgb(var(--w-text-color-2));
  white-space: nowrap;
}

.report-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.report-toolbar__status {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  max-width: 100%;
  min-height: 28px;
  padding: 0 9px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: rgb(var(--w-text-color-2));
  white-space: nowrap;
  background: rgb(20 184 166 / 10%);
  border: 1px solid rgb(20 184 166 / 18%);
  border-radius: 999px;
}

.report-toolbar__status--schema {
  background: rgb(var(--w-bg-page));
  border-color: rgb(var(--w-border-color-1));
}

@media (width <= 1280px) {
  .report-toolbar {
    grid-template-columns: 1fr;
  }

  .report-toolbar__actions {
    justify-content: flex-start;
  }
}

@media (width <= 640px) {
  .report-toolbar__plan {
    grid-template-columns: 1fr;
  }
}
</style>
