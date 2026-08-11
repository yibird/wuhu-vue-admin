<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import {
  getDefaultCustomFormatterCode,
  getFieldFormatPresetOptions,
  isFieldFormatPreset,
  parseFormatterTestValue,
  stringifyFormatterTestValue,
} from '../formatters'
import type {
  FieldFormatterTestResult,
  ReportField,
  ReportFieldFormatConfig,
  ReportRow,
} from '../types'

const props = defineProps<{
  field: ReportField
  formatCell: (value: unknown, field: ReportField, row?: ReportRow) => string
  sampleRow?: ReportRow
  testFormatCell: (
    value: unknown,
    field: ReportField,
    row?: ReportRow
  ) => FieldFormatterTestResult
}>()

const emit = defineEmits<{
  updateField: [patch: Partial<ReportField>]
}>()

const customEditorOpen = shallowRef(false)
const draftCode = shallowRef('')
const draftTestValue = shallowRef('')
const testOutput = shallowRef('')
const testError = shallowRef('')

const presetOptions = computed(() =>
  getFieldFormatPresetOptions(props.field.type)
)

const formatOptions = computed(() => [
  { label: '自动格式', value: 'auto' },
  ...presetOptions.value,
  { label: '自定义函数', value: 'custom' },
])

const selectedFormat = computed(() => {
  const format = props.field.format
  if (format?.mode === 'custom') return 'custom'
  if (format?.mode === 'preset' && format.preset) {
    return presetOptions.value.some((option) => option.value === format.preset)
      ? format.preset
      : 'auto'
  }
  return 'auto'
})

const sampleValue = computed(() => {
  return props.sampleRow?.[props.field.key] ?? ''
})

const samplePreview = computed(() => {
  return props.formatCell(sampleValue.value, props.field, props.sampleRow)
})

const sampleError = computed(() => {
  return props.testFormatCell(sampleValue.value, props.field, props.sampleRow)
    .error
})

const isCustomFormat = computed(() => props.field.format?.mode === 'custom')

function updateFormat(format: ReportFieldFormatConfig) {
  emit('updateField', {
    format: {
      ...props.field.format,
      ...format,
    },
  })
}

function updateFormatSelection(value: string) {
  if (value === 'custom') {
    openCustomEditor()
    return
  }

  if (value === 'auto') {
    updateFormat({
      mode: 'auto',
    })
    return
  }

  if (isFieldFormatPreset(value)) {
    updateFormat({
      mode: 'preset',
      preset: value,
    })
  }
}

function openCustomEditor() {
  draftCode.value =
    props.field.format?.customCode ||
    getDefaultCustomFormatterCode(props.field.type)
  draftTestValue.value =
    props.field.format?.testValue ||
    stringifyFormatterTestValue(sampleValue.value)
  testOutput.value = ''
  testError.value = ''
  customEditorOpen.value = true
  runDraftTest()
}

function createDraftRow(value: unknown) {
  const row: ReportRow = props.sampleRow ? { ...props.sampleRow } : {}
  row[props.field.key] = value as ReportRow[string]
  return row
}

function runDraftTest() {
  const value = parseFormatterTestValue(draftTestValue.value)
  const row = createDraftRow(value)
  const draftField: ReportField = {
    ...props.field,
    format: {
      ...props.field.format,
      customCode: draftCode.value,
      mode: 'custom',
      testValue: draftTestValue.value,
    },
  }
  const result = props.testFormatCell(value, draftField, row)

  testOutput.value = result.value
  testError.value = result.error
}

function applyCustomFormatter() {
  updateFormat({
    customCode:
      draftCode.value.trim() || getDefaultCustomFormatterCode(props.field.type),
    mode: 'custom',
    testValue: draftTestValue.value,
  })
  customEditorOpen.value = false
}
</script>

<template>
  <div class="format-editor">
    <div class="format-editor__head">
      <span>
        <Icon name="i-lucide:wand-sparkles" :size="14" />
        格式化
      </span>
      <div class="format-editor__controls">
        <a-select
          :options="formatOptions"
          :value="selectedFormat"
          @update:value="updateFormatSelection(String($event))"
        />
        <a-tooltip title="编辑自定义函数">
          <a-button
            :type="isCustomFormat ? 'primary' : 'default'"
            size="small"
            @click="openCustomEditor"
          >
            <template #icon>
              <Icon name="i-lucide:code-2" />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <div
      class="format-editor__preview"
      :class="{ 'format-editor__preview--error': !!sampleError }"
    >
      <span>示例</span>
      <strong>{{ sampleError ? '#FORMAT!' : samplePreview }}</strong>
    </div>

    <a-modal
      v-model:open="customEditorOpen"
      cancel-text="取消"
      ok-text="应用"
      title="自定义格式化"
      :width="760"
      @ok="applyCustomFormatter"
    >
      <div class="format-modal">
        <div class="format-modal__signature">
          <code>value</code>
          <code>mappedValue</code>
          <code>row</code>
          <code>field</code>
          <code>helpers</code>
        </div>

        <label class="format-modal__code">
          <span>函数体</span>
          <a-textarea
            :auto-size="{ minRows: 8, maxRows: 14 }"
            :value="draftCode"
            spellcheck="false"
            @update:value="draftCode = String($event)"
          />
        </label>

        <div class="format-modal__test">
          <label>
            <span>测试值</span>
            <a-input
              :value="draftTestValue"
              @update:value="draftTestValue = String($event)"
            />
          </label>
          <a-button type="primary" @click="runDraftTest">
            <template #icon>
              <Icon name="i-lucide:play" />
            </template>
            测试
          </a-button>
        </div>

        <div
          class="format-modal__result"
          :class="{ 'format-modal__result--error': !!testError }"
        >
          <span>{{ testError ? '错误' : '结果' }}</span>
          <strong>{{ testError || testOutput || '-' }}</strong>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.format-editor {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px dashed rgb(var(--w-border-color-2));
}

.format-editor__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
}

.format-editor__head > span {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color-2));
}

.format-editor__controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px;
  min-width: 0;
}

.format-editor__preview {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
  padding: 7px 9px;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 6px;
}

.format-editor__preview span {
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
}

.format-editor__preview strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.format-editor__preview--error strong {
  color: #dc2626;
}

.format-modal {
  display: grid;
  gap: 12px;
}

.format-modal__signature {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.format-modal__signature code {
  padding: 3px 7px;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 12px;
  color: #0f766e;
  background: rgb(20 184 166 / 10%);
  border: 1px solid rgb(20 184 166 / 18%);
  border-radius: 6px;
}

.format-modal__code,
.format-modal__test label {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.format-modal__code span,
.format-modal__test span {
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color-2));
}

.format-modal__code :deep(textarea) {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.format-modal__test {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: end;
}

.format-modal__result {
  display: grid;
  gap: 5px;
  padding: 10px 12px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.format-modal__result span {
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color-3));
}

.format-modal__result strong {
  min-width: 0;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  color: rgb(var(--w-text-color));
  overflow-wrap: anywhere;
}

.format-modal__result--error {
  background: rgb(239 68 68 / 8%);
  border-color: rgb(239 68 68 / 28%);
}

.format-modal__result--error strong {
  color: #dc2626;
}

@media (width <= 640px) {
  .format-editor__head,
  .format-modal__test {
    grid-template-columns: 1fr;
  }
}
</style>
