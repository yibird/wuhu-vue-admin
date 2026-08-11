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
import {
  createSchemaNodeFromPalette,
  createWorkflowEdge,
  flowToSchema,
  formatWorkflowSchema,
  initialWorkflowSchema,
  parseWorkflowSchema,
  schemaToFlow,
  workflowPalette,
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
  WorkflowPaletteItem,
  WorkflowRunLog,
  WorkflowTestCase,
} from '../types'

const WORKFLOW_RUN_SEQUENCE = [
  'start',
  'knowledge',
  'llm',
  'condition',
  'plugin',
  'message',
  'end',
]

const NODE_SPACING_X = 340
const NODE_SPACING_Y = 92

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
    getSelectedNodes,
    project,
    removeSelectedNodes,
    zoomIn,
    zoomOut,
  } = useVueFlow()
  const initialSchema = cloneSchema(initialWorkflowSchema)
  if (options.initialTitle) initialSchema.title = options.initialTitle
  const initialFlow = schemaToFlow(initialSchema)

  const selectedNodeId = shallowRef('')
  const isRunning = shallowRef(false)
  const nodesLocked = shallowRef(false)
  const sourcePanelOpen = shallowRef(false)
  const schemaError = shallowRef('')
  const selectedTestCaseId = shallowRef(workflowTestCases[0].id)
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
  const runTimers: ReturnType<typeof setTimeout>[] = []

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
      selectedNodeId.value = schema.nodes.some(
        (item) => item.id === selectedNodeId.value
      )
        ? selectedNodeId.value
        : (schema.nodes[0]?.id ?? '')
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
  const selectedNodesForAction = computed<WorkflowNode[]>(() => {
    const flowSelectedNodes = getSelectedNodes.value as WorkflowNode[]
    if (flowSelectedNodes.length) return flowSelectedNodes
    return selectedNode.value ? [selectedNode.value] : []
  })
  const canRemoveSelected = computed(() =>
    selectedNodesForAction.value.some(isRemovableNode)
  )

  const contextActions = computed<WorkflowContextMenuAction[]>(() => {
    const { targetType } = contextMenu.value
    const targetNode = targetType === 'node' ? selectedNode.value : undefined
    const protectedNode =
      targetNode?.data.kind === 'start' || targetNode?.data.kind === 'end'

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
          key: 'export-node',
          label: '复制节点 JSON',
          icon: 'i-lucide:file-json',
        },
        {
          key: 'delete',
          label: '删除节点',
          icon: 'i-lucide:trash-2',
          danger: true,
          disabled: protectedNode,
        },
      ]
    }

    return [
      {
        key: 'add-node',
        label: '添加节点',
        icon: 'i-lucide:plus',
        children: workflowPalette.map((item) => ({
          key: `add-${item.kind}` as WorkflowContextActionKey,
          label: item.title,
          icon: item.icon,
        })),
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
      return true
    } catch (error) {
      schemaError.value =
        error instanceof Error ? error.message : 'JSONSchema 解析失败'
      return false
    }
  }

  function handleSourceCodeChange(value: string) {
    sourceCode.value = value
    applySourceCode(value, false)
  }

  function formatSourceCode() {
    if (!applySourceCode(sourceCode.value, false)) return
    sourceCode.value = formatWorkflowSchema(workflowSchema.value)
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

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) return

    recordHistory()
    const edge = createWorkflowEdge({
      id: `${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
    })
    edges.value = [...edges.value, edge]
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
    const id = createNodeId(item.kind)
    const schemaNode = createSchemaNodeFromPalette(item, id, position)
    const nextSchema = flowToSchema(
      workflowSchema.value,
      nodes.value,
      edges.value
    )

    recordHistory()
    syncFlowFromSchema({
      ...nextSchema,
      nodes: [...nextSchema.nodes, schemaNode],
    })
    selectedNodeId.value = id
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

    patchNodeData(id, { [key]: value })
  }

  function updateSelectedConfig(key: string, value: unknown) {
    const node = selectedNode.value
    if (!node) return

    patchNodeData(node.id, {
      config: {
        ...node.data.config,
        [key]: value,
      },
    })
  }

  function patchNodeData(
    id: string,
    update: Partial<WorkflowNodeData>,
    recordChange = true
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
    syncSchemaFromFlow()
  }

  function removeSelectedNode() {
    const removableIds = selectedNodesForAction.value
      .filter(isRemovableNode)
      .map((node) => node.id)

    removeNodes(removableIds)
  }

  function removeNode(id: string) {
    const node = nodes.value.find((item) => item.id === id)
    if (!node || !isRemovableNode(node)) return

    removeNodes([id])
  }

  function removeNodes(ids: string[]) {
    if (!ids.length) return

    recordHistory()
    const idSet = new Set(ids)
    nodes.value = nodes.value.filter((item) => !idSet.has(item.id))
    edges.value = edges.value.filter((item) => {
      return !idSet.has(item.source) && !idSet.has(item.target)
    })
    if (idSet.has(selectedNodeId.value)) {
      selectedNodeId.value = ''
    }
    closeContextMenu()
    syncSchemaFromFlow()
  }

  function isRemovableNode(node: WorkflowNode) {
    return node.data.kind !== 'start' && node.data.kind !== 'end'
  }

  function removeEdge(id: string) {
    recordHistory()
    edges.value = edges.value.filter((item) => item.id !== id)
    closeContextMenu()
    syncSchemaFromFlow()
  }

  function duplicateNode(id: string) {
    const source = nodes.value.find((item) => item.id === id)
    if (!source) return

    const nextId = createNodeId(source.data.kind)
    const currentSchema = flowToSchema(
      workflowSchema.value,
      nodes.value,
      edges.value
    )
    const schemaNode = {
      id: nextId,
      type: source.data.kind,
      title: `${source.data.title} 副本`,
      description: source.data.description,
      position: {
        x: source.position.x + 80,
        y: source.position.y + 80,
      },
      status: 'idle' as const,
      model: source.data.model,
      latency: source.data.latency,
      tokens: source.data.tokens,
      icon: source.data.icon,
      accent: source.data.accent,
      config: source.data.config,
      inputs: source.data.inputs,
      outputs: source.data.outputs,
    }

    recordHistory()
    syncFlowFromSchema({
      ...currentSchema,
      nodes: [...currentSchema.nodes, schemaNode],
    })
    selectedNodeId.value = nextId
    closeContextMenu()
  }

  function appendNodeAfter(id: string, kind: WorkflowNodeKind = 'llm') {
    const source = nodes.value.find((item) => item.id === id)
    const item = getPaletteItem(kind)
    if (!source || !item) return

    const nextNodeId = addNode(item, {
      x: source.position.x + NODE_SPACING_X,
      y: source.position.y + (kind === 'condition' ? NODE_SPACING_Y : 0),
    })

    edges.value = [
      ...edges.value,
      createWorkflowEdge({
        id: `${source.id}-${nextNodeId}-${Date.now()}`,
        source: source.id,
        target: nextNodeId,
      }),
    ]
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
    selectedNodeId.value = event.node.id
    showContextMenu({
      x: position.x,
      y: position.y,
      flowPosition: event.node.position,
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
      flowPosition: project({ x: event.clientX, y: event.clientY }),
      targetType: 'pane',
    })
  }

  function showContextMenu(menu: Omit<WorkflowContextMenuState, 'open'>) {
    contextMenu.value = { ...menu, open: false }
    void nextTick(() => {
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

  function runWorkflow(startId = WORKFLOW_RUN_SEQUENCE[0]) {
    if (isRunning.value) return

    const sequence = WORKFLOW_RUN_SEQUENCE.filter((id) =>
      nodes.value.some((node) => node.id === id)
    )
    const startIndex = Math.max(0, sequence.indexOf(startId))
    const runSequence = sequence.slice(startIndex)

    isRunning.value = true
    clearRunTimers()
    appendRunLog({
      level: 'info',
      nodeId: startId,
      title: selectedTestCase.value.title,
      message: `开始执行测试：${selectedTestCase.value.input}`,
    })
    nodes.value = nodes.value.map((node) => ({
      ...node,
      data: { ...node.data, status: 'idle' },
    }))
    syncSchemaFromFlow()

    runSequence.forEach((id, index) => {
      runTimers.push(
        setTimeout(() => {
          patchNodeData(id, { status: 'running' }, false)
          appendRunLog({
            level: 'info',
            nodeId: id,
            title: getNodeTitle(id),
            message: '节点开始执行，等待输入参数校验。',
          })
        }, index * 550)
      )
      runTimers.push(
        setTimeout(
          () => {
            const level = id === 'plugin' ? 'warning' : 'success'
            patchNodeData(
              id,
              {
                status: level,
              },
              false
            )
            appendRunLog({
              level,
              nodeId: id,
              title: getNodeTitle(id),
              message:
                level === 'warning'
                  ? '插件响应接近阈值，已使用降级路径继续执行。'
                  : '节点执行完成，输出已传递到下一步。',
            })
            if (index === runSequence.length - 1) {
              isRunning.value = false
              appendRunLog({
                level: 'success',
                nodeId: id,
                title: '测试完成',
                message: `实际输出符合预期：${selectedTestCase.value.expected}`,
              })
            }
          },
          index * 550 + 420
        )
      )
    })
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
    const offset = nodes.value.length * 34
    return {
      x: 420 + offset,
      y: 420 + offset,
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

  function clearRunTimers() {
    while (runTimers.length) {
      const timer = runTimers.pop()
      if (timer) clearTimeout(timer)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!(event.ctrlKey || event.metaKey)) return
    if (
      event.target instanceof Element &&
      event.target.closest('input, textarea, select, [contenteditable="true"]')
    ) {
      return
    }

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
  onBeforeUnmount(clearRunTimers)

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
    nodes,
    nodesLocked,
    schemaError,
    runLogs,
    selectedTestCase,
    selectedTestCaseId,
    selectedNodeData,
    selectedNodeId,
    sourceCode,
    sourcePanelOpen,
    testCases: workflowTestCases,
    workflowSchema,
    zoomIn,
    zoomOut,
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
    selectTestCase,
    toggleNodesLocked,
    toggleSourcePanel,
    updateSelectedConfig,
    updateSelectedData,
    undoWorkflow,
    redoWorkflow,
  }
}
