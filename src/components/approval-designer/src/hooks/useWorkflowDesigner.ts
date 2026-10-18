import { computed, shallowRef, toValue, watch } from 'vue'
import { message } from 'antdv-next'
import { approvalPalette } from '../data'
import type { MaybeRefOrGetter } from 'vue'
import type {
  ApprovalPaletteItem,
  ApprovalSimulationInput,
  ApprovalSimulationStep,
  ApprovalTemplateItem,
  ApprovalUserRef,
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
  /**
   * @desc 替换后选中的节点 id
   */
  selectedNodeId?: string
}

export interface UseApprovalWorkflowDesignerOptions {
  /**
   * @desc 初始审批流 Schema
   */
  initialSchema: ApprovalWorkflowSchema
  /**
   * @desc 可选择的用户列表
   */
  users?: MaybeRefOrGetter<readonly ApprovalUserRef[] | undefined>
  /**
   * @desc 流程模板
   */
  templates?: MaybeRefOrGetter<readonly ApprovalTemplateItem[] | undefined>
  /**
   * @desc 节点面板
   */
  palette?: MaybeRefOrGetter<readonly ApprovalPaletteItem[] | undefined>
  /**
   * @desc 初始选中节点
   */
  initialSelectedNodeId?: string
  /**
   * @desc schema 变化回调
   */
  onChange?: (schema: ApprovalWorkflowSchema) => void
  /**
   * @desc 校验结果回调
   */
  onValidate?: (result: {
    valid: boolean
    issues: ApprovalValidationIssue[]
  }) => void
}

export function useApprovalWorkflowDesigner(
  options: UseApprovalWorkflowDesignerOptions
) {
  const schema = shallowRef(cloneSchema(options.initialSchema))
  const selectedNodeId = shallowRef(
    options.initialSelectedNodeId ??
      collectNodes(schema.value.nodes)[1]?.id ??
      schema.value.nodes[0]?.id ??
      ''
  )
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

  const users = computed(() => toValue(options.users) ?? [])
  const templates = computed(() => toValue(options.templates) ?? [])
  const palette = computed(() => toValue(options.palette) ?? approvalPalette)

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

  watch(schema, () => {
    syncSource()
    options.onChange?.(cloneSchema(schema.value))
  })

  const {
    addBranch,
    addNodeAfter,
    addNodeFromPalette,
    duplicateNode,
    moveNode,
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
    {
      syncSource: shouldSyncSource = true,
      selectedNodeId: nextSelectedNodeId,
    }: ReplaceSchemaOptions = {}
  ) {
    schema.value = cloneSchema(nextSchema)
    selectedNodeId.value =
      nextSelectedNodeId ??
      collectNodes(schema.value.nodes)[1]?.id ??
      schema.value.nodes[0]?.id ??
      ''
    if (shouldSyncSource) syncSource()
  }

  function setSchema(
    nextSchema: ApprovalWorkflowSchema,
    options: ReplaceSchemaOptions = {}
  ) {
    replaceSchema(nextSchema, options)
  }

  function getSchema() {
    return cloneSchema(schema.value)
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
    const template = templates.value.find((item) => item.id === templateId)
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
    options.onValidate?.(result)
    return result.valid
  }

  function runSimulation() {
    simulationSteps.value = createSimulationSteps(
      schema.value.nodes,
      simulationInput.value
    )
    message.success('模拟测试完成')
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
    flatNodes,
    palette,
    schema,
    selectedNode,
    selectedNodeId,
    simulationInput,
    simulationSteps,
    sourceCode,
    sourceError,
    sourcePanelOpen,
    stats,
    templates,
    users,
    validationIssues,
    addBranch,
    addNodeAfter,
    addNodeFromPalette,
    applyTemplate,
    copySchema,
    downloadSchema,
    duplicateNode,
    getSchema,
    handleSourceChange,
    moveNode,
    removeNode,
    runSimulation,
    selectNode,
    setSchema,
    toggleSourcePanel,
    updateBranch,
    updateNode,
    updateNodeConfig,
    updateSettings,
    validateWorkflow,
  }
}
