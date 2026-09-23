import type { ComputedRef, ShallowRef } from 'vue'
import { createApprovalNode } from '../data'
import type {
  ApprovalBranch,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalNodeType,
  ApprovalPaletteItem,
  ApprovalWorkflowSchema,
} from '../types'
import {
  createId,
  duplicateNodeTree,
  insertNodeAfter,
  removeNodeTree,
  updateNodeTree,
} from '../utils/nodeTree'

interface UseApprovalNodeMutationsOptions {
  schema: ShallowRef<ApprovalWorkflowSchema>
  flatNodes: ComputedRef<ApprovalNode[]>
  selectedNodeId: ShallowRef<string>
  syncSource: () => void
}

function createDefaultConditionBranches(): ApprovalBranch[] {
  return [
    {
      id: createId('branch'),
      title: '条件 1',
      priority: 1,
      rules: [
        {
          id: createId('rule'),
          field: 'amount',
          label: '报销金额',
          operator: 'gte',
          value: '5000',
        },
      ],
      nodes: [createApprovalNode('approver', '条件审批人')],
    },
    {
      id: createId('branch'),
      title: '默认条件',
      priority: 99,
      rules: [],
      nodes: [createApprovalNode('cc', '默认抄送')],
    },
  ]
}

export function useApprovalNodeMutations({
  schema,
  flatNodes,
  selectedNodeId,
  syncSource,
}: UseApprovalNodeMutationsOptions) {
  function addNodeAfter(targetId: string, type: ApprovalNodeType) {
    const nextNode = createApprovalNode(type)
    if (type === 'condition') {
      nextNode.branches = createDefaultConditionBranches()
    }

    schema.value = {
      ...schema.value,
      nodes: insertNodeAfter(schema.value.nodes, targetId, nextNode),
    }
    selectedNodeId.value = nextNode.id
    syncSource()
  }

  function addNodeFromPalette(item: ApprovalPaletteItem) {
    addNodeAfter(selectedNodeId.value || schema.value.nodes[0].id, item.type)
  }

  function duplicateNode(id: string) {
    const source = flatNodes.value.find((node) => node.id === id)
    if (!source || source.required) return
    const copiedNode = duplicateNodeTree(source)
    schema.value = {
      ...schema.value,
      nodes: insertNodeAfter(schema.value.nodes, id, copiedNode),
    }
    selectedNodeId.value = copiedNode.id
    syncSource()
  }

  function removeNode(id: string) {
    schema.value = {
      ...schema.value,
      nodes: removeNodeTree(schema.value.nodes, id),
    }
    if (selectedNodeId.value === id) {
      selectedNodeId.value = flatNodes.value[0]?.id ?? ''
    }
    syncSource()
  }

  function updateNode(id: string, patch: Partial<ApprovalNode>) {
    schema.value = {
      ...schema.value,
      nodes: updateNodeTree(schema.value.nodes, id, (node) => ({
        ...node,
        ...patch,
      })),
    }
    syncSource()
  }

  function updateNodeConfig(id: string, patch: Partial<ApprovalNodeConfig>) {
    schema.value = {
      ...schema.value,
      nodes: updateNodeTree(schema.value.nodes, id, (node) => ({
        ...node,
        config: {
          ...node.config,
          ...patch,
        },
      })),
    }
    syncSource()
  }

  function updateBranch(
    nodeId: string,
    branchId: string,
    patch: Partial<ApprovalBranch>
  ) {
    schema.value = {
      ...schema.value,
      nodes: updateNodeTree(schema.value.nodes, nodeId, (node) => ({
        ...node,
        branches: node.branches?.map((branch) =>
          branch.id === branchId ? { ...branch, ...patch } : branch
        ),
      })),
    }
    syncSource()
  }

  function addBranch(nodeId: string) {
    schema.value = {
      ...schema.value,
      nodes: updateNodeTree(schema.value.nodes, nodeId, (node) => ({
        ...node,
        branches: [
          ...(node.branches ?? []),
          {
            id: createId('branch'),
            title: `条件 ${(node.branches?.length ?? 0) + 1}`,
            priority: (node.branches?.length ?? 0) + 1,
            rules: [],
            nodes: [createApprovalNode('approver', '分支审批人')],
          },
        ],
      })),
    }
    syncSource()
  }

  return {
    addBranch,
    addNodeAfter,
    addNodeFromPalette,
    duplicateNode,
    removeNode,
    updateBranch,
    updateNode,
    updateNodeConfig,
  }
}
