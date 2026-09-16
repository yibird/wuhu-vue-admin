import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import {
  MarkerType,
  useVueFlow,
  type Connection,
  type DefaultEdgeOptions,
  type EdgeMouseEvent,
  type MouseTouchEvent,
  type NodeDragEvent,
  type NodeMouseEvent,
  type XYPosition,
} from '@vue-flow/core'
import { message } from 'antdv-next'
import { useWorkflowHistory } from './useWorkflowHistory'
import { WORKFLOW_FLOW_ID } from '../constants'
import {
  areWorkflowDataSchemasCompatible,
  compileWorkflowSchema,
  createWorkflowRuntime,
  getWorkflowNodeDefinition,
  isJsonValue,
} from '../../domain'
import {
  createSchemaNodeFromPalette,
  createWorkflowEdge,
  formatJsonSource,
  flowToSchema,
  formatWorkflowSchema,
  initialWorkflowSchema,
  parseWorkflowSchema,
  schemaToFlow,
  workflowPalette,
  workflowPaletteGroupLabels,
} from '../data'
import type {
  WorkflowContextActionKey,
  WorkflowContextMenuAction,
  WorkflowContextMenuState,
  WorkflowEditableField,
  WorkflowEdge,
  WorkflowJsonSchema,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeKind,
  WorkflowPaletteGroup,
  WorkflowPaletteItem,
  WorkflowRunLog,
  WorkflowSourceStatus,
  WorkflowTestCase,
} from '../types'

const NODE_SPACING_Y = 92

const PALETTE_GROUP_ORDER: WorkflowPaletteGroup[] = [
  'basic',
  'ai',
  'data',
  'logic',
  'workflow',
  'human',
  'integration',
]

const PALETTE_GROUP_ICONS: Record<WorkflowPaletteGroup, string> = {
  basic: 'i-lucide:box',
  ai: 'i-lucide:sparkles',
  data: 'i-lucide:database',
  logic: 'i-lucide:git-fork',
  workflow: 'i-lucide:network',
  human: 'i-lucide:user-round-check',
  integration: 'i-lucide:plug-zap',
}
const EDIT_BURST_MS = 400

const workflowTestCases: WorkflowTestCase[] = [
  {
    id: 'case-refund',
    title: '退款政策问答',
    description: '验证知识召回、模型回答和消息发送链路。',
    input: '用户询问企业版订阅退款规则，以及是否支持按月续费。',
    expected: '返回退款窗口、续费周期和需要联系的支持入口。',
    status: 'passed',
    duration: '1.8s',
  },
  {
    id: 'case-risk',
    title: '高风险请求拦截',
    description: '验证条件节点是否能把异常请求切到人工确认。',
    input: '用户要求导出全部客户手机号并发送到外部邮箱。',
    expected: '命中风险分支，阻止自动执行并输出审计提示。',
    status: 'warning',
    duration: '2.4s',
  },
  {
    id: 'case-tool',
    title: '插件工具调用',
    description: '验证插件节点失败时仍能生成降级答复。',
    input: '用户查询最近 7 天工单处理耗时，并要求生成摘要。',
    expected: '插件超时后使用缓存指标，日志记录 warning。',
    status: 'ready',
    duration: '-',
  },
]

const initialRunLogs: WorkflowRunLog[] = [
  {
    id: 'log-init-1',
    time: '10:24:08',
    level: 'info',
    nodeId: 'start',
    title: '输入触发',
    message: '测试输入已注入，准备执行工作流。',
  },
  {
    id: 'log-init-2',
    time: '10:24:09',
    level: 'success',
    nodeId: 'knowledge',
    title: '知识库检索',
    message: '召回 4 条企业版订阅政策片段，平均相关度 0.86。',
  },
  {
    id: 'log-init-3',
    time: '10:24:10',
    level: 'warning',
    nodeId: 'plugin',
    title: '外部插件',
    message: 'CRM 插件响应 920ms，已启用超时保护阈值。',
  },
]

const cloneSchema = (schema: WorkflowJsonSchema) =>
  JSON.parse(JSON.stringify(schema)) as WorkflowJsonSchema

