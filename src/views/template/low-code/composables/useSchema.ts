import {
  canControlAcceptChildren,
  createDesignerNode,
  isDesignerComponentType,
} from '../components/controls/registry.ts'
import { cloneDesignerNodes, createNodeId } from '../utils/nodeTree.ts'

import type {
  DesignerJsonSchema,
  DesignerNode,
  DesignerNodeStyle,
} from '../types'

type RecordValue = Record<string, unknown>

const MAX_SCHEMA_SIZE = 2_000_000
const MAX_NODE_COUNT = 500
const MAX_NODE_DEPTH = 5

export const cloneNodes = cloneDesignerNodes

export const createSchema = (
  nodes: DesignerNode[],
  base?: Partial<DesignerJsonSchema>
): DesignerJsonSchema => ({
  $schema: base?.$schema ?? 'https://wuhu.dev/schemas/low-code/v1.json',
  version: base?.version ?? '1.0.0',
  title: base?.title ?? 'Low Code Page',
  layout: {
    type: 'grid',
    columns: Number(base?.layout?.columns ?? 12),
    gap: Number(base?.layout?.gap ?? 12),
  },
  components: cloneNodes(nodes),
})

export const cloneSchema = (schema: DesignerJsonSchema) =>
  createSchema(schema.components, schema)

export const formatSchema = (schema: DesignerJsonSchema) =>
  JSON.stringify(schema, null, 2)

export function sanitizeSchemaFileName(value: string) {
  const name = value.trim().replace(/[\\/:*?"<>|]/g, '-')
  return name || 'low-code-page'
}

function isRecord(value: unknown): value is RecordValue {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function readOptionalString(value: unknown, label: string, maxLength: number) {
  if (value === undefined) return undefined
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new Error(`${label} 必须是长度不超过 ${maxLength} 的字符串`)
  }
  return value
}

function isCompatibleValue(value: unknown, target: unknown) {
  if (Array.isArray(target)) return Array.isArray(value)
  if (isRecord(target)) return isRecord(value)
  return typeof value === typeof target
}

function applySchemaProps(node: DesignerNode, value: unknown, label: string) {
  if (value === undefined) return
  if (!isRecord(value) || !isRecord(node.props)) {
    throw new Error(`${label}.props 必须是对象`)
  }

  const nodeProps = node.props as RecordValue
  for (const [key, nextValue] of Object.entries(value)) {
    if (!(key in nodeProps) || !isCompatibleValue(nextValue, nodeProps[key])) {
      throw new Error(`${label}.props.${key} 不受支持或类型错误`)
    }
  }
  Object.assign(node.props, value)
}

function applySchemaStyle(node: DesignerNode, value: unknown, label: string) {
  if (value === undefined) return
  if (!isRecord(value)) throw new Error(`${label}.style 必须是对象`)

  const style: Partial<DesignerNodeStyle> = {}
  for (const key of Object.keys(value)) {
    if (!['columns', 'density', 'gridColumn', 'tone'].includes(key)) {
      throw new Error(`${label}.style.${key} 不受支持`)
    }
  }
  if ('columns' in value) {
    const columns = Number(value.columns)
    if (!Number.isInteger(columns) || columns < 1 || columns > 12) {
      throw new Error(`${label}.style.columns 必须是 1 到 12 的整数`)
    }
    style.columns = columns
  }
  if ('gridColumn' in value) {
    const gridColumn = Number(value.gridColumn)
    if (!Number.isInteger(gridColumn) || gridColumn < 1 || gridColumn > 12) {
      throw new Error(`${label}.style.gridColumn 必须是 1 到 12 的整数`)
    }
    style.gridColumn = gridColumn
  }
  if ('density' in value) {
    if (
      !['compact', 'comfortable', 'spacious'].includes(String(value.density))
    ) {
      throw new Error(`${label}.style.density 不受支持`)
    }
    style.density = String(value.density) as DesignerNodeStyle['density']
  }
  if ('tone' in value) {
    if (
      !['neutral', 'primary', 'success', 'warning'].includes(String(value.tone))
    ) {
      throw new Error(`${label}.style.tone 不受支持`)
    }
    style.tone = String(value.tone) as DesignerNodeStyle['tone']
  }
  Object.assign(node.style, style)
}

function parseSchemaNode(
  value: unknown,
  seenIds: Set<string>,
  state: { count: number },
  depth = 0,
  label = 'components'
): DesignerNode {
  if (!isRecord(value)) throw new Error(`${label} 必须是对象`)
  if (depth > MAX_NODE_DEPTH) {
    throw new Error(`组件嵌套不能超过 ${MAX_NODE_DEPTH} 层`)
  }
  state.count += 1
  if (state.count > MAX_NODE_COUNT) {
    throw new Error(`组件数量不能超过 ${MAX_NODE_COUNT}`)
  }

  if (typeof value.type !== 'string' || !isDesignerComponentType(value.type)) {
    throw new Error(`${label}.type 是未知组件类型`)
  }

  const id = readOptionalString(value.id, `${label}.id`, 128) || createNodeId()
  if (!id.trim()) throw new Error(`${label}.id 不能为空`)
  if (seenIds.has(id)) throw new Error(`组件 id 重复：${id}`)
  seenIds.add(id)

  const node = createDesignerNode(value.type, {
    description: readOptionalString(
      value.description,
      `${label}.description`,
      1000
    ),
    id,
    title: readOptionalString(value.title, `${label}.title`, 200),
  })
  applySchemaProps(node, value.props, label)
  applySchemaStyle(node, value.style, label)

  if (value.children !== undefined) {
    if (!Array.isArray(value.children)) {
      throw new Error(`${label}.children 必须是数组`)
    }
    if (value.children.length && !canControlAcceptChildren(node.type)) {
      throw new Error(`${label} 的组件类型不允许包含子节点`)
    }
    node.children = value.children.map((child, index) =>
      parseSchemaNode(
        child,
        seenIds,
        state,
        depth + 1,
        `${label}.children[${index}]`
      )
    )
  }

  return node
}

export const parseSchema = (value: string): DesignerJsonSchema => {
  if (value.length > MAX_SCHEMA_SIZE) throw new Error('JsonSchema 文件过大')

  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch {
    throw new Error('JsonSchema 不是有效的 JSON')
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.components)) {
    throw new Error('JsonSchema components 必须是数组')
  }
  if (parsed.layout !== undefined && !isRecord(parsed.layout)) {
    throw new Error('JsonSchema layout 必须是对象')
  }

  const columns = Number(parsed.layout?.columns ?? 12)
  const gap = Number(parsed.layout?.gap ?? 12)
  if (!Number.isInteger(columns) || columns < 1 || columns > 24) {
    throw new Error('JsonSchema layout.columns 必须是 1 到 24 的整数')
  }
  if (!Number.isFinite(gap) || gap < 0 || gap > 64) {
    throw new Error('JsonSchema layout.gap 必须在 0 到 64 之间')
  }

  const seenIds = new Set<string>()
  const state = { count: 0 }
  const components = parsed.components.map((node, index) =>
    parseSchemaNode(node, seenIds, state, 0, `components[${index}]`)
  )

  return createSchema(components, {
    $schema: readOptionalString(parsed.$schema, '$schema', 500),
    version: readOptionalString(parsed.version, 'version', 32),
    title: readOptionalString(parsed.title, 'title', 200),
    layout: { type: 'grid', columns, gap },
  })
}
