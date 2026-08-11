import { cloneDeep } from 'es-toolkit'
import type { ApprovalNode, ApprovalWorkflowSchema } from '../types'

export function cloneSchema(
  schema: ApprovalWorkflowSchema
): ApprovalWorkflowSchema {
  return cloneDeep(schema)
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function collectNodes(nodes: ApprovalNode[]): ApprovalNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(node.branches ?? []).flatMap((branch) => collectNodes(branch.nodes)),
    ...collectNodes(node.children ?? []),
  ])
}

export function updateNodeTree(
  nodes: ApprovalNode[],
  id: string,
  updater: (node: ApprovalNode) => ApprovalNode
): ApprovalNode[] {
  return nodes.map((node) => {
    const nextNode = node.id === id ? updater(node) : node

    return {
      ...nextNode,
      children: nextNode.children
        ? updateNodeTree(nextNode.children, id, updater)
        : nextNode.children,
      branches: nextNode.branches?.map((branch) => ({
        ...branch,
        nodes: updateNodeTree(branch.nodes, id, updater),
      })),
    }
  })
}

export function removeNodeTree(
  nodes: ApprovalNode[],
  id: string
): ApprovalNode[] {
  return nodes
    .filter((node) => node.id !== id || node.required)
    .map((node) => ({
      ...node,
      children: node.children
        ? removeNodeTree(node.children, id)
        : node.children,
      branches: node.branches?.map((branch) => ({
        ...branch,
        nodes: removeNodeTree(branch.nodes, id),
      })),
    }))
}

export function insertNodeAfter(
  nodes: ApprovalNode[],
  targetId: string,
  newNode: ApprovalNode
): ApprovalNode[] {
  return nodes.flatMap((node) => {
    const nextNode = {
      ...node,
      children: node.children
        ? insertNodeAfter(node.children, targetId, newNode)
        : node.children,
      branches: node.branches?.map((branch) => ({
        ...branch,
        nodes: insertNodeAfter(branch.nodes, targetId, newNode),
      })),
    }

    return node.id === targetId ? [nextNode, newNode] : [nextNode]
  })
}

export function duplicateNodeTree(source: ApprovalNode): ApprovalNode {
  const copy = cloneDeep(source)
  const renewNodeIds = (node: ApprovalNode, isRoot = false): ApprovalNode => ({
    ...node,
    id: createId(node.type),
    title: isRoot ? `${source.title} 副本` : node.title,
    required: false,
    children: node.children?.map((child) => renewNodeIds(child)),
    branches: node.branches?.map((branch) => ({
      ...branch,
      id: createId('branch'),
      rules: branch.rules.map((rule) => ({
        ...rule,
        id: createId('rule'),
      })),
      nodes: branch.nodes.map((child) => renewNodeIds(child)),
    })),
  })

  return renewNodeIds(copy, true)
}
