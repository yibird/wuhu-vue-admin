import type { ComponentSchema, PageSchema } from './types'

export * from './types'
export { createDefaultApplication } from './defaults'

/** 虚拟根节点 ID：顶层组件的 parent */
export const ROOT_ID = '__root__'

export interface RemovedNode {
  node: ComponentSchema
  parentId: string
  index: number
}

/**
 * ComponentIndex：Schema 负责表达结构，Index 负责加速访问。
 *
 * 保留 Schema 的纯粹性（树形 JSON），同时让节点查找/父子定位 O(1)，
 * 拖拽、复制、删除、移动、Undo/Redo 都基于 Index 操作。
 */
export class SchemaIndex {
  readonly node = new Map<string, ComponentSchema>()
  readonly parent = new Map<string, string>()
  readonly prev = new Map<string, string | undefined>()
  readonly next = new Map<string, string | undefined>()
  readonly children = new Map<string, ComponentSchema[]>()

  constructor(private readonly root: ComponentSchema[] = []) {
    this.rebuild()
  }

  rebuild() {
    this.node.clear()
    this.parent.clear()
    this.prev.clear()
    this.next.clear()
    this.children.clear()
    this.children.set(ROOT_ID, this.root)
    this.rebuildNodes(this.root, ROOT_ID)
  }

  private rebuildNodes(nodes: ComponentSchema[], parentId: string) {
    nodes.forEach((child, index) => {
      if (this.node.has(child.id)) {
        console.warn(`[low-code] duplicated component id: ${child.id}`)
      }
      this.node.set(child.id, child)
      this.parent.set(child.id, parentId)
      this.prev.set(child.id, index > 0 ? nodes[index - 1].id : undefined)
      this.next.set(
        child.id,
        index < nodes.length - 1 ? nodes[index + 1].id : undefined
      )
      if (child.children?.length) {
        this.chidrenSet(child.id, child.children)
        this.rebuildNodes(child.children, child.id)
      }
    })
  }

  private chidrenSet(id: string, children: ComponentSchema[]) {
    this.children.set(id, children)
  }

  get(id: string) {
    return this.node.get(id)
  }

  getParent(id: string) {
    const parentId = this.parent.get(id)
    return parentId && parentId !== ROOT_ID
      ? this.node.get(parentId)
      : undefined
  }

  getParentId(id: string) {
    return this.parent.get(id) ?? ROOT_ID
  }

  getChildren(id: string) {
    return this.children.get(id) ?? []
  }

  indexOf(id: string) {
    const parentId = this.getParentId(id)
    return this.getChildren(parentId).findIndex((item) => item.id === id)
  }

  /** 沿祖先链计算节点路径（不含虚拟根） */
  getPath(id: string) {
    const path: string[] = []
    let current: string | undefined = id
    while (current && current !== ROOT_ID) {
      path.unshift(current)
      current = this.parent.get(current)
    }
    return path
  }

  /** ancestor 是否为 node 的祖先 */
  contains(ancestorId: string, nodeId: string) {
    let current: string | undefined = this.parent.get(nodeId)
    while (current && current !== ROOT_ID) {
      if (current === ancestorId) return true
      current = this.parent.get(current)
    }
    return false
  }

  /** 同层级前后的节点 */
  getPrev(id: string) {
    const prevId = this.prev.get(id)
    return prevId ? this.node.get(prevId) : undefined
  }

  getNext(id: string) {
    const nextId = this.next.get(id)
    return nextId ? this.node.get(nextId) : undefined
  }

  /** 将节点插入到指定父级的指定位置 */
  insert(node: ComponentSchema, parentId: string, index?: number) {
    const siblings = this.ensureChildren(parentId)
    const targetIndex =
      index === undefined || index < 0 || index > siblings.length
        ? siblings.length
        : index
    siblings.splice(targetIndex, 0, node)
    this.link(node, parentId, targetIndex)
  }

  /** 移除节点（保留其子树） */
  remove(id: string): RemovedNode | undefined {
    const node = this.node.get(id)
    if (!node) return undefined
    const parentId = this.getParentId(id)
    const siblings = this.ensureChildren(parentId)
    const index = siblings.findIndex((item) => item.id === id)
    if (index < 0) return undefined
    siblings.splice(index, 1)
    this.unlink(node)
    this.relink(parentId)
    return { node, parentId, index }
  }

  /** 移动节点到目标父级的目标位置 */
  move(id: string, parentId: string, index: number) {
    if (id === parentId || this.contains(id, parentId)) return false
    const removed = this.remove(id)
    if (!removed) return false
    const siblings = this.ensureChildren(parentId)
    const targetIndex = Math.max(0, Math.min(index, siblings.length))
    siblings.splice(targetIndex, 0, removed.node)
    this.link(removed.node, parentId, targetIndex)
    this.relink(parentId)
    if (removed.parentId !== parentId) this.relink(removed.parentId)
    return true
  }

