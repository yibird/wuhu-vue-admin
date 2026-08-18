<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { DragDropProvider } from '@dnd-kit/vue'
import { move } from '@dnd-kit/helpers'
import { DraggableItem } from '@/components/draggable'
import FieldFormatEditor from './FieldFormatEditor.vue'
import FieldMappingEditor from './FieldMappingEditor.vue'
import type { DragEndEvent } from '@dnd-kit/vue'
import type {
  FieldAlign,
  FieldFormatterTestResult,
  FieldSummary,
  FieldType,
  ReportField,
  ReportRow,
} from '../types'

const props = defineProps<{
  fields: ReportField[]
  formatCell: (value: unknown, field: ReportField, row?: ReportRow) => string
  sampleRows: ReportRow[]
  testFormatCell: (
    value: unknown,
    field: ReportField,
    row?: ReportRow
  ) => FieldFormatterTestResult
}>()

const emit = defineEmits<{
  addField: []
  moveField: [key: string, direction: 'up' | 'down']
  removeField: [key: string]
  renameFieldKey: [key: string, nextKey: string]
  reorderFields: [fieldKeys: string[]]
  toggleField: [key: string]
  updateField: [key: string, patch: Partial<ReportField>]
}>()

const fieldKeys = ref<string[]>([])
const fieldKeyDrafts = ref<Record<string, string>>({})
const fieldScrollRef = ref<{
  scrollTo: (options: ScrollToOptions) => void
} | null>(null)
const shouldScrollToAddedField = shallowRef(false)
const sampleRow = computed(() => props.sampleRows[0])

const typeOptions = [
  { label: '文本', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '金额', value: 'currency' },
  { label: '百分比', value: 'percent' },
  { label: '日期', value: 'date' },
]

const alignOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' },
]

const summaryOptions = [
  { label: '无', value: 'none' },
  { label: '求和', value: 'sum' },
  { label: '平均', value: 'avg' },
  { label: '计数', value: 'count' },
]

watch(
  () => props.fields.map((field) => field.key),
  (value) => {
    fieldKeys.value = [...value]
    fieldKeyDrafts.value = Object.fromEntries(
      value.map((key) => [key, fieldKeyDrafts.value[key] ?? key])
    )
  },
  { immediate: true }
)

watch(
  () => props.fields.length,
  async (nextLength, previousLength) => {
    if (!shouldScrollToAddedField.value) return

    shouldScrollToAddedField.value = false
    if (nextLength <= previousLength) return

    await nextTick()
    fieldScrollRef.value?.scrollTo({
      behavior: 'smooth',
      top: Number.MAX_SAFE_INTEGER,
    })
  }
)

function handleAddField() {
  shouldScrollToAddedField.value = true
  emit('addField')
}

function updateType(key: string, value: string) {
  emit('updateField', key, { type: value as FieldType })
}

function updateAlign(key: string, value: string) {
  emit('updateField', key, { align: value as FieldAlign })
}

function updateSummary(key: string, value: string) {
  emit('updateField', key, { summary: value as FieldSummary })
}

function getFieldKeyDraft(field: ReportField) {
  return fieldKeyDrafts.value[field.key] ?? field.key
}

function updateFieldKeyDraft(field: ReportField, value: string) {
  fieldKeyDrafts.value = {
    ...fieldKeyDrafts.value,
    [field.key]: value,
  }
}

function getFieldKeyIssue(field: ReportField) {
  const nextKey = getFieldKeyDraft(field).trim()
  if (!nextKey) return '字段名不能为空'

  return props.fields.some(
    (item) => item.key !== field.key && item.key === nextKey
  )
    ? '字段名已存在'
    : ''
}

function getFieldKeyStatus(field: ReportField) {
  return getFieldKeyIssue(field) ? 'error' : undefined
}

function commitFieldKey(field: ReportField) {
  const nextKey = getFieldKeyDraft(field).trim()
  const issue = getFieldKeyIssue(field)

  if (issue) return
  if (nextKey === field.key) {
    updateFieldKeyDraft(field, field.key)
    return
  }

  emit('renameFieldKey', field.key, nextKey)
}

function handleDragEnd(event: DragEndEvent) {
  const nextKeys = move(fieldKeys.value, event)
  if (nextKeys === fieldKeys.value) return

  fieldKeys.value = nextKeys
  emit('reorderFields', nextKeys)
}
</script>

