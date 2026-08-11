<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'
import type {
  FieldType,
  FilterOperator,
  ReportField,
  ReportFilter,
  ReportSort,
  ReportTemplateSnapshot,
  SortDirection,
} from '../types'

const props = defineProps<{
  fields: ReportField[]
  filters: ReportFilter[]
  sorts: ReportSort[]
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
  loadTemplate: [id: string]
  removeComputedField: [key: string]
  removeFilter: [id: string]
  removeSort: [id: string]
  saveTemplate: [name: string]
  updateField: [key: string, patch: Partial<ReportField>]
  updateFilter: [id: string, patch: Partial<ReportFilter>]
  updateSort: [id: string, patch: Partial<ReportSort>]
}>()

const templateName = shallowRef('')
const selectedTemplateId = shallowRef('')
const computedDraft = reactive({
  expression: '',
  key: '',
  label: '',
  type: 'number' as FieldType,
})

const fieldOptions = computed(() => {
  return props.fields.map((field) => ({
    label: `${field.label} (${field.key})`,
    value: field.key,
  }))
})

const computedFields = computed(() => {
  return props.fields.filter((field) => field.computed)
})

const templateOptions = computed(() => {
  return props.templates.map((template) => {
    const savedAt = new Date(template.savedAt).toLocaleString('zh-CN', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
    })

    return {
      label: `${template.name} · ${savedAt}`,
      value: template.id,
    }
  })
})

const typeOptions = [
  { label: '数字', value: 'number' },
  { label: '金额', value: 'currency' },
  { label: '百分比', value: 'percent' },
]

const filterOperatorOptions = [
  { label: '包含', value: 'contains' },
  { label: '等于', value: 'equals' },
  { label: '不等于', value: 'notEquals' },
  { label: '开头是', value: 'startsWith' },
  { label: '结尾是', value: 'endsWith' },
  { label: '大于', value: 'greaterThan' },
  { label: '大于等于', value: 'greaterOrEqual' },
  { label: '小于', value: 'lessThan' },
  { label: '小于等于', value: 'lessOrEqual' },
  { label: '介于', value: 'between' },
  { label: '为空', value: 'empty' },
  { label: '非空', value: 'notEmpty' },
]

const sortDirectionOptions = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' },
]

function needsValue(operator: FilterOperator) {
  return !['empty', 'notEmpty'].includes(operator)
}

function needsSecondValue(operator: FilterOperator) {
  return operator === 'between'
}

function addComputedField() {
  emit('addComputedField', { ...computedDraft })
  computedDraft.expression = ''
  computedDraft.key = ''
  computedDraft.label = ''
  computedDraft.type = 'number'
}

function saveTemplate() {
  emit('saveTemplate', templateName.value)
  templateName.value = ''
}

function loadTemplate() {
  if (!selectedTemplateId.value) return
  emit('loadTemplate', selectedTemplateId.value)
}

function deleteTemplate() {
  if (!selectedTemplateId.value) return
  emit('deleteTemplate', selectedTemplateId.value)
  selectedTemplateId.value = ''
}
</script>

