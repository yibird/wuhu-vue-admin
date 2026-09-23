import type { ComponentSchema, StyleSchema } from '../schema/types'

/**
 * 由设计器提供的最小节点工厂（复用物料默认 props/style）
 */
export type CreateNode = (type: string) => ComponentSchema | undefined

interface NodePatch {
  name?: string
  props?: Record<string, unknown>
  style?: StyleSchema
  children?: ComponentSchema[]
}

/**
 * 创建带覆盖项的节点，props/style 与物料默认值合并
 *
 * @param create 节点工厂
 * @param type 物料类型
 * @param patch 覆盖项
 * @returns 节点，物料未注册时返回 undefined
 */
export function makeNode(
  create: CreateNode,
  type: string,
  patch: NodePatch = {}
): ComponentSchema | undefined {
  const base = create(type)
  if (!base) return undefined
  return {
    ...base,
    name: patch.name ?? base.name,
    props: patch.props ? { ...base.props, ...patch.props } : base.props,
    style: patch.style ? { ...base.style, ...patch.style } : base.style,
    children: patch.children ?? base.children,
  }
}

/** 过滤掉未注册物料产生的空节点 */
export function compactNodes(
  nodes: Array<ComponentSchema | undefined>
): ComponentSchema[] {
  return nodes.filter((node): node is ComponentSchema => !!node)
}
