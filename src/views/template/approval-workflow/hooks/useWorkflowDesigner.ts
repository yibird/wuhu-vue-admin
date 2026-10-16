import { computed, shallowRef } from 'vue'
import { message } from 'antdv-next'
import {
  approvalPalette,
  approvalTemplates,
  approvalUsers,
  initialApprovalSchema,
} from '../data'
import type {
  ApprovalSimulationInput,
  ApprovalSimulationStep,
  ApprovalValidationIssue,
  ApprovalWorkflowSchema,
  ApprovalWorkflowSettings,
} from '../types'
import { cloneSchema, collectNodes } from '../utils/node-tree'
import { parseApprovalWorkflowSchema } from '../utils/schema'
import { createSimulationSteps } from '../utils/simulation'
import { validateApprovalWorkflow } from '../utils/validation'
import { useApprovalNodeMutations } from './useNodeMutations'

interface ReplaceSchemaOptions {
  /**
   * @desc 替换 schema 后是否回写源码编辑器内容
   * @default true
   */
  syncSource?: boolean
}

export function useApprovalWorkflowDesigner() {
  const schema = shallowRef(cloneSchema(initialApprovalSchema))
  const selectedNodeId = shallowRef('manager-approval')
  const sourcePanelOpen = shallowRef(false)
  const sourceCode = shallowRef(JSON.stringify(schema.value, null, 2))
  const sourceError = shallowRef('')
  const simulationInput = shallowRef<ApprovalSimulationInput>({
    amount: 6800,
    leaveDays: 4,
    department: '销售一部',
    applicant: '张敏',
    assetType: '差旅报销',
  })
  const simulationSteps = shallowRef<ApprovalSimulationStep[]>([])
  const validationIssues = shallowRef<ApprovalValidationIssue[]>([])
  const publishBusy = shallowRef(false)

  const flatNodes = computed(() => collectNodes(schema.value.nodes))
  const selectedNode = computed(() =>
    flatNodes.value.find((node) => node.id === selectedNodeId.value)
  )
  const stats = computed(() => {
    const nodes = flatNodes.value
    return {
      nodeCount: nodes.length,
      issueCount: validationIssues.value.filter(
        (issue) => issue.level === 'error'
      ).length,
    }
  })

  function syncSource() {
    sourceCode.value = JSON.stringify(schema.value, null, 2)
  }

  const {
    addBranch,
    addNodeAfter,
    addNodeFromPalette,
    duplicateNode,
    removeNode,
    updateBranch,
    updateNode,
    updateNodeConfig,
  } = useApprovalNodeMutations({
    schema,
    flatNodes,
    selectedNodeId,
    syncSource,
  })

  function replaceSchema(
    nextSchema: ApprovalWorkflowSchema,
    { syncSource: shouldSyncSource = true }: ReplaceSchemaOptions = {}
  ) {
    schema.value = cloneSchema(nextSchema)
    selectedNodeId.value =
      collectNodes(schema.value.nodes)[1]?.id ?? schema.value.nodes[0]?.id ?? ''
    if (shouldSyncSource) syncSource()
  }

  function selectNode(id: string) {
    selectedNodeId.value = id
  }

  function updateSettings(patch: Partial<ApprovalWorkflowSettings>) {
    schema.value = {
      ...schema.value,
      settings: {
        ...schema.value.settings,
        ...patch,
      },
    }
    syncSource()
  }

  function applyTemplate(templateId: string) {
    const template = approvalTemplates.find((item) => item.id === templateId)
    if (!template) return
    replaceSchema({
      ...schema.value,
      settings: {
        ...schema.value.settings,
        name: template.title,
        description: template.description,
        state: 'draft',
      },
      nodes: cloneSchema({ ...schema.value, nodes: template.nodes }).nodes,
    })
  }

  function validateWorkflow() {
    const result = validateApprovalWorkflow(schema.value, flatNodes.value)
    validationIssues.value = result.issues
    return result.valid
  }

  function runSimulation() {
    simulationSteps.value = createSimulationSteps(
      schema.value.nodes,
      simulationInput.value
    )
    message.success('模拟测试完成')
  }

  async function publishWorkflow() {
    publishBusy.value = true
    try {
      if (!validateWorkflow()) {
        message.error('流程存在阻塞问题，无法发布')
        return false
      }

      await new Promise((resolve) => window.setTimeout(resolve, 280))
      updateSettings({ state: 'published' })
      message.success('审批流已发布')
      return true
    } finally {
      publishBusy.value = false
    }
  }

  function toggleSourcePanel() {
    sourcePanelOpen.value = !sourcePanelOpen.value
  }

  function handleSourceChange(value: string) {
    sourceCode.value = value
    const result = parseApprovalWorkflowSchema(value)
    if (!result.schema) {
      sourceError.value = result.error ?? 'Schema 解析失败'
      return
    }
    replaceSchema(result.schema, { syncSource: false })
    sourceError.value = ''
  }

  async function copySchema() {
    syncSource()
    if (!navigator.clipboard?.writeText) {
      message.error('当前环境不支持剪贴板，请手动复制 Schema')
      return
    }
    try {
      await navigator.clipboard.writeText(sourceCode.value)
      message.success('审批流 Schema 已复制')
    } catch {
      message.error('复制失败，请手动复制 Schema')
    }
  }

  function downloadSchema() {
    syncSource()
    const blob = new Blob([sourceCode.value], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${schema.value.settings.name || 'approval-workflow'}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return {
    approvalPalette,
    approvalTemplates,
    approvalUsers,
    flatNodes,
    publishBusy,
    schema,
    selectedNode,
    selectedNodeId,
    simulationInput,
    simulationSteps,
    sourceCode,
    sourceError,
    sourcePanelOpen,
    stats,
    validationIssues,
    addBranch,
    addNodeAfter,
    addNodeFromPalette,
    applyTemplate,
    copySchema,
    downloadSchema,
    duplicateNode,
    handleSourceChange,
    publishWorkflow,
    removeNode,
    runSimulation,
    selectNode,
    toggleSourcePanel,
    updateBranch,
    updateNode,
    updateNodeConfig,
    updateSettings,
    validateWorkflow,
  }
}
