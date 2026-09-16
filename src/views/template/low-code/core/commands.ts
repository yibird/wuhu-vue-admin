import { cloneComponent, structuredCloneSafe } from './schema'
import type { SchemaIndex } from './schema'
import type { HistoryEntry } from './history'
import type { ComponentSchema, EventSchema, StyleSchema } from './schema/types'

/** 节点补丁：支持 props/style/bindings 的键级合并，undefined 表示删除 */
export interface NodePatch {
  name?: string
  visible?: string
  disabled?: string
  locked?: boolean
  hidden?: boolean
  props?: Record<string, unknown>
  style?: Partial<StyleSchema>
  bindings?: Record<string, string | undefined>
  events?: EventSchema[]
}

function applyRecordUpdate(
  target: Record<string, unknown> | undefined,
  patch: Record<string, unknown>,
  prev: Record<string, unknown>,
  restore: boolean
) {
  const container = target ?? {}
  for (const key of Object.keys(patch)) {
    const value = restore ? prev[key] : patch[key]
    if (value === undefined) {
      delete container[key]
    } else {
      container[key] = value
    }
  }
  return container
}

function captureRecord(
  target: Record<string, unknown> | undefined,
  keys: string[]
) {
  const prev: Record<string, unknown> = {}
  for (const key of keys) {
    const value = target?.[key]
    prev[key] = value === undefined ? undefined : structuredCloneSafe(value)
  }
  return prev
}

/** 更新节点属性（props/style/bindings 为键级合并） */
export function createUpdateCommand(
  index: SchemaIndex,
  id: string,
  patch: NodePatch,
  label = '更新组件'
): HistoryEntry {
  const node = index.get(id)
  if (!node) {
    return { label, undo: () => {}, redo: () => {}, timestamp: 0 }
  }

  const prevState = {
    name: node.name,
    visible: node.visible,
    disabled: node.disabled,
    locked: node.locked,
    hidden: node.hidden,
    props: captureRecord(node.props, Object.keys(patch.props ?? {})),
    style: captureRecord(
      node.style as Record<string, unknown> | undefined,
      Object.keys(patch.style ?? {})
    ),
    bindings: captureRecord(node.bindings, Object.keys(patch.bindings ?? {})),
    events: node.events ? structuredCloneSafe(node.events) : undefined,
  }

  const apply = (restore: boolean) => {
    if (patch.name !== undefined)
      node.name = restore ? prevState.name : patch.name
    if (patch.visible !== undefined) {
      node.visible = restore ? prevState.visible : patch.visible
    }
    if (patch.disabled !== undefined) {
      node.disabled = restore ? prevState.disabled : patch.disabled
    }
    if (patch.locked !== undefined) {
      node.locked = restore ? prevState.locked : patch.locked
    }
    if (patch.hidden !== undefined) {
      node.hidden = restore ? prevState.hidden : patch.hidden
    }
    if (patch.props) {
      node.props = applyRecordUpdate(
        node.props,
        patch.props,
        prevState.props,
        restore
      )
    }
    if (patch.style) {
      node.style = applyRecordUpdate(
        node.style as Record<string, unknown> | undefined,
        patch.style as Record<string, unknown>,
        prevState.style,
        restore
      ) as StyleSchema
    }
    if (patch.bindings) {
      node.bindings = applyRecordUpdate(
        node.bindings,
        patch.bindings,
        prevState.bindings,
        restore
      ) as Record<string, string>
    }
    if (patch.events) {
      node.events = restore
        ? prevState.events
        : structuredCloneSafe(patch.events)
    }
  }

  return {
    label,
    undo: () => apply(true),
    redo: () => apply(false),
    timestamp: 0,
  }
}

/** 插入节点 */
export function createInsertCommand(
  index: SchemaIndex,
  nodes: ComponentSchema[],
  parentId: string,
  position: number | undefined,
  label = '添加组件'
): HistoryEntry {
  let currentPosition = position
  const apply = () => {
    const siblings = index.getChildren(parentId)
    const start =
      currentPosition === undefined
        ? siblings.length
        : Math.max(0, Math.min(currentPosition, siblings.length))
    nodes.forEach((node, offset) => {
      index.insert(node, parentId, start + offset)
    })
    if (currentPosition === undefined) currentPosition = start
  }
  return {
    label,
    undo: () => {
      nodes.forEach((node) => index.remove(node.id))
    },
    redo: apply,
    timestamp: 0,
  }
}

/** 删除节点，记录原位置以支持撤销 */
export function createRemoveCommand(
  index: SchemaIndex,
  ids: string[],
  label = '删除组件'
): HistoryEntry {
  const removed = ids
    .map((id) => {
      const node = index.get(id)
      if (!node) return undefined
      return {
        node,
        parentId: index.getParentId(id),
        index: index.indexOf(id),
      }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)

  return {
    label,
    undo: () => {
      // 按原位置从小到大依次插回，保证顺序稳定
      const ordered = [...removed].sort((a, b) => a.index - b.index)
      for (const item of ordered) {
        index.insert(item.node, item.parentId, item.index)
      }
    },
    redo: () => {
      for (const item of removed) index.remove(item.node.id)
    },
    timestamp: 0,
  }
}

/** 批量更新节点（多选场景），合并为一条历史记录 */
export function createBatchUpdateCommand(
  index: SchemaIndex,
  ids: string[],
  patch: NodePatch,
  label = '批量更新组件'
): HistoryEntry {
  const commands = ids.map((id) => createUpdateCommand(index, id, patch, label))
  return {
    label,
    undo: () => {
      for (const command of [...commands].reverse()) command.undo()
    },
    redo: () => {
      for (const command of commands) command.redo()
    },
    timestamp: 0,
  }
}

/** 移动节点（拖拽排序 / 移动层级） */
export function createMoveCommand(
  index: SchemaIndex,
  id: string,
  parentId: string,
  position: number,
  label = '移动组件'
): HistoryEntry {
  const fromParentId = index.getParentId(id)
  const fromPosition = index.indexOf(id)
  return {
    label,
    undo: () => {
      index.move(id, fromParentId, fromPosition)
    },
    redo: () => {
      index.move(id, parentId, position)
    },
    timestamp: 0,
  }
}

/** 复制节点（在原节点之后插入副本） */
export function createDuplicateCommand(
  index: SchemaIndex,
  id: string,
  idFactory: () => string,
  label = '复制组件'
): { entry: HistoryEntry; node?: ComponentSchema } {
  const source = index.get(id)
  if (!source) {
    return { entry: { label, undo: () => {}, redo: () => {}, timestamp: 0 } }
  }
  const parentId = index.getParentId(id)
  const position = index.indexOf(id) + 1
  const clone = cloneComponent(source, idFactory)
  const entry = createInsertCommand(index, [clone], parentId, position, label)
  return { entry, node: clone }
}

/** 层级操作：上移/下移一层 */
export function createReorderCommand(
  index: SchemaIndex,
  id: string,
  direction: 'up' | 'down',
  label = direction === 'up' ? '上移一层' : '下移一层'
): HistoryEntry | undefined {
  const parentId = index.getParentId(id)
  const position = index.indexOf(id)
  const targetPosition = direction === 'up' ? position - 1 : position + 1
  const siblings = index.getChildren(parentId)
  if (targetPosition < 0 || targetPosition >= siblings.length) return undefined
  return {
    label,
    undo: () => index.move(id, parentId, position),
    redo: () => index.move(id, parentId, targetPosition),
    timestamp: 0,
  }
}
