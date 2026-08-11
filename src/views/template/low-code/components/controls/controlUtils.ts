import type {
  DesignerComponentType,
  DesignerControlPropsByType,
  DesignerNode,
  DesignerNodeStyle,
  DesignerOption,
  DesignerTableColumn,
  DesignerTableRow,
} from '../../types'
import { createNodeId } from '../../utils/nodeTree.ts'

export { createNodeId }

export type ControlFieldKind =
  | 'boolean'
  | 'number'
  | 'options'
  | 'select'
  | 'text'
  | 'textarea'

export interface ControlFieldOption {
  label: string
  value: string | number | boolean
}

export interface ControlFieldDefinition {
  key: string
  label: string
  kind: ControlFieldKind
  options?: ControlFieldOption[]
}

export interface ControlDefinition<T extends DesignerComponentType> {
  type: T
  category: 'antd' | 'basic' | 'data'
  title: string
  description: string
  icon: string
  badge?: string
  acceptsChildren?: boolean
  defaultProps: DesignerControlPropsByType[T]
  defaultStyle: DesignerNodeStyle
  fields: ControlFieldDefinition[]
}

export type AnyControlDefinition = {
  [Type in DesignerComponentType]: ControlDefinition<Type>
}[DesignerComponentType]

export const optionList = (
  values: readonly (string | number | boolean)[]
): DesignerOption[] => values.map((value) => ({ label: String(value), value }))

export const tableColumns: DesignerTableColumn[] = [
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'status', title: '状态' },
  { dataIndex: 'owner', title: '负责人' },
]

export const tableRows: DesignerTableRow[] = [
  { key: 'row-1', name: '需求评审', owner: 'Alex', status: '进行中' },
  { key: 'row-2', name: '设计确认', owner: 'Ming', status: '待处理' },
  { key: 'row-3', name: '上线验收', owner: 'Nora', status: '已完成' },
]

export const textField = (
  key: string,
  label: string
): ControlFieldDefinition => ({
  key,
  kind: 'text',
  label,
})

export const textareaField = (
  key: string,
  label: string
): ControlFieldDefinition => ({
  key,
  kind: 'textarea',
  label,
})

export const numberField = (
  key: string,
  label: string
): ControlFieldDefinition => ({
  key,
  kind: 'number',
  label,
})

export const booleanField = (
  key: string,
  label: string
): ControlFieldDefinition => ({
  key,
  kind: 'boolean',
  label,
})

export const optionsField = (
  key: string,
  label: string
): ControlFieldDefinition => ({
  key,
  kind: 'options',
  label,
})

export const selectField = (
  key: string,
  label: string,
  options: readonly ControlFieldOption[]
): ControlFieldDefinition => ({
  key,
  kind: 'select',
  label,
  options: [...options],
})

export function createNode<T extends DesignerComponentType>(
  definition: ControlDefinition<T>,
  options: Partial<Omit<DesignerNode<T>, 'props' | 'style' | 'type'>> & {
    children?: DesignerNode[]
    props?: Partial<DesignerControlPropsByType[T]>
    style?: Partial<DesignerNodeStyle>
  } = {}
): DesignerNode<T> {
  return {
    description: options.description ?? definition.description,
    id: options.id ?? createNodeId(),
    props: {
      ...definition.defaultProps,
      ...options.props,
    } as DesignerControlPropsByType[T],
    style: {
      ...definition.defaultStyle,
      ...options.style,
    },
    title: options.title ?? definition.title,
    type: definition.type,
    ...(definition.acceptsChildren || options.children
      ? { children: options.children ?? [] }
      : {}),
  }
}