<template>
  <section class="transform-panel">
    <div class="transform-panel__head">
      <Icon name="i-lucide:workflow" :size="18" />
      <h2>数据加工</h2>
    </div>

    <div class="transform-panel__body">
      <div class="transform-group">
        <div class="transform-group__title">
          <h3>模板</h3>
          <span>{{ templates.length }} 个</span>
        </div>

        <div class="transform-row">
          <a-input
            :value="templateName"
            placeholder="模板名称"
            size="small"
            @update:value="templateName = String($event)"
          />
          <a-button size="small" type="primary" @click="saveTemplate">
            <template #icon>
              <Icon name="i-lucide:save" />
            </template>
            保存
          </a-button>
        </div>

        <div class="transform-row transform-row--actions">
          <a-select
            :options="templateOptions"
            :value="selectedTemplateId"
            allow-clear
            placeholder="选择模板"
            size="small"
            @update:value="selectedTemplateId = String($event ?? '')"
          />
          <a-button
            :disabled="!selectedTemplateId"
            size="small"
            @click="loadTemplate"
          >
            <template #icon>
              <Icon name="i-lucide:folder-open" />
            </template>
          </a-button>
          <a-button
            :disabled="!selectedTemplateId"
            danger
            size="small"
            @click="deleteTemplate"
          >
            <template #icon>
              <Icon name="i-lucide:trash-2" />
            </template>
          </a-button>
        </div>

        <p class="transform-status">{{ templateStatus }}</p>
      </div>

      <div class="transform-group">
        <div class="transform-group__title">
          <h3>计算字段</h3>
          <span>{{ computedFields.length }} 个</span>
        </div>

        <article
          v-for="field in computedFields"
          :key="field.key"
          class="computed-card"
        >
          <div class="computed-card__top">
            <strong>{{ field.label }}</strong>
            <code>{{ field.key }}</code>
            <a-button
              danger
              size="small"
              @click="emit('removeComputedField', field.key)"
            >
              <template #icon>
                <Icon name="i-lucide:x" />
              </template>
            </a-button>
          </div>

          <div class="computed-card__form">
            <label class="transform-field">
              <span>列名</span>
              <a-input
                :value="field.label"
                size="small"
                @update:value="
                  emit('updateField', field.key, { label: String($event) })
                "
              />
            </label>
            <label class="transform-field">
              <span>类型</span>
              <a-select
                :options="typeOptions"
                :value="field.type"
                size="small"
                @update:value="
                  emit('updateField', field.key, { type: $event as FieldType })
                "
              />
            </label>
            <label class="transform-field transform-field--wide">
              <span>表达式</span>
              <a-input
                :value="field.expression"
                size="small"
                @update:value="
                  emit('updateField', field.key, { expression: String($event) })
                "
              />
            </label>
          </div>
        </article>

        <div class="computed-draft">
          <div class="computed-draft__grid">
            <a-input
              :value="computedDraft.key"
              placeholder="字段编码"
              size="small"
              @update:value="computedDraft.key = String($event)"
            />
            <a-input
              :value="computedDraft.label"
              placeholder="列名"
              size="small"
              @update:value="computedDraft.label = String($event)"
            />
            <a-select
              :options="typeOptions"
              :value="computedDraft.type"
              size="small"
              @update:value="computedDraft.type = $event as FieldType"
            />
          </div>
          <div class="transform-row">
            <a-input
              :value="computedDraft.expression"
              placeholder="amount * grossMargin"
              size="small"
              @update:value="computedDraft.expression = String($event)"
            />
            <a-button size="small" @click="addComputedField">
              <template #icon>
                <Icon name="i-lucide:plus" />
              </template>
              添加
            </a-button>
          </div>
        </div>
      </div>

      <div class="transform-group">
        <div class="transform-group__title">
          <h3>过滤</h3>
          <a-button size="small" @click="emit('addFilter')">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            条件
          </a-button>
        </div>

        <article v-for="filter in filters" :key="filter.id" class="rule-card">
          <div class="rule-card__top">
            <a-switch
              :checked="filter.enabled"
              size="small"
              @change="
                emit('updateFilter', filter.id, { enabled: Boolean($event) })
              "
            />
            <a-select
              :options="fieldOptions"
              :value="filter.fieldKey"
              size="small"
              @update:value="
                emit('updateFilter', filter.id, { fieldKey: String($event) })
              "
            />
            <a-button
              danger
              size="small"
              @click="emit('removeFilter', filter.id)"
            >
              <template #icon>
                <Icon name="i-lucide:trash-2" />
              </template>
            </a-button>
          </div>
          <div class="rule-card__form">
            <a-select
              :options="filterOperatorOptions"
              :value="filter.operator"
              size="small"
              @update:value="
                emit('updateFilter', filter.id, {
                  operator: $event as FilterOperator,
                })
              "
            />
            <a-input
              v-if="needsValue(filter.operator)"
              :value="filter.value"
              placeholder="值"
              size="small"
              @update:value="
                emit('updateFilter', filter.id, { value: String($event) })
              "
            />
            <a-input
              v-if="needsSecondValue(filter.operator)"
              :value="filter.secondValue"
              placeholder="结束值"
              size="small"
              @update:value="
                emit('updateFilter', filter.id, { secondValue: String($event) })
              "
            />
          </div>
        </article>

        <p v-if="!filters.length" class="transform-empty">暂无过滤条件</p>
      </div>

      <div class="transform-group">
        <div class="transform-group__title">
          <h3>排序</h3>
          <a-button size="small" @click="emit('addSort')">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            排序
          </a-button>
        </div>

        <article v-for="sort in sorts" :key="sort.id" class="rule-card">
          <div class="rule-card__top">
            <a-switch
              :checked="sort.enabled"
              size="small"
              @change="
                emit('updateSort', sort.id, { enabled: Boolean($event) })
              "
            />
            <a-select
              :options="fieldOptions"
              :value="sort.fieldKey"
              size="small"
              @update:value="
                emit('updateSort', sort.id, { fieldKey: String($event) })
              "
            />
            <a-select
              :options="sortDirectionOptions"
              :value="sort.direction"
              size="small"
              @update:value="
                emit('updateSort', sort.id, {
                  direction: $event as SortDirection,
                })
              "
            />
            <a-button danger size="small" @click="emit('removeSort', sort.id)">
              <template #icon>
                <Icon name="i-lucide:trash-2" />
              </template>
            </a-button>
          </div>
        </article>

        <p v-if="!sorts.length" class="transform-empty">暂无排序规则</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.transform-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.transform-panel__head {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  color: #0f766e;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.transform-panel__head h2 {
  margin: 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.transform-panel__body {
  display: grid;
  gap: 12px;
  align-content: start;
  min-height: 0;
  padding: 12px;
  overflow: auto;
}

.transform-group {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.transform-group__title {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.transform-group__title h3 {
  margin: 0;
  font-size: 14px;
  color: rgb(var(--w-text-color));
}

.transform-group__title span {
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
}

.transform-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  min-width: 0;
}

.transform-row--actions {
  grid-template-columns: minmax(0, 1fr) auto auto;
}

.transform-status,
.transform-empty {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgb(var(--w-text-color-3));
}

.computed-card,
.rule-card,
.computed-draft {
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.computed-card__top,
.rule-card__top {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.computed-card__top {
  grid-template-columns: minmax(0, 1fr) auto auto;
}

.computed-card__top strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.computed-card__top code {
  max-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #0f766e;
  white-space: nowrap;
}

.computed-card__form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  gap: 8px;
  margin-top: 10px;
}

.transform-field {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.transform-field--wide {
  grid-column: 1 / -1;
}

.transform-field span {
  font-size: 12px;
  font-weight: 700;
  color: rgb(var(--w-text-color-3));
}

.computed-draft {
  display: grid;
  gap: 8px;
}

.computed-draft__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 86px;
  gap: 8px;
}

.rule-card__form {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  margin-top: 8px;
}

@media (width <= 640px) {
  .computed-draft__grid,
  .rule-card__form,
  .transform-row,
  .transform-row--actions {
    grid-template-columns: 1fr;
  }
}
</style>