  /** 深拷贝子树并生成新 ID（用于复制/物料实例化） */
  clone(id: string, idFactory: () => string): ComponentSchema | undefined {
    const source = this.node.get(id)
    if (!source) return undefined
    return cloneComponent(source, idFactory)
  }

  /** 重建某个父级下的索引关系 */
  relink(parentId: string) {
    const siblings = this.ensureChildren(parentId)
    siblings.forEach((child, index) => {
      this.parent.set(child.id, parentId)
      this.prev.set(child.id, index > 0 ? siblings[index - 1].id : undefined)
      this.next.set(
        child.id,
        index < siblings.length - 1 ? siblings[index + 1].id : undefined
      )
    })
  }

  private ensureChildren(parentId: string) {
    let siblings = this.children.get(parentId)
    if (!siblings) {
      siblings = []
      this.children.set(parentId, siblings)
    }
    // 关键：保证索引中的 children 数组与 Schema 节点引用一致，
    // 否则向「刚创建、尚无 children 属性」的容器插入子节点时，
    // 子节点只会写进索引而不会出现在 Schema 树上（渲染不可见）。
    if (parentId !== ROOT_ID) {
      const parent = this.node.get(parentId)
      if (parent && parent.children !== siblings) {
        if (!parent.children) {
          parent.children = siblings
        } else {
          this.children.set(parentId, parent.children)
          siblings = parent.children
        }
      }
    }
    return siblings
  }

  private link(node: ComponentSchema, parentId: string, index: number) {
    this.node.set(node.id, node)
    this.parent.set(node.id, parentId)
    const siblings = this.ensureChildren(parentId)
    this.prev.set(node.id, index > 0 ? siblings[index - 1].id : undefined)
    this.next.set(
      node.id,
      index < siblings.length - 1 ? siblings[index + 1].id : undefined
    )
    if (node.children?.length) {
      this.children.set(node.id, node.children)
      node.children.forEach((child, childIndex) => {
        this.link(child, node.id, childIndex)
      })
    } else {
      this.children.set(node.id, [])
    }
    if (index > 0) this.next.set(siblings[index - 1].id, node.id)
    if (index < siblings.length - 1) {
      this.prev.set(siblings[index + 1].id, node.id)
    }
  }

  private unlink(node: ComponentSchema) {
    this.node.delete(node.id)
    this.parent.delete(node.id)
    this.prev.delete(node.id)
    this.next.delete(node.id)
    this.children.delete(node.id)
    node.children?.forEach((child) => this.unlink(child))
  }

  /** 遍历所有节点 */
  walk(visitor: (node: ComponentSchema, parentId: string) => void) {
    const walkChildren = (nodes: ComponentSchema[], parentId: string) => {
      for (const child of nodes) {
        visitor(child, parentId)
        if (child.children?.length) walkChildren(child.children, child.id)
      }
    }
    walkChildren(this.root, ROOT_ID)
  }
}

/** 生成唯一节点 ID */
export function createNodeId(type = 'node') {
  const random = Math.random().toString(36).slice(2, 8)
  return `${type.toLowerCase()}-${Date.now().toString(36)}-${random}`
}

/** 深拷贝组件子树，并生成新的节点 ID */
export function cloneComponent(
  source: ComponentSchema,
  idFactory: () => string = () => createNodeId(source.type)
): ComponentSchema {
  const clone: ComponentSchema = {
    ...source,
    id: idFactory(),
    props: source.props ? { ...source.props } : undefined,
    bindings: source.bindings ? { ...source.bindings } : undefined,
    events: source.events?.map((event) => ({
      ...event,
      actions: [...event.actions],
    })),
    style: source.style ? structuredCloneSafe(source.style) : undefined,
    children: source.children?.map((child) => cloneComponent(child, idFactory)),
  }
  return clone
}

/** 深拷贝普通 JSON 数据（Schema 中的 props/style 只应包含可序列化值） */
export function structuredCloneSafe<T>(value: T): T {
  return clonePlain(value)
}

function clonePlain<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) {
    return value.map((item) => clonePlain(item)) as unknown as T
  }
  const result: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    result[key] = clonePlain(item)
  }
  return result as T
}

/** 收集子树内所有节点 ID */
export function collectIds(node: ComponentSchema): string[] {
  const ids: string[] = []
  const walk = (current: ComponentSchema) => {
    ids.push(current.id)
    current.children?.forEach(walk)
  }
  walk(node)
  return ids
}

/** 在页面组件树中查找节点 */
export function findComponent(
  page: PageSchema | undefined,
  id: string
): ComponentSchema | undefined {
  if (!page) return undefined
  const index = new SchemaIndex(page.components)
  return index.get(id)
}