const createNodeId = (kind: WorkflowNodeKind) =>
  `${kind}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

const getPaletteItem = (kind: WorkflowNodeKind) => {
  return workflowPalette.find((item) => item.kind === kind)
}

interface UseWorkflowDesignerOptions {
  initialTitle?: string
}

export function useWorkflowDesigner(options: UseWorkflowDesignerOptions = {}) {
  const { copy, isSupported } = useClipboard({ legacy: true })
  const {
    fitView,
    flowToScreenCoordinate,
    getSelectedNodes,
    getViewport,
    removeSelectedNodes,
    screenToFlowCoordinate,
    vueFlowRef,
  } = useVueFlow(WORKFLOW_FLOW_ID)
  const initialSchema = cloneSchema(initialWorkflowSchema)
  if (options.initialTitle) initialSchema.title = options.initialTitle
  const initialFlow = schemaToFlow(initialSchema)

  const selectedNodeId = shallowRef('')
  const isRunning = shallowRef(false)
  const nodesLocked = shallowRef(false)
  const sourcePanelOpen = shallowRef(false)
  const schemaError = shallowRef('')
  const sourceStatus = shallowRef<WorkflowSourceStatus>('synced')
  const selectedTestCaseId = shallowRef(workflowTestCases[0].id)
  const isPaused = shallowRef(false)
  const runLogs = shallowRef<WorkflowRunLog[]>(initialRunLogs)
  const workflowSchema = shallowRef<WorkflowJsonSchema>(initialSchema)
  const sourceCode = shallowRef(formatWorkflowSchema(initialSchema))
  const nodes = shallowRef<WorkflowNode[]>(initialFlow.nodes)
  const edges = shallowRef<WorkflowEdge[]>(initialFlow.edges)
  const contextMenu = shallowRef<WorkflowContextMenuState>({
    open: false,
    x: 0,
    y: 0,
  })
  const breakpoints = shallowRef(new Set<string>())
  const runtime = createWorkflowRuntime()
  let runGeneration = 0
  let editBurstTimer: number | null = null

  const {
    canRedo,
    canUndo,
    record: recordHistory,
    redo: redoWorkflow,
    undo: undoWorkflow,
  } = useWorkflowHistory({
    getSnapshot: getCurrentSchema,
    restoreSnapshot(schema) {
      syncFlowFromSchema(schema)
      // History restores workflow data only; it must not open the inspector.
      selectedNodeId.value = ''
      closeContextMenu()
    },
  })

  const defaultEdgeOptions: DefaultEdgeOptions = {
    type: 'custom',
    markerEnd: MarkerType.ArrowClosed,
  }

  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return undefined
    return nodes.value.find((item) => item.id === selectedNodeId.value)
  })

  const selectedNodeData = computed(() => selectedNode.value?.data)
  const selectedTestCase = computed(() => {
    return (
      workflowTestCases.find((item) => item.id === selectedTestCaseId.value) ??
      workflowTestCases[0]
    )
  })
  const validationIssues = computed(
    () => compileWorkflowSchema(getCurrentSchema()).validation.issues
  )
  const selectedNodesForAction = computed<WorkflowNode[]>(() => {
    const flowSelectedNodes = getSelectedNodes.value as WorkflowNode[]
    if (flowSelectedNodes.length) return flowSelectedNodes
    return selectedNode.value ? [selectedNode.value] : []
  })
  const canRemoveSelected = computed(
    () => selectedNodesForAction.value.length > 0
  )

  const contextActions = computed<WorkflowContextMenuAction[]>(() => {
    const { targetId, targetType } = contextMenu.value
    const targetNode =
      targetType === 'node'
        ? nodes.value.find((node) => node.id === targetId)
        : undefined
    const singletonNode = targetNode?.data.kind === 'start'

    if (targetType === 'edge') {
      return [
        {
          key: 'delete',
          label: '删除连线',
          icon: 'i-lucide:trash-2',
          danger: true,
        },
      ]
    }

    if (targetType === 'node') {
      return [
        {
          key: 'duplicate',
          label: '复制节点',
          icon: 'i-lucide:copy',
          disabled: singletonNode,
        },
        {
          key: 'add-after',
          label: '追加大模型',
          icon: 'i-lucide:plus',
          disabled: targetNode?.data.kind === 'end',
        },
        {
          key: 'add-condition',
          label: '追加条件分支',
          icon: 'i-lucide:git-fork',
          disabled: targetNode?.data.kind === 'end',
        },
        {
          key: 'run-from',
          label: '从此运行',
          icon: 'i-lucide:play',
        },
        {
          key: 'test-node',
          label: '单节点测试',
          icon: 'i-lucide:flask-conical',
        },
        {
          key: 'toggle-breakpoint',
          label:
            contextMenu.value.targetId &&
            breakpoints.value.has(contextMenu.value.targetId)
              ? '移除断点'
              : '设置断点',
          icon: 'i-lucide:circle-dot',
        },
        {
          key: 'export-node',
          label: '复制节点 JSON',
          icon: 'i-lucide:file-json',
        },
        {
          key: 'delete',
          label: '删除节点',
          icon: 'i-lucide:trash-2',
          danger: true,
        },
      ]
    }

    return [
      {
        key: 'add-node',
        label: '添加节点',
        icon: 'i-lucide:plus',
        children: PALETTE_GROUP_ORDER.flatMap(
          (group): WorkflowContextMenuAction[] => {
            const items = workflowPalette.filter((item) => item.group === group)
            if (!items.length) return []

            return [
              {
                key: `add-group-${group}`,
                label: workflowPaletteGroupLabels[group],
                icon: PALETTE_GROUP_ICONS[group],
                children: items.map((item) => ({
                  key: `add-${item.kind}` as WorkflowContextActionKey,
                  label: item.title,
                  icon: item.icon,
                })),
              },
            ]
          }
        ),
      },
    ]
  })

  function syncFlowFromSchema(schema: WorkflowJsonSchema) {
    const flow = schemaToFlow(schema)
    workflowSchema.value = cloneSchema(schema)
    nodes.value = flow.nodes
    edges.value = flow.edges
    sourceCode.value = formatWorkflowSchema(schema)
    schemaError.value = ''
    sourceStatus.value = 'synced'
  }

  function getCurrentSchema() {
    return flowToSchema(workflowSchema.value, nodes.value, edges.value)
  }

  function syncSchemaFromFlow(
    nextNodes = nodes.value,
    nextEdges = edges.value
  ) {
    const nextSchema = flowToSchema(workflowSchema.value, nextNodes, nextEdges)
    workflowSchema.value = nextSchema
    sourceCode.value = formatWorkflowSchema(nextSchema)
    schemaError.value = ''
    sourceStatus.value = 'synced'
  }

  function applySourceCode(
    value = sourceCode.value,
    shouldRecordHistory = true
  ) {
    try {
      const parsed = parseWorkflowSchema(value)
      const flow = schemaToFlow(parsed)
      if (shouldRecordHistory) recordHistory()
      workflowSchema.value = cloneSchema(parsed)
      sourceCode.value = value
      nodes.value = flow.nodes
      edges.value = flow.edges
      selectedNodeId.value = parsed.nodes.some(
        (item) => item.id === selectedNodeId.value
      )
        ? selectedNodeId.value
        : (parsed.nodes[0]?.id ?? '')
      schemaError.value = ''
      sourceStatus.value = 'synced'
      return true
    } catch (error) {
      schemaError.value =
        error instanceof Error ? error.message : 'JSONSchema 解析失败'
      sourceStatus.value = 'error'
      return false
    }
  }

  function handleSourceCodeChange(value: string) {
    sourceCode.value = value
    applySourceCode(value, false)
  }

  function formatSourceCode() {
    try {
      sourceCode.value = formatJsonSource(sourceCode.value)
      schemaError.value = ''
      sourceStatus.value = 'formatted'
    } catch (error) {
      schemaError.value =
        error instanceof Error
          ? 'JSON 格式错误：' + error.message
          : 'JSON 格式错误'
      sourceStatus.value = 'error'
    }
  }

  function exportSchema() {
    syncSchemaFromFlow()
    return formatWorkflowSchema(workflowSchema.value)
  }

  function copyWorkflowSchema() {
    copyText(exportSchema(), '工作流 JSONSchema 已复制')
  }

  function downloadWorkflowSchema() {
    const content = exportSchema()
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${workflowSchema.value.title || 'workflow'}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    message.success('工作流 JSONSchema 已导出')
  }

  async function shareWorkflow() {
    const shareUrl = window.location.href
    const shareData = {
      title: workflowSchema.value.title || '工作流',
      text: '查看工作流设计',
      url: shareUrl,
    }

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }

    copyText(shareUrl, '分享链接已复制')
  }

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) return

    const source = nodes.value.find((node) => node.id === connection.source)
    const target = nodes.value.find((node) => node.id === connection.target)
    const sourcePort = source?.data.outputs.find(
      (port) => port.id === connection.sourceHandle
    )
    const targetPort = target?.data.inputs.find(
      (port) => port.id === connection.targetHandle
    )
    if (!source || !target || !sourcePort || !targetPort) {
      message.warning('请选择有效的输入和输出端口')
      return
    }
    if (
      edges.value.some(
        (edge) =>
          edge.source === connection.source &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.target === connection.target &&
          edge.targetHandle === connection.targetHandle
      )
    ) {
      message.info('该端口已经连接')
      return
    }
    if (
      !targetPort.multiple &&
      edges.value.some(
        (edge) =>
          edge.target === connection.target &&
          edge.targetHandle === connection.targetHandle
      )
    ) {
      message.warning(`输入端口「${targetPort.name}」只允许一条连线`)
      return
    }
    const sourceSchema = getWorkflowNodeDefinition(
      source.data.kind
    )?.outputs.find((port) => port.id === sourcePort.id)?.schema
    const targetSchema = getWorkflowNodeDefinition(
      target.data.kind
    )?.inputs.find((port) => port.id === targetPort.id)?.schema
    if (
      !sourceSchema ||
      !targetSchema ||
      !areWorkflowDataSchemasCompatible(sourceSchema, targetSchema)
    ) {
      message.warning(
        `端口类型不兼容：${sourcePort.type} -> ${targetPort.type}`
      )
      return
    }

    recordHistory()
    const edge = createWorkflowEdge({
      id: `${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourcePort: connection.sourceHandle ?? undefined,
      targetPort: connection.targetHandle ?? undefined,
      kind:
        source.data.kind === 'if-else' || source.data.kind === 'switch'
          ? 'branch'
          : 'flow',
    })
    edges.value = [...edges.value, edge]
    const inputBinding = {
      kind: 'node-output' as const,
      nodeId: source.id,
      port: sourcePort.id,
    }
    patchNodeData(
      target.id,
      {
        inputBindings: {
          ...target.data.inputBindings,
          [targetPort.id]: inputBinding,
        },
      },
      false,
      false
    )
    syncSchemaFromFlow(nodes.value, edges.value)
  }

  function handleNodeClick(event: NodeMouseEvent) {
    selectedNodeId.value = event.node.id
    closeContextMenu()
  }

  function handleNodeDragStop(event: NodeDragEvent) {
    const draggedPositions = new Map(
      event.nodes.map((node) => [node.id, { ...node.position }])
    )
    nodes.value = nodes.value.map((item) =>
      draggedPositions.has(item.id)
        ? {
            ...item,
            position: draggedPositions.get(item.id) ?? item.position,
          }
        : item
    )
    syncSchemaFromFlow()
  }

  function handleNodeDragStart() {
    recordHistory()
  }

  function addNode(
    item: WorkflowPaletteItem,
    position = getDefaultNodePosition()
  ) {
    if (
      item.kind === 'start' &&
      nodes.value.some((node) => node.data.kind === 'start')
    ) {
      message.warning('工作流只能包含一个开始节点')
      return ''
    }
    const id = createNodeId(item.kind)
    const schemaNode = createSchemaNodeFromPalette(item, id)
    const nextSchema = flowToSchema(
      workflowSchema.value,
      nodes.value,
      edges.value
    )

    recordHistory()
    syncFlowFromSchema({
      ...nextSchema,
      entrypoint: item.kind === 'start' ? id : nextSchema.entrypoint,
      nodes: [...nextSchema.nodes, schemaNode],
      ui: {
        ...nextSchema.ui,
        nodes: {
          ...nextSchema.ui?.nodes,
          [id]: { position: { ...position } },
        },
      },
    })
    selectedNodeId.value = ''
    return id
  }

  function arrangeNodes() {
    if (nodes.value.length < 2) return

    const nodeIds = new Set(nodes.value.map((node) => node.id))
    const incomingCount = new Map(nodes.value.map((node) => [node.id, 0]))
    const targetsBySource = new Map<string, string[]>()

    edges.value.forEach((edge) => {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return
      incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
      targetsBySource.set(edge.source, [
        ...(targetsBySource.get(edge.source) ?? []),
        edge.target,
      ])
    })

    const queue = nodes.value
      .filter((node) => incomingCount.get(node.id) === 0)
      .map((node) => node.id)
    const levelById = new Map(queue.map((id) => [id, 0]))

    while (queue.length) {
      const sourceId = queue.shift()
      if (!sourceId) continue
      const sourceLevel = levelById.get(sourceId) ?? 0

      ;(targetsBySource.get(sourceId) ?? []).forEach((targetId) => {
        levelById.set(
          targetId,
          Math.max(levelById.get(targetId) ?? 0, sourceLevel + 1)
        )
        const nextIncoming = (incomingCount.get(targetId) ?? 1) - 1
        incomingCount.set(targetId, nextIncoming)
        if (nextIncoming === 0) queue.push(targetId)
      })
    }

    const maxLevel = Math.max(...levelById.values(), 0)
    nodes.value.forEach((node) => {
      if (!levelById.has(node.id)) levelById.set(node.id, maxLevel + 1)
    })

    const nodesByLevel = new Map<number, WorkflowNode[]>()
    nodes.value.forEach((node) => {
      const level = levelById.get(node.id) ?? 0
      nodesByLevel.set(level, [...(nodesByLevel.get(level) ?? []), node])
    })

    const positions = new Map<string, XYPosition>()
    nodesByLevel.forEach((levelNodes, level) => {
      levelNodes
        .sort((a, b) => a.position.y - b.position.y)
        .forEach((node, index) => {
          positions.set(node.id, {
            x: 80 + level * 360,
            y: 80 + index * 250,
          })
        })
    })

    recordHistory()
    nodes.value = nodes.value.map((node) => ({
      ...node,
      position: positions.get(node.id) ?? node.position,
    }))
    syncSchemaFromFlow()
    nextTick(() => fitView())
  }

  function updateSelectedData(key: WorkflowEditableField, value: string) {
    const id = selectedNodeId.value
    if (!id) return

    patchNodeData(id, { [key]: value }, !editBurstTimer, false)
    scheduleEditBurstSchemaSync()
  }

  function updateSelectedConfig(key: string, value: unknown) {
    const node = selectedNode.value
    if (!node || !isJsonValue(value)) return

    patchNodeData(
      node.id,
      {
        model:
          key === 'model' && typeof value === 'string'
            ? value
            : node.data.model,
        config: {
          ...node.data.config,
          [key]: value,
        },
      },
      !editBurstTimer,
      false
    )
    scheduleEditBurstSchemaSync()
  }

  function scheduleEditBurstSchemaSync() {
    if (editBurstTimer) window.clearTimeout(editBurstTimer)
    editBurstTimer = window.setTimeout(() => {
      editBurstTimer = null
      syncSchemaFromFlow()
    }, EDIT_BURST_MS)
  }

  function patchNodeData(
    id: string,
    update: Partial<WorkflowNodeData>,
    recordChange = true,
    syncSchema = true
  ) {
    if (recordChange) {
      recordHistory()
    }
    nodes.value = nodes.value.map((node) => {
      if (node.id !== id) return node
      return {
        ...node,
        data: {
          ...node.data,
          ...update,
        },
      }
    })
    if (syncSchema) syncSchemaFromFlow()
  }

  function removeSelectedNode() {
    const removableIds = selectedNodesForAction.value.map((node) => node.id)

    removeNodes(removableIds)
  }

  function removeNode(id: string) {
    const node = nodes.value.find((item) => item.id === id)
    if (!node) return

    removeNodes([id])
  }

  function removeNodes(ids: string[]) {
    if (!ids.length) return

    recordHistory()
    const idSet = new Set(ids)
    const removesEntrypoint = idSet.has(workflowSchema.value.entrypoint)
    nodes.value = nodes.value.filter((item) => !idSet.has(item.id))
    edges.value = edges.value.filter((item) => {
      return !idSet.has(item.source) && !idSet.has(item.target)
    })
    nodes.value = nodes.value.map((node) => ({
      ...node,
      data: {
        ...node.data,
        inputBindings: Object.fromEntries(
          Object.entries(node.data.inputBindings).filter(
            ([, binding]) =>
              binding.kind !== 'node-output' || !idSet.has(binding.nodeId)
          )
        ),
      },
    }))
    if (idSet.has(selectedNodeId.value)) {
      selectedNodeId.value = ''
    }
    if (removesEntrypoint) {
      workflowSchema.value = {
        ...workflowSchema.value,
        entrypoint:
          nodes.value.find((node) => node.data.kind === 'start')?.id ?? '',
      }
    }
    closeContextMenu()
    syncSchemaFromFlow()
  }

  function removeEdge(id: string) {
    const removedEdge = edges.value.find((item) => item.id === id)
    if (!removedEdge) return
    recordHistory()
    edges.value = edges.value.filter((item) => item.id !== id)
    nodes.value = nodes.value.map((node) => {
      const binding = removedEdge.targetHandle
        ? node.data.inputBindings[removedEdge.targetHandle]
        : undefined
      if (
        node.id !== removedEdge.target ||
        !removedEdge.targetHandle ||
        !binding
      )
        return node
      if (
        binding.kind !== 'node-output' ||
        binding.nodeId !== removedEdge.source ||
        binding.port !== removedEdge.sourceHandle
      )
        return node
      const bindings = { ...node.data.inputBindings }
      delete bindings[removedEdge.targetHandle]
      return {
        ...node,
        data: { ...node.data, inputBindings: bindings },
      }
    })
    closeContextMenu()
    syncSchemaFromFlow()
  }

  function duplicateNode(id: string) {
    const source = nodes.value.find((item) => item.id === id)
    if (!source) return
    if (source.data.kind === 'start') {
      message.warning('开始节点不可复制')
      return
    }

    const nextId = createNodeId(source.data.kind)
    const currentSchema = flowToSchema(
      workflowSchema.value,
      nodes.value,
      edges.value
    )
    const schemaNode = {
      id: nextId,
      type: source.data.kind,
      version: source.data.nodeVersion,
      name: `${source.data.title} 副本`,
      description: source.data.description,
      config: source.data.config,
      inputBindings: source.data.inputBindings,
      next: [],
      prev: [],
    }

    const { zoom } = getViewport()
    const sourceScreenPosition = flowToScreenCoordinate(source.position)
    const position = getNodePositionAtScreenPoint(
      sourceScreenPosition.x + 80 * zoom + (292 * zoom) / 2,
      sourceScreenPosition.y + 80 * zoom + (260 * zoom) / 2
    )

    recordHistory()
    syncFlowFromSchema({
      ...currentSchema,
      nodes: [...currentSchema.nodes, schemaNode],
      ui: {
        ...currentSchema.ui,
        nodes: {
          ...currentSchema.ui?.nodes,
          [nextId]: {
            position,
          },
        },
      },
    })
    selectedNodeId.value = ''
    closeContextMenu()
  }

  function appendNodeAfter(id: string, kind: WorkflowNodeKind = 'llm') {
    const source = nodes.value.find((item) => item.id === id)
    const item = getPaletteItem(kind)
    if (!source || !item) return

    const { zoom } = getViewport()
    const sourceScreenPosition = flowToScreenCoordinate(source.position)
    const nodeWidth = 292 * zoom
    const nodeHeight = 260 * zoom

    const nextNodeId = addNode(item, {
      ...getNodePositionAtScreenPoint(
        sourceScreenPosition.x + nodeWidth + 32 + nodeWidth / 2,
        sourceScreenPosition.y +
          nodeHeight / 2 +
          (kind === 'condition' ? NODE_SPACING_Y * zoom : 0)
      ),
    })
    const nextNode = nodes.value.find((node) => node.id === nextNodeId)
    const sourcePort = source.data.outputs[0]?.id
    const targetPort = nextNode?.data.inputs[0]?.id
    if (!sourcePort || !targetPort) return

    edges.value = [
      ...edges.value,
      createWorkflowEdge({
        id: `${source.id}-${nextNodeId}-${Date.now()}`,
        source: source.id,
        target: nextNodeId,
        sourcePort,
        targetPort,
        kind: source.data.kind === 'if-else' ? 'branch' : 'flow',
      }),
    ]
    patchNodeData(
      nextNodeId,
      {
        inputBindings: {
          ...nextNode?.data.inputBindings,
          [targetPort]: {
            kind: 'node-output',
            nodeId: source.id,
            port: sourcePort,
          },
        },
      },
      false,
      false
    )
    syncSchemaFromFlow()
  }

  function toggleNodesLocked() {
    nodesLocked.value = !nodesLocked.value
  }

  function toggleSourcePanel() {
    sourcePanelOpen.value = !sourcePanelOpen.value
  }

  function closeSourcePanel() {
    sourcePanelOpen.value = false
  }

  function clearSelectedNode() {
    selectedNodeId.value = ''
    removeSelectedNodes(getSelectedNodes.value)
    closeContextMenu()
  }

  function openNodeContextMenu(event: NodeMouseEvent) {
    event.event.preventDefault()
    const position = getClientPosition(event.event)
    showContextMenu({
      x: position.x,
      y: position.y,
      flowPosition: getNodePositionAtScreenPoint(position.x, position.y),
      targetId: event.node.id,
      targetType: 'node',
    })
  }

  function openEdgeContextMenu(event: EdgeMouseEvent) {
    event.event.preventDefault()
    const position = getClientPosition(event.event)
    showContextMenu({
      x: position.x,
      y: position.y,
      targetId: event.edge.id,
      targetType: 'edge',
    })
  }

  function openPaneContextMenu(event: MouseEvent) {
    event.preventDefault()
    showContextMenu({
      x: event.clientX,
      y: event.clientY,
      flowPosition: getNodePositionAtScreenPoint(event.clientX, event.clientY),
      targetType: 'pane',
    })
  }

  function showContextMenu(menu: Omit<WorkflowContextMenuState, 'open'>) {
    contextMenu.value = { ...menu, open: false }
    nextTick(() => {
      contextMenu.value = { ...menu, open: true }
    })
  }

  function closeContextMenu() {
    contextMenu.value = {
      ...contextMenu.value,
      open: false,
    }
  }

  function handleContextAction(action: WorkflowContextActionKey) {
    const { flowPosition, targetId, targetType } = contextMenu.value

    if (action === 'delete') {
      if (targetType === 'edge' && targetId) removeEdge(targetId)
      if (targetType === 'node' && targetId) removeNode(targetId)
      return
    }

    if (action === 'duplicate' && targetId) {
      duplicateNode(targetId)
      return
    }

    if (action === 'export-node' && targetId) {
      copyNodeSchema(targetId)
      closeContextMenu()
      return
    }

    if (action === 'run-from' && targetId) {
      runWorkflow(targetId)
      closeContextMenu()
      return
    }

    if (action === 'test-node' && targetId) {
      testNode(targetId)
      closeContextMenu()
      return
    }

    if (action === 'toggle-breakpoint' && targetId) {
      toggleBreakpoint(targetId)
      closeContextMenu()
      return
    }

    if (action === 'add-after' && targetId) {
      appendNodeAfter(targetId, 'llm')
      closeContextMenu()
      return
    }

    if (action === 'add-condition' && targetId) {
      appendNodeAfter(targetId, 'condition')
      closeContextMenu()
      return
    }

    const kind = action.startsWith('add-')
      ? (action.slice(4) as WorkflowNodeKind)
      : undefined
    const item = kind ? getPaletteItem(kind) : undefined
    if (item) {
      addNode(item, flowPosition ?? getDefaultNodePosition())
    }
    closeContextMenu()
  }

  function selectTestCase(id: string) {
    selectedTestCaseId.value = id
  }

  async function runWorkflow(
    startId = workflowSchema.value.entrypoint,
    onlyNodeId?: string
  ) {
    if (isRunning.value) return

    const schema = getCurrentSchema()
    const plan = compileWorkflowSchema(schema)
    const firstError = plan.validation.issues.find(
      (item) => item.severity === 'error'
    )
    if (firstError) {
      schemaError.value = firstError.message
      appendRunLog({
        level: 'error',
        nodeId: firstError.nodeId ?? startId,
        title: '校验失败',
        message: `${firstError.message} ${firstError.suggestion ?? ''}`.trim(),
      })
      return
    }

    const generation = ++runGeneration
    isRunning.value = true
    isPaused.value = false
    schemaError.value = ''
    nodes.value = nodes.value.map((node) => ({
      ...node,
      data: { ...node.data, status: 'idle' },
    }))
    appendRunLog({
      level: 'info',
      nodeId: onlyNodeId ?? startId,
      title: onlyNodeId ? '单节点测试' : selectedTestCase.value.title,
      message: `开始执行：${selectedTestCase.value.input}`,
      input: selectedTestCase.value.input,
    })

    const result = await runtime.execute(plan, selectedTestCase.value.input, {
      startNodeId: startId,
      onlyNodeId,
      breakpoints: breakpoints.value,
      onEvent(event) {
        if (event.nodeId) {
          const status =
            event.type === 'node-started'
              ? 'running'
              : event.type === 'node-paused'
                ? 'paused'
                : event.type === 'node-completed'
                  ? 'success'
                  : event.type === 'node-failed'
                    ? 'failed'
                    : event.type === 'node-skipped'
                      ? 'skipped'
                      : undefined
          if (status) patchNodeData(event.nodeId, { status }, false, false)
          if (event.type === 'node-paused') isPaused.value = true
          if (event.type === 'node-started') isPaused.value = false
        }
        if (event.type.startsWith('node-') || event.type === 'run-failed') {
          appendRunLog({
            level: event.level === 'debug' ? 'info' : event.level,
            nodeId: event.nodeId ?? onlyNodeId ?? startId,
            title: event.nodeId ? getNodeTitle(event.nodeId) : '运行状态',
            message: event.message,
            input: event.execution?.input,
            output: event.execution?.output,
            durationMs: event.execution?.durationMs,
          })
        }
      },
    })
    if (generation !== runGeneration) return
    isRunning.value = false
    isPaused.value = false
    if (result.status === 'success') {
      appendRunLog({
        level: 'success',
        nodeId: onlyNodeId ?? startId,
        title: onlyNodeId ? '单节点测试完成' : '工作流执行完成',
        message: '执行计划已完成，输出已写入运行记录。',
        output: result.output,
        durationMs: result.durationMs,
      })
    }
  }

  function testNode(id: string) {
    runWorkflow(id, id)
  }

  function cancelWorkflow() {
    if (!isRunning.value) return
    runGeneration += 1
    isPaused.value = false
    runtime.resume()
    runtime.cancel()
    isRunning.value = false
    appendRunLog({
      level: 'warning',
      nodeId: selectedNodeId.value || 'start',
      title: '已取消执行',
      message: '本次运行已被用户取消。',
    })
  }

  function resumeWorkflow() {
    if (!isRunning.value || !isPaused.value) return
    isPaused.value = false
    runtime.resume()
  }

  function publishWorkflow() {
    const schema = getCurrentSchema()
    const plan = compileWorkflowSchema(schema)
    const firstError = plan.validation.issues.find(
      (item) => item.severity === 'error'
    )
    if (firstError) {
      schemaError.value = firstError.message
      message.error(`发布失败：${firstError.message}`)
      return false
    }
    const [major = 1, minor = 0, patch = 0] = schema.version
      .split('.')
      .map(Number)
    const nextVersion = `${Number.isFinite(major) ? major : 1}.${Number.isFinite(minor) ? minor : 0}.${Number.isFinite(patch) ? patch + 1 : 1}`
    const publishedAt = new Date().toISOString()
    workflowSchema.value = {
      ...schema,
      version: nextVersion,
      revision: schema.revision + 1,
      status: 'published',
      metadata: { ...schema.metadata, updatedAt: publishedAt, publishedAt },
    }
    sourceCode.value = formatWorkflowSchema(workflowSchema.value)
    schemaError.value = ''
    message.success(`已发布 v${nextVersion}`)
    return true
  }

  function toggleBreakpoint(id: string) {
    const next = new Set(breakpoints.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    breakpoints.value = next
    nodes.value = nodes.value.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, breakpoint: next.has(id) } }
        : node
    )
  }

  function appendRunLog(entry: Omit<WorkflowRunLog, 'id' | 'time'>) {
    runLogs.value = [
      {
        id: `log-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        time: formatLogTime(),
        ...entry,
      },
      ...runLogs.value,
    ].slice(0, 24)
  }

  function getNodeTitle(id: string) {
    return nodes.value.find((node) => node.id === id)?.data.title ?? id
  }

  function formatLogTime(date = new Date()) {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  function getDefaultNodePosition(): XYPosition {
    const canvas = vueFlowRef.value?.getBoundingClientRect()
    const x = (canvas?.left ?? 0) + (canvas?.width ?? 720) / 2
    const y = (canvas?.top ?? 0) + (canvas?.height ?? 520) / 2
    return getNodePositionAtScreenPoint(x, y)
  }

  function getNodePositionAtScreenPoint(x: number, y: number): XYPosition {
    const canvas = vueFlowRef.value?.getBoundingClientRect()
    const zoom = Math.max(getViewport().zoom, 0.01)
    const nodeWidth = 292
    const nodeHeight = 260
    const nodeScreenWidth = nodeWidth * zoom
    const nodeScreenHeight = nodeHeight * zoom
    const canvasLeft = canvas?.left ?? 0
    const canvasTop = canvas?.top ?? 0
    const canvasRight = canvas?.right ?? canvasLeft + 720
    const canvasBottom = canvas?.bottom ?? canvasTop + 520
    const minCenterX = canvasLeft + 16 + nodeScreenWidth / 2
    const minCenterY = canvasTop + 16 + nodeScreenHeight / 2
    const maxCenterX = Math.max(
      minCenterX,
      canvasRight - 16 - nodeScreenWidth / 2
    )
    const maxCenterY = Math.max(
      minCenterY,
      canvasBottom - 16 - nodeScreenHeight / 2
    )
    const center = screenToFlowCoordinate({
      x: Math.min(Math.max(x, minCenterX), maxCenterX),
      y: Math.min(Math.max(y, minCenterY), maxCenterY),
    })
    return {
      x: center.x - nodeWidth / 2,
      y: center.y - nodeHeight / 2,
    }
  }

  function getClientPosition(event: MouseTouchEvent): XYPosition {
    if ('touches' in event) {
      const touch = event.touches[0] ?? event.changedTouches[0]
      return {
        x: touch?.clientX ?? 0,
        y: touch?.clientY ?? 0,
      }
    }

    return {
      x: event.clientX,
      y: event.clientY,
    }
  }

  function copyNodeSchema(id: string) {
    const schema = flowToSchema(workflowSchema.value, nodes.value, edges.value)
    const node = schema.nodes.find((item) => item.id === id)
    if (!node) return

    copyText(JSON.stringify(node, null, 2), '节点 JSON 已复制')
  }

  function copyText(text: string, successText: string) {
    if (!isSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }

    copy(text).then(() => {
      message.success(successText)
    })
  }

  function handleKeydown(event: KeyboardEvent) {
    if (
      event.target instanceof Element &&
      event.target.closest('input, textarea, select, [contenteditable="true"]')
    ) {
      return
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (!canRemoveSelected.value) return
      event.preventDefault()
      removeSelectedNode()
      return
    }

    if (!(event.ctrlKey || event.metaKey)) return

    if (event.key.toLowerCase() === 'z') {
      event.preventDefault()
      if (event.shiftKey) redoWorkflow()
      else undoWorkflow()
    } else if (event.key.toLowerCase() === 'y') {
      event.preventDefault()
      redoWorkflow()
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => runtime.cancel())
  onBeforeUnmount(() => {
    if (editBurstTimer) window.clearTimeout(editBurstTimer)
  })

  return {
    contextActions,
    contextMenu,
    canRedo,
    canRemoveSelected,
    canUndo,
    defaultEdgeOptions,
    edges,
    fitView,
    isRunning,
    isPaused,
    breakpoints,
    nodes,
    nodesLocked,
    schemaError,
    sourceStatus,
    runLogs,
    validationIssues,
    selectedTestCase,
    selectedTestCaseId,
    selectedNodeData,
    selectedNodeId,
    sourceCode,
    sourcePanelOpen,
    testCases: workflowTestCases,
    workflowSchema,
    addNode,
    arrangeNodes,
    applySourceCode,
    clearSelectedNode,
    closeContextMenu,
    closeSourcePanel,
    copyWorkflowSchema,
    downloadWorkflowSchema,
    duplicateNode,
    exportSchema,
    formatSourceCode,
    handleConnect,
    handleContextAction,
    handleNodeClick,
    handleNodeDragStart,
    handleNodeDragStop,
    handleSourceCodeChange,
    openEdgeContextMenu,
    openNodeContextMenu,
    openPaneContextMenu,
    removeSelectedNode,
    runWorkflow,
    resumeWorkflow,
    testNode,
    cancelWorkflow,
    publishWorkflow,
    shareWorkflow,
    selectTestCase,
    toggleNodesLocked,
    toggleBreakpoint,
    toggleSourcePanel,
    updateSelectedConfig,
    updateSelectedData,
    undoWorkflow,
    redoWorkflow,
  }
}
