<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import type {
  ExportFormat,
  ReportField,
  ReportSettings,
  ReportSummary,
  ReportTemplateSnapshot,
} from '../types'

interface ReportVersionItem {
  id: string
  name: string
  savedAt: string
  detail: string
}

const props = defineProps<{
  fields: ReportField[]
  rowCount: number
  settings: ReportSettings
  summaries: ReportSummary[]
  templates: ReportTemplateSnapshot[]
}>()

const emit = defineEmits<{
  deleteTemplate: [id: string]
  export: [format: ExportFormat]
  loadTemplate: [id: string]
  saveTemplate: [name: string]
  updateSettings: [patch: Partial<ReportSettings>]
}>()

const viewMode = defineModel<'table' | 'chart'>('viewMode', {
  default: 'table',
})

const templateName = shallowRef('')
const activeTab = shallowRef('templates')
const versions = shallowRef<ReportVersionItem[]>([])

const enabledFields = computed(() => {
  return props.fields.filter((field) => field.enabled)
})

const fieldGroups = computed(() => {
  const groups = new Map<
    ReportField['type'] | 'computed',
    { label: string; total: number; enabled: number }
  >([
    ['string', { label: '文本字段', total: 0, enabled: 0 }],
    ['number', { label: '数字字段', total: 0, enabled: 0 }],
    ['currency', { label: '金额字段', total: 0, enabled: 0 }],
    ['percent', { label: '百分比字段', total: 0, enabled: 0 }],
    ['date', { label: '日期字段', total: 0, enabled: 0 }],
    ['computed', { label: '计算字段', total: 0, enabled: 0 }],
  ])

  for (const field of props.fields) {
    const key = field.computed ? 'computed' : field.type
    const group = groups.get(key)
    if (!group) continue
    group.total += 1
    if (field.enabled) group.enabled += 1
  }

  return Array.from(groups.values()).filter((group) => group.total > 0)
})

const exportCards = [
  {
    format: 'csv',
    icon: 'i-lucide:file-spreadsheet',
    title: 'CSV',
    desc: '适合批量数据和下游处理',
  },
  {
    format: 'xls',
    icon: 'i-lucide:file-spreadsheet',
    title: 'Excel',
    desc: '保留表头、边框和基础样式',
  },
  {
    format: 'pdf',
    icon: 'i-lucide:file-type-2',
    title: 'PDF',
    desc: '按纸张设置打开分页打印预览',
  },
  {
    format: 'json',
    icon: 'i-lucide:braces',
    title: 'JSON',
    desc: '导出模板配置和格式化结果',
  },
  {
    format: 'print',
    icon: 'i-lucide:printer',
    title: '打印',
    desc: '快速生成浏览器打印预览',
  },
] satisfies Array<{
  desc: string
  format: ExportFormat
  icon: string
  title: string
}>

const visibleSummary = computed(() => props.summaries.slice(0, 3))

