import type { PropField, StyleSchema } from '../schema/types'

type FieldExtras = Partial<Omit<PropField, 'key' | 'label' | 'type'>>

export const textField = (
  key: string,
  label: string,
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'text', ...extras })

export const textareaField = (
  key: string,
  label: string,
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'textarea', ...extras })

export const numberField = (
  key: string,
  label: string,
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'number', ...extras })

export const switchField = (
  key: string,
  label: string,
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'switch', ...extras })

export const selectField = (
  key: string,
  label: string,
  options: PropField['options'],
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'select', options, ...extras })

export const colorField = (
  key: string,
  label: string,
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'color', ...extras })

export const optionsField = (
  key = 'options',
  label = '选项',
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'options', group: '数据', ...extras })

export const columnsField = (
  key = 'columns',
  label = '列配置',
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'columns', group: '数据', ...extras })

export const rulesField = (
  key = 'rules',
  label = '校验规则',
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'rules', group: '校验', ...extras })

export const jsonField = (
  key: string,
  label: string,
  extras: FieldExtras = {}
): PropField => ({ key, label, type: 'json', group: '数据', ...extras })

/** 表单字段名（配合 Form 自动双向绑定） */
export const nameField = (): PropField => ({
  key: 'name',
  label: '字段名',
  type: 'text',
  group: '数据',
  description: '在 Form 内作为表单字段标识，自动双向绑定 Form 的 model',
})

export const layoutStyle: StyleSchema = {
  layout: 'block',
  padding: '12px',
  gap: 12,
}

export const flexStyle: StyleSchema = {
  layout: 'flex',
  direction: 'column',
  align: 'stretch',
  justify: 'start',
  gap: 12,
  padding: '12px',
}

export const gridStyle: StyleSchema = {
  layout: 'grid',
  columns: 2,
  gap: 12,
  padding: '12px',
}

export const controlStyle: StyleSchema = {
  width: '100%',
}

/** 生成静态选项 */
export function staticOptions(labels: string[]) {
  return labels.map((label) => ({
    label,
    value: label,
  }))
}
