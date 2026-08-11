import type { DesignerDropTarget, DesignerNode } from '../types'

export interface DesignerNodeLocation {
  index: number
  node: DesignerNode
  parent?: DesignerNode
  siblings: DesignerNode[]
}

export const createNodeId = () =>
  `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function cloneDesignerNode(node: DesignerNode): DesignerNode {
  return {
    ...node,
    children: node.children?.map(cloneDesignerNode),
    props: { ...node.props },
    style: { ...node.style },
  }
}

export const cloneDesignerNodes = (nodes: DesignerNode[]) =>
  nodes.map(cloneDesignerNode)

export function flattenDesignerNodes(nodes: DesignerNode[]): DesignerNode[] {
  return nodes.flatMap((node) => [
    node,
    ...flattenDesignerNodes(node.children ?? []),
  ])
}

export function findDesignerNode(
  nodes: DesignerNode[],
  id: string
): DesignerNode | undefined {
  return findDesignerNodeLocation(nodes, id)?.node
}

export function findDesignerNodeLocation(
  nodes: DesignerNode[],
  id: string,
  parent?: DesignerNode
): DesignerNodeLocation | undefined {
  for (const [index, node] of nodes.entries()) {
    if (node.id === id) return { index, node, parent, siblings: nodes }
    const childLocation = findDesignerNodeLocation(
      node.children ?? [],
      id,
      node
    )
    if (childLocation) return childLocation
  }
  return undefined
}

export function updateDesignerNode(
  nodes: DesignerNode[],
  id: string,
  updater: (node: DesignerNode) => DesignerNode
): DesignerNode[] {
  return nodes.map((node) => {
    if (node.id === id) return updater(node)
    if (!node.children?.length) return node
    return {
      ...node,
      children: updateDesignerNode(node.children, id, updater),
    }
  })
}

export function removeDesignerNodes(
  nodes: DesignerNode[],
  ids: Set<string>
): DesignerNode[] {
  return nodes
    .filter((node) => !ids.has(node.id))
    .map((node) =>
      node.children?.length
        ? { ...node, children: removeDesignerNodes(node.children, ids) }
        : node
    )
}

function insertIntoParent(
  nodes: DesignerNode[],
  target: DesignerDropTarget,
  node: DesignerNode
): DesignerNode[] {
  if (!target.parentId) {
    const nextNodes = [...nodes]
    nextNodes.splice(target.index, 0, node)
    return nextNodes
  }

  return updateDesignerNode(nodes, target.parentId, (parent) => {
    const children = [...(parent.children ?? [])]
    children.splice(target.index, 0, node)
    return { ...parent, children }
  })
}

export function insertDesignerNode(
  nodes: DesignerNode[],
  target: DesignerDropTarget,
  node: DesignerNode
) {
  return insertIntoParent(nodes, target, node)
}

export function moveDesignerNode(
  nodes: DesignerNode[],
  id: string,
  target: DesignerDropTarget
) {
  const location = findDesignerNodeLocation(nodes, id)
  if (!location) return nodes
  if (target.parentId === id) return nodes

  const removed = removeDesignerNodes(nodes, new Set([id]))
  const sameParent =
    location.parent?.id === target.parentId ||
    (!location.parent && !target.parentId)
  const targetIndex =
    sameParent && target.index > location.index
      ? target.index - 1
      : target.index

  return insertIntoParent(
    removed,
    { ...target, index: targetIndex },
    location.node
  )
}

export function moveDesignerNodeByStep(
  nodes: DesignerNode[],
  id: string,
  step: -1 | 1
) {
  const location = findDesignerNodeLocation(nodes, id)
  if (!location) return nodes
  const nextIndex = location.index + step
  if (nextIndex < 0 || nextIndex >= location.siblings.length) return nodes

  const nextSiblings = [...location.siblings]
  const [target] = nextSiblings.splice(location.index, 1)
  if (!target) return nodes
  nextSiblings.splice(nextIndex, 0, target)

  if (!location.parent) return nextSiblings
  return updateDesignerNode(nodes, location.parent.id, (parent) => ({
    ...parent,
    children: nextSiblings,
  }))
}

function cloneNodeForDuplicate(node: DesignerNode): DesignerNode {
  return {
    ...cloneDesignerNode(node),
    children: node.children?.map(cloneNodeForDuplicate),
    id: createNodeId(),
    title: `${node.title} 副本`,
  }
}

export function duplicateDesignerNode(nodes: DesignerNode[], id: string) {
  const location = findDesignerNodeLocation(nodes, id)
  if (!location) return { nodes, selectedIds: [] }

  const copy = cloneNodeForDuplicate(location.node)
  const target = {
    index: location.index + 1,
    parentId: location.parent?.id,
  }
  return {
    nodes: insertDesignerNode(nodes, target, copy),
    selectedIds: [copy.id],
  }
}

export function duplicateDesignerNodes(nodes: DesignerNode[], ids: string[]) {
  let nextNodes = nodes
  const selectedIds: string[] = []
  for (const id of ids) {
    const result = duplicateDesignerNode(nextNodes, id)
    nextNodes = result.nodes
    selectedIds.push(...result.selectedIds)
  }
  return { nodes: nextNodes, selectedIds }
}

export function getExistingDesignerNodeIds(
  nodes: DesignerNode[],
  ids: string[]
) {
  const existingIds = new Set(
    flattenDesignerNodes(nodes).map((node) => node.id)
  )
  return Array.from(new Set(ids.filter((id) => existingIds.has(id))))
}

const MAX_CONTAINER_DEPTH = 5

export function getNodeDepth(nodes: DesignerNode[], id: string): number {
  let depth = 0
  let currentId = id
  while (true) {
    const location = findDesignerNodeLocation(nodes, currentId)
    if (!location?.parent) return depth
    depth++
    currentId = location.parent.id
  }
}

function getDescendantIds(node: DesignerNode): Set<string> {
  const ids = new Set<string>()
  function collect(children: DesignerNode[]) {
    for (const child of children) {
      ids.add(child.id)
      if (child.children?.length) collect(child.children)
    }
  }
  if (node.children?.length) collect(node.children)
  return ids
}

export function canMoveNodeToTarget(
  nodes: DesignerNode[],
  nodeId: string,
  target: DesignerDropTarget
): { allowed: boolean; reason?: string } {
  if (!target.parentId) return { allowed: true }

  if (target.parentId === nodeId) {
    return { allowed: false, reason: '不能将容器拖入自身' }
  }

  const node = findDesignerNode(nodes, nodeId)
  if (!node) return { allowed: false, reason: '找不到节点' }

  const descendantIds = getDescendantIds(node)
  if (descendantIds.has(target.parentId)) {
    return { allowed: false, reason: '不能将容器拖入其子容器' }
  }

  const targetDepth = getNodeDepth(nodes, target.parentId)
  const nodeDepth = getNodeDepth(nodes, nodeId)
  const maxChildDepth = targetDepth + (nodeDepth + 1)
  if (maxChildDepth > MAX_CONTAINER_DEPTH) {
    return {
      allowed: false,
      reason: `容器嵌套不能超过 ${MAX_CONTAINER_DEPTH} 层`,
    }
  }

  return { allowed: true }
}

export function canAddNodeToTarget(
  nodes: DesignerNode[],
  target: DesignerDropTarget
): { allowed: boolean; reason?: string } {
  if (!target.parentId) return { allowed: true }

  const targetDepth = getNodeDepth(nodes, target.parentId)
  if (targetDepth + 1 > MAX_CONTAINER_DEPTH) {
    return {
      allowed: false,
      reason: `容器嵌套不能超过 ${MAX_CONTAINER_DEPTH} 层`,
    }
  }

  return { allowed: true }
}
