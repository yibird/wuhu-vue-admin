import type {
  DesignerComponentType,
  DesignerNode,
  DesignerPaletteItem,
  DesignerPaletteTab,
} from '../../types'
import { antdControlDefinitions } from './antdDefinitions.ts'
import { antdDisplayDefinitions } from './antdDisplayDefinitions.ts'
import {
  basicControlDefinitions,
  dataControlDefinitions,
} from './basicDefinitions.ts'
import {
  createNode,
  type AnyControlDefinition,
  type ControlDefinition,
} from './controlUtils.ts'

export const controlDefinitions: readonly AnyControlDefinition[] = [
  ...basicControlDefinitions,
  ...dataControlDefinitions,
  ...antdControlDefinitions,
  ...antdDisplayDefinitions,
]

export const paletteTabs: DesignerPaletteTab[] = [
  { key: 'basic', label: '基础', icon: 'i-lucide:layout-template' },
  { key: 'data', label: '数据', icon: 'i-lucide:chart-no-axes-combined' },
  { key: 'antd', label: 'Antdv', icon: 'i-lucide:box' },
]

export const paletteItems: DesignerPaletteItem[] = controlDefinitions.map(
  ({ badge, category, description, icon, title, type }) => ({
    badge,
    category,
    description,
    icon,
    title,
    type,
  })
)

export function isDesignerComponentType(
  value: string
): value is DesignerComponentType {
  return controlDefinitions.some((definition) => definition.type === value)
}

export function getControlDefinition<T extends DesignerComponentType>(type: T) {
  return controlDefinitions.find(
    (definition): definition is Extract<AnyControlDefinition, { type: T }> =>
      definition.type === type
  )
}

export function createDesignerNode<T extends DesignerComponentType>(
  type: T,
  options: Parameters<typeof createNode<T>>[1] = {}
): DesignerNode<T> {
  const definition = getControlDefinition(type) as
    | ControlDefinition<T>
    | undefined
  if (!definition) {
    throw new Error(`未知组件类型：${type}`)
  }
  return createNode(definition, options)
}

export function canControlAcceptChildren(type: DesignerComponentType) {
  return !!getControlDefinition(type)?.acceptsChildren
}