<template>
  <section class="field-panel">
    <div class="field-panel__head">
      <Icon name="i-lucide:columns-3" :size="18" />
      <h2>字段设计</h2>
      <span>{{ fields.length }} 个字段</span>
      <a-button
        class="field-panel__add"
        size="small"
        type="primary"
        @click="handleAddField"
      >
        <template #icon>
          <Icon name="i-lucide:plus" />
        </template>
        添加字段
      </a-button>
    </div>

    <Scrollbar ref="fieldScrollRef" class="field-panel__scroll">
      <DragDropProvider @drag-end="handleDragEnd">
        <div class="field-panel__list">
          <DraggableItem
            v-for="(field, index) in fields"
            :key="field.key"
            :id="field.key"
            :index="index"
            class="field-card"
            :class="{ 'field-card--disabled': !field.enabled }"
            :data-field-key="field.key"
            accept="report-field"
            handle-selector=".field-card__drag"
            tag="article"
            type="report-field"
          >
            <div class="field-card__top">
              <button class="field-card__drag" title="拖拽排序" type="button">
                <Icon name="i-lucide:grip-vertical" :size="15" />
              </button>
              <a-checkbox
                :checked="field.enabled"
                @change="emit('toggleField', field.key)"
              />
              <strong>{{ field.label || field.key }}</strong>
              <div class="field-card__sort">
                <a-button
                  :disabled="index === 0"
                  size="small"
                  @click="emit('moveField', field.key, 'up')"
                >
                  <template #icon>
                    <Icon name="i-lucide:chevron-up" />
                  </template>
                </a-button>
                <a-button
                  :disabled="index === fields.length - 1"
                  size="small"
                  @click="emit('moveField', field.key, 'down')"
                >
                  <template #icon>
                    <Icon name="i-lucide:chevron-down" />
                  </template>
                </a-button>
                <a-popconfirm
                  cancel-text="取消"
                  ok-text="删除"
                  title="确认删除该字段？"
                  @confirm="emit('removeField', field.key)"
                >
                  <a-button :disabled="fields.length <= 1" danger size="small">
                    <template #icon>
                      <Icon name="i-lucide:trash-2" />
                    </template>
                  </a-button>
                </a-popconfirm>
              </div>
            </div>

            <div class="field-card__form">
              <label class="field-card__label field-card__label--wide">
                <span>字段名</span>
                <a-input
                  :status="getFieldKeyStatus(field)"
                  :value="getFieldKeyDraft(field)"
                  allow-clear
                  @blur="commitFieldKey(field)"
                  @press-enter="commitFieldKey(field)"
                  @update:value="updateFieldKeyDraft(field, String($event))"
                />
                <small v-if="getFieldKeyIssue(field)" class="field-card__hint">
                  {{ getFieldKeyIssue(field) }}
                </small>
              </label>
              <label class="field-card__label field-card__label--wide">
                <span>列名</span>
                <a-input
                  :value="field.label"
                  allow-clear
                  @update:value="
                    emit('updateField', field.key, { label: String($event) })
                  "
                />
              </label>
              <label class="field-card__label">
                <span>宽度</span>
                <a-input-number
                  :max="360"
                  :min="60"
                  :value="field.width"
                  @update:value="
                    emit('updateField', field.key, {
                      width: Number($event) || 100,
                    })
                  "
                />
              </label>
              <label class="field-card__label">
                <span>类型</span>
                <a-select
                  :options="typeOptions"
                  :value="field.type"
                  @update:value="updateType(field.key, String($event))"
                />
              </label>
              <label class="field-card__label">
                <span>对齐</span>
                <a-select
                  :options="alignOptions"
                  :value="field.align"
                  @update:value="updateAlign(field.key, String($event))"
                />
              </label>
              <label class="field-card__label field-card__label--wide">
                <span>汇总</span>
                <a-select
                  :options="summaryOptions"
                  :value="field.summary"
                  @update:value="updateSummary(field.key, String($event))"
                />
              </label>
            </div>

            <FieldFormatEditor
              :field="field"
              :format-cell="formatCell"
              :sample-row="sampleRow"
              :test-format-cell="testFormatCell"
              @update-field="emit('updateField', field.key, $event)"
            />

            <FieldMappingEditor
              :field="field"
              @update-field="emit('updateField', field.key, $event)"
            />
          </DraggableItem>
        </div>
      </DragDropProvider>
    </Scrollbar>
  </section>
</template>

<style scoped lang="less">
.field-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.field-panel__head {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  color: #0f766e;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.field-panel__head h2 {
  flex: 1;
  margin: 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.field-panel__head span {
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
}

.field-panel__add {
  flex: none;
}

.field-panel__scroll {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.field-panel__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
  padding: 12px;
}

.field-card {
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.field-card--disabled {
  opacity: 0.58;
}

.field-card__drag {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  color: rgb(var(--w-text-color-3));
  cursor: grab;
  background: transparent;
  border: 0;
  border-radius: 6px;
  transition:
    color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.field-card__drag:hover,
.field-card__drag:focus-visible {
  color: #0f766e;
  outline: none;
  background: rgb(20 184 166 / 12%);
  box-shadow: inset 0 0 0 1px rgb(20 184 166 / 20%);
}

.field-card__drag:active {
  cursor: grabbing;
}

.field-card__top {
  display: flex;
  gap: 8px;
  align-items: center;
}

.field-card__top strong {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.field-card__sort {
  display: inline-flex;
  gap: 4px;
}

.field-card__form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 8px;
  margin-top: 10px;
}

.field-card__label {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.field-card__label--wide {
  grid-column: 1 / -1;
}

.field-card__label span {
  font-size: 12px;
  font-weight: 700;
  color: rgb(var(--w-text-color-3));
}

.field-card__hint {
  min-height: 16px;
  font-size: 12px;
  line-height: 16px;
  color: #dc2626;
}

.field-card[data-w-draggable-drag-source='true'] {
  user-select: none;
}

.field-card[data-w-draggable-dragging='true'] {
  z-index: 20;
  box-shadow: var(--w-shadow-card);
  opacity: 0.45;
}
</style>
