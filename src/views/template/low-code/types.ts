export type DesignerPlatform = 'pc' | 'tablet' | 'mobile'

export type DesignerPreviewMode = DesignerPlatform | 'custom'

export interface DesignerPreviewSize {
  width: number
  height: number
}

export type DesignerComponentType =
  | 'flex'
  | 'hero'
  | 'stats'
  | 'form'
  | 'table'
  | 'chart'
  | 'notice'
  | 'button'
  | 'card'
  | 'datePicker'
  | 'input'
  | 'textarea'
  | 'inputNumber'
  | 'select'
  | 'radioGroup'
  | 'checkbox'
  | 'switch'
  | 'slider'
  | 'rate'
  | 'image'
  | 'alert'
  | 'progress'
  | 'tag'
  | 'dataTable'

export type DesignerPaletteCategory = 'antd' | 'basic' | 'data'

export interface DesignerPaletteTab {
  key: DesignerPaletteCategory
  label: string
  icon: string
}

export interface DesignerPaletteItem {
  type: DesignerComponentType
  category: DesignerPaletteCategory
  title: string
  description: string
  icon: string
  badge?: string
}

export interface DesignerPlatformOption {
  value: DesignerPlatform
  label: string
  icon: string
  width: number
}

export type DesignerNodeDensity = 'compact' | 'comfortable' | 'spacious'

export type DesignerNodeTone = 'neutral' | 'primary' | 'success' | 'warning'

export interface DesignerNodeStyle {
  columns?: number
  density?: DesignerNodeDensity
  gridColumn?: number
  tone?: DesignerNodeTone
}

export interface DesignerOption {
  label: string
  value: string | number | boolean
}

export interface DesignerTableColumn {
  dataIndex: string
  title: string
}

export interface DesignerTableRow {
  key: string
  name: string
  status: string
  owner: string
}

export interface DesignerControlPropsByType {
  flex: {
    align: 'start' | 'center' | 'end' | 'stretch'
    direction: 'row' | 'column'
    gap: number
    justify: 'start' | 'center' | 'end' | 'between'
  }
  hero: { badge: string; buttonText: string }
  stats: { items: string[] }
  form: { fields: string[] }
  table: { rows: string[] }
  chart: { bars: number[] }
  notice: { icon: string }
  button: {
    block: boolean
    danger: boolean
    label: string
    type: 'default' | 'primary' | 'dashed'
  }
  input: {
    allowClear: boolean
    placeholder: string
    prefixIcon: string
    value: string
  }
  textarea: { placeholder: string; rows: number; value: string }
  inputNumber: {
    max: number
    min: number
    prefix: string
    step: number
    value: number
  }
  select: {
    mode: 'default' | 'multiple' | 'tags'
    options: DesignerOption[]
    placeholder: string
    value: string | string[]
  }
  radioGroup: {
    buttonStyle: 'outline' | 'solid'
    optionType: 'default' | 'button'
    options: DesignerOption[]
    value: string | number | boolean
  }
  checkbox: { checked: boolean; label: string }
  switch: { checked: boolean; checkedText: string; uncheckedText: string }
  slider: { max: number; min: number; step: number; value: number }
  rate: { allowHalf: boolean; count: number; value: number }
  datePicker: {
    placeholder: string
    picker: 'date' | 'month' | 'week' | 'year'
  }
  image: {
    alt: string
    height: number
    preview: boolean
    src: string
    width: number
  }
  card: { extra: string; content: string }
  alert: {
    message: string
    showIcon: boolean
    type: 'success' | 'info' | 'warning' | 'error'
  }
  progress: {
    percent: number
    status: 'normal' | 'active' | 'exception' | 'success'
  }
  tag: { color: string; label: string }
  dataTable: { columns: DesignerTableColumn[]; rows: DesignerTableRow[] }
}

export type DesignerControlProps =
  DesignerControlPropsByType[DesignerComponentType]

export interface DesignerNode<
  T extends DesignerComponentType = DesignerComponentType,
> {
  id: string
  type: T
  title: string
  description: string
  props: DesignerControlPropsByType[T]
  style: DesignerNodeStyle
  children?: DesignerNode[]
}

export interface DesignerDropTarget {
  parentId?: string
  index: number
}

export interface DesignerNodeUpdate {
  description?: string
  props?: Record<string, unknown>
  style?: Partial<DesignerNodeStyle>
  title?: string
}

export interface DesignerVersion {
  id: string
  name: string
  time: string
  nodes: DesignerNode[]
  schema: DesignerJsonSchema
}

export interface DesignerJsonSchema {
  $schema: string
  version: string
  title: string
  layout: {
    type: 'grid'
    columns: number
    gap: number
  }
  components: DesignerNode[]
}

export type DesignerAiMessageRole = 'assistant' | 'user'

export interface DesignerAiMessage {
  id: string
  role: DesignerAiMessageRole
  content: string
  createdAt: string
}

export interface DesignerAiSuggestion {
  id: string
  title: string
  prompt: string
  icon: string
}

export type DesignerNodeActionKey =
  | 'copy'
  | 'delete'
  | 'down'
  | 'move-down'
  | 'move-up'
  | 'up'

export interface DesignerNodeAction {
  key: DesignerNodeActionKey
  label: string
  icon: string
  danger?: boolean
  disabled?: boolean
}