function formatTime(value: string) {
  if (!value) return '未保存'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function saveTemplate() {
  const name =
    templateName.value.trim() ||
    `${props.settings.title || '报表模板'} ${versions.value.length + 1}`
  emit('saveTemplate', name)
  versions.value = [
    {
      id: `version-${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      detail: `${enabledFields.value.length} 列 / ${props.rowCount} 行`,
    },
    ...versions.value,
  ].slice(0, 8)
  templateName.value = ''
}

function applyDensity(density: ReportSettings['density']) {
  emit('updateSettings', { density })
}

watch(
  () => props.settings.title,
  (title) => {
    if (!templateName.value.trim()) {
      templateName.value = title
    }
  },
  { immediate: true }
)
</script>

<template>
  <section class="report-experience-panel">
    <header class="report-experience-panel__header">
      <div>
        <span>Experience</span>
        <h3>模板与视图</h3>
      </div>
      <a-segmented
        v-model:value="viewMode"
        :options="[
          { label: '表格', value: 'table' },
          { label: '图表', value: 'chart' },
        ]"
      />
    </header>

    <a-tabs v-model:active-key="activeTab" size="small">
      <a-tab-pane key="templates" tab="模板库">
        <div class="report-experience-panel__stack">
          <div class="report-experience-panel__save">
            <a-input
              v-model:value="templateName"
              placeholder="模板名称"
              @press-enter="saveTemplate"
            />
            <a-button type="primary" @click="saveTemplate">
              <template #icon>
                <Icon name="i-lucide:save" />
              </template>
              保存
            </a-button>
          </div>

          <div v-if="templates.length" class="report-experience-panel__list">
            <article v-for="template in templates" :key="template.id">
              <div>
                <strong>{{ template.name }}</strong>
                <span>{{ formatTime(template.savedAt) }}</span>
              </div>
              <div class="report-experience-panel__actions">
                <a-button
                  size="small"
                  type="link"
                  @click="emit('loadTemplate', template.id)"
                >
                  应用
                </a-button>
                <a-button
                  size="small"
                  type="link"
                  danger
                  @click="emit('deleteTemplate', template.id)"
                >
                  删除
                </a-button>
              </div>
            </article>
          </div>

          <a-empty v-else description="暂无模板" />
        </div>
      </a-tab-pane>

      <a-tab-pane key="versions" tab="版本历史">
        <div class="report-experience-panel__stack">
          <a-alert
            show-icon
            type="info"
            message="版本快照会同步保存为模板，方便随时回滚。"
          />
          <button
            v-for="version in versions"
            :key="version.id"
            type="button"
            class="report-experience-panel__version"
          >
            <Icon name="i-lucide:history" :size="16" />
            <span>
              <strong>{{ version.name }}</strong>
              <small
                >{{ formatTime(version.savedAt) }} · {{ version.detail }}</small
              >
            </span>
          </button>
          <a-empty
            v-if="!versions.length"
            description="保存模板后生成版本记录"
          />
        </div>
      </a-tab-pane>

      <a-tab-pane key="fields" tab="字段分组">
        <div class="report-experience-panel__groups">
          <article v-for="group in fieldGroups" :key="group.label">
            <span>{{ group.label }}</span>
            <strong>{{ group.enabled }} / {{ group.total }}</strong>
            <a-progress
              :percent="Math.round((group.enabled / group.total) * 100)"
              :show-info="false"
              :size="5"
            />
          </article>
        </div>
      </a-tab-pane>

      <a-tab-pane key="export" tab="导出配置">
        <div class="report-experience-panel__stack">
          <div class="report-experience-panel__density">
            <span>密度</span>
            <a-segmented
              :value="settings.density"
              :options="[
                { label: '紧凑', value: 'compact' },
                { label: '标准', value: 'standard' },
                { label: '舒展', value: 'comfortable' },
              ]"
              @change="
                (value: unknown) =>
                  applyDensity(value as ReportSettings['density'])
              "
            />
          </div>

          <div class="report-experience-panel__exports">
            <button
              v-for="item in exportCards"
              :key="item.format"
              type="button"
              @click="emit('export', item.format)"
            >
              <Icon :name="item.icon" :size="18" />
              <span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.desc }}</small>
              </span>
            </button>
          </div>

          <div
            v-if="visibleSummary.length"
            class="report-experience-panel__summary"
          >
            <article v-for="summary in visibleSummary" :key="summary.key">
              <span>{{ summary.label }}</span>
              <strong>{{ summary.value }}</strong>
            </article>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<style scoped lang="less">
.report-experience-panel {
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.report-experience-panel__header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.report-experience-panel__header span {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: rgb(var(--w-text-color-3));
  text-transform: uppercase;
}

.report-experience-panel__header h3 {
  margin: 2px 0 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.report-experience-panel :deep(.ant-tabs-nav) {
  padding: 0 12px;
  margin: 0;
}

.report-experience-panel :deep(.ant-tabs-content-holder) {
  min-height: 0;
}

.report-experience-panel__stack {
  display: grid;
  gap: 10px;
  padding: 12px;
}

.report-experience-panel__save {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.report-experience-panel__list,
.report-experience-panel__groups,
.report-experience-panel__exports,
.report-experience-panel__summary {
  display: grid;
  gap: 8px;
}

.report-experience-panel__list article,
.report-experience-panel__groups article,
.report-experience-panel__summary article {
  display: grid;
  gap: 5px;
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.report-experience-panel__list article {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.report-experience-panel__list strong,
.report-experience-panel__groups strong,
.report-experience-panel__summary strong,
.report-experience-panel__version strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.report-experience-panel__list span,
.report-experience-panel__groups span,
.report-experience-panel__summary span,
.report-experience-panel__version small,
.report-experience-panel__density span {
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
}

.report-experience-panel__actions {
  display: flex;
  gap: 2px;
}

.report-experience-panel__version,
.report-experience-panel__exports button {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.report-experience-panel__version:hover,
.report-experience-panel__exports button:hover {
  background: rgb(var(--w-color-primary) / 8%);
  border-color: rgb(var(--w-color-primary) / 35%);
}

.report-experience-panel__version span,
.report-experience-panel__exports span {
  min-width: 0;
}

.report-experience-panel__density {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.report-experience-panel__exports small {
  display: block;
  margin-top: 2px;
  color: rgb(var(--w-text-color-3));
}
</style>
