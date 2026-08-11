import { MarkerType, Position, type XYPosition } from '@vue-flow/core'
import type {
  WorkflowEdge,
  WorkflowJsonSchema,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeKind,
  WorkflowPaletteGroup,
  WorkflowPaletteItem,
  WorkflowSchemaEdge,
  WorkflowSchemaNode,
} from './types'

type WorkflowNodeBaseConfig = Pick<
  WorkflowNodeData,
  'accent' | 'config' | 'description' | 'icon' | 'inputs' | 'outputs' | 'title'
>

export const workflowNodeKinds: WorkflowNodeKind[] = [
  'start',
  'llm',
  'agent',
  'knowledge',
  'condition',
  'code',
  'plugin',
  'http',
  'database',
  'variable',
  'loop',
  'delay',
  'approval',
  'parallel',
  'subflow',
  'webhook',
  'message',
  'end',
]

export const workflowPaletteGroupLabels: Record<WorkflowPaletteGroup, string> =
  {
    control: '流程控制',
    data: '数据处理',
    model: '模型智能',
    tool: '工具集成',
  }

const nodeBaseConfig: Record<WorkflowNodeKind, WorkflowNodeBaseConfig> = {
  start: {
    title: '开始',
    description: '接收用户输入、渠道信息和会话上下文。',
    icon: 'i-lucide:play-circle',
    accent: '#2563eb',
    config: { trigger: 'chat_message' },
    inputs: [],
    outputs: [
      { name: 'query', type: 'String' },
      { name: 'session_id', type: 'String' },
    ],
  },
  llm: {
    title: '大模型',
    description: '生成、改写、分类或抽取结构化内容。',
    icon: 'i-lucide:sparkles',
    accent: '#4f46e5',
    config: { temperature: 0.7, max_tokens: 2048 },
    inputs: [{ name: 'prompt', type: 'String' }],
    outputs: [{ name: 'answer', type: 'String' }],
  },
  agent: {
    title: 'Agent',
    description: '自主规划任务，调用工具并汇总结果。',
    icon: 'i-lucide:bot',
    accent: '#7c3aed',
    config: { max_steps: 6, strategy: 'plan-and-execute' },
    inputs: [{ name: 'task', type: 'String' }],
    outputs: [{ name: 'result', type: 'Object' }],
  },
  knowledge: {
    title: '知识库',
    description: '从文档集合中召回上下文片段。',
    icon: 'i-lucide:book-open-text',
    accent: '#0891b2',
    config: { top_k: 5, rerank: true },
    inputs: [{ name: 'query', type: 'String' }],
    outputs: [{ name: 'chunks', type: 'Array<Document>' }],
  },
  condition: {
    title: '条件分支',
    description: '按规则把请求分流到不同路径。',
    icon: 'i-lucide:git-fork',
    accent: '#d97706',
    config: { expression: 'score >= 0.8' },
    inputs: [{ name: 'input', type: 'Any' }],
    outputs: [
      { name: 'true', type: 'Boolean' },
      { name: 'false', type: 'Boolean' },
    ],
  },
  code: {
    title: '代码',
    description: '用脚本处理变量、转换数据格式。',
    icon: 'i-lucide:code-2',
    accent: '#059669',
    config: { language: 'javascript' },
    inputs: [{ name: 'payload', type: 'Object' }],
    outputs: [{ name: 'payload', type: 'Object' }],
  },
  plugin: {
    title: '插件工具',
    description: '调用外部 API、数据库或业务系统。',
    icon: 'i-lucide:puzzle',
    accent: '#dc2626',
    config: { plugin_id: 'ticket.create' },
    inputs: [{ name: 'input', type: 'Any' }],
    outputs: [{ name: 'output', type: 'Any' }],
  },
  http: {
    title: 'HTTP 请求',
    description: '请求外部接口并解析响应。',
    icon: 'i-lucide:send',
    accent: '#0284c7',
    config: { method: 'POST', timeout: 8000 },
    inputs: [{ name: 'request', type: 'Object' }],
    outputs: [{ name: 'response', type: 'Object' }],
  },
  database: {
    title: '数据库',
    description: '查询、写入或更新业务数据。',
    icon: 'i-lucide:database',
    accent: '#0f766e',
    config: { datasource: 'crm', operation: 'query' },
    inputs: [{ name: 'sql', type: 'String' }],
    outputs: [{ name: 'rows', type: 'Array<Row>' }],
  },
  variable: {
    title: '变量',
    description: '设置、合并或映射流程变量。',
    icon: 'i-lucide:braces',
    accent: '#64748b',
    config: { mode: 'assign' },
    inputs: [{ name: 'input', type: 'Any' }],
    outputs: [{ name: 'variables', type: 'Object' }],
  },
  loop: {
    title: '循环',
    description: '遍历列表并对每项执行子任务。',
    icon: 'i-lucide:repeat-2',
    accent: '#9333ea',
    config: { concurrency: 3 },
    inputs: [{ name: 'items', type: 'Array' }],
    outputs: [{ name: 'results', type: 'Array' }],
  },
  delay: {
    title: '延时等待',
    description: '等待指定时长或直到计划时间后继续执行。',
    icon: 'i-lucide:timer',
    accent: '#ca8a04',
    config: { duration: 5, unit: 'seconds' },
    inputs: [{ name: 'payload', type: 'Any' }],
    outputs: [{ name: 'payload', type: 'Any' }],
  },
  approval: {
    title: '人工审批',
    description: '暂停流程并等待指定成员完成审批。',
    icon: 'i-lucide:user-round-check',
    accent: '#e11d48',
    config: { assignee: 'workflow_owner', timeout_hours: 24 },
    inputs: [{ name: 'request', type: 'Object' }],
    outputs: [
      { name: 'approved', type: 'Boolean' },
      { name: 'comment', type: 'String' },
    ],
  },
  parallel: {
    title: '并行分支',
    description: '并行执行多个分支，并按策略汇总结果。',
    icon: 'i-lucide:split',
    accent: '#ea580c',
    config: { completion: 'all', max_concurrency: 4 },
    inputs: [{ name: 'payload', type: 'Any' }],
    outputs: [{ name: 'results', type: 'Array' }],
  },
  subflow: {
    title: '子流程',
    description: '调用一个已发布流程并等待返回结果。',
    icon: 'i-lucide:network',
    accent: '#0d9488',
    config: { workflow_id: 'select_workflow', wait_for_result: true },
    inputs: [{ name: 'payload', type: 'Object' }],
    outputs: [{ name: 'result', type: 'Object' }],
  },
  webhook: {
    title: 'Webhook',
    description: '接收或发送 Webhook 事件并验证签名。',
    icon: 'i-lucide:webhook',
    accent: '#2563eb',
    config: { method: 'POST', verify_signature: true },
    inputs: [{ name: 'request', type: 'Object' }],
    outputs: [{ name: 'payload', type: 'Object' }],
  },
  message: {
    title: '消息',
    description: '发送通知、卡片或多渠道消息。',
    icon: 'i-lucide:message-square-send',
    accent: '#db2777',
    config: { channel: 'chat' },
    inputs: [{ name: 'content', type: 'String' }],
    outputs: [{ name: 'message_id', type: 'String' }],
  },
  end: {
    title: '结束',
    description: '输出最终回复、工单编号和执行摘要。',
    icon: 'i-lucide:check-circle-2',
    accent: '#16a34a',
    config: { output: 'final_answer' },
    inputs: [{ name: 'result', type: 'Any' }],
    outputs: [],
  },
}

export const workflowPalette: WorkflowPaletteItem[] = [
  {
    kind: 'llm',
    group: 'model',
    title: '大模型',
    description: '生成、改写、分类或抽取结构化内容',
    icon: 'i-lucide:sparkles',
    accent: '#4f46e5',
  },
  {
    kind: 'agent',
    group: 'model',
    title: 'Agent',
    description: '规划任务、调用工具并整合结果',
    icon: 'i-lucide:bot',
    accent: '#7c3aed',
  },
  {
    kind: 'knowledge',
    group: 'data',
    title: '知识库',
    description: '从文档集合中召回上下文片段',
    icon: 'i-lucide:book-open-text',
    accent: '#0891b2',
  },
  {
    kind: 'database',
    group: 'data',
    title: '数据库',
    description: '查询、写入或更新业务数据',
    icon: 'i-lucide:database',
    accent: '#0f766e',
  },
  {
    kind: 'variable',
    group: 'control',
    title: '变量',
    description: '设置、合并或映射流程变量',
    icon: 'i-lucide:braces',
    accent: '#64748b',
  },
  {
    kind: 'condition',
    group: 'control',
    title: '条件分支',
    description: '按规则把请求分流到不同路径',
    icon: 'i-lucide:git-fork',
    accent: '#d97706',
  },
  {
    kind: 'loop',
    group: 'control',
    title: '循环',
    description: '遍历列表并对每项执行子任务',
    icon: 'i-lucide:repeat-2',
    accent: '#9333ea',
  },
  {
    kind: 'delay',
    group: 'control',
    title: '延时等待',
    description: '按时长或计划时间暂停流程',
    icon: 'i-lucide:timer',
    accent: '#ca8a04',
  },
  {
    kind: 'approval',
    group: 'control',
    title: '人工审批',
    description: '等待成员审批后继续执行',
    icon: 'i-lucide:user-round-check',
    accent: '#e11d48',
  },
  {
    kind: 'parallel',
    group: 'control',
    title: '并行分支',
    description: '同时运行多个分支并汇总结果',
    icon: 'i-lucide:split',
    accent: '#ea580c',
  },
  {
    kind: 'subflow',
    group: 'control',
    title: '子流程',
    description: '复用并调用其他已发布流程',
    icon: 'i-lucide:network',
    accent: '#0d9488',
  },
  {
    kind: 'code',
    group: 'tool',
    title: '代码',
    description: '用脚本处理变量、转换数据格式',
    icon: 'i-lucide:code-2',
    accent: '#059669',
  },
  {
    kind: 'plugin',
    group: 'tool',
    title: '插件工具',
    description: '调用外部 API、数据库或业务系统',
    icon: 'i-lucide:puzzle',
    accent: '#dc2626',
  },
  {
    kind: 'http',
    group: 'tool',
    title: 'HTTP 请求',
    description: '请求外部服务并映射响应',
    icon: 'i-lucide:send',
    accent: '#0284c7',
  },
  {
    kind: 'webhook',
    group: 'tool',
    title: 'Webhook',
    description: '接收或发送带签名的事件通知',
    icon: 'i-lucide:webhook',
    accent: '#2563eb',
  },
  {
    kind: 'message',
    group: 'tool',
    title: '消息',
    description: '发送通知、卡片或多渠道消息',
    icon: 'i-lucide:message-square-send',
    accent: '#db2777',
  },
]

export const initialWorkflowSchema: WorkflowJsonSchema = {
  $schema: 'https://wuhu.dev/schemas/workflow/v1.json',
  version: '1.0.0',
  title: '智能客服自动化工作流',
  description: '基于知识库召回、大模型生成、质量判断和工单插件的客服处理流程。',
  nodes: [
    {
      id: 'start',
      type: 'start',
      title: '开始',
      status: 'success',
      position: { x: 0, y: 150 },
    },
    {
      id: 'knowledge',
      type: 'knowledge',
      title: '检索知识库',
      description: '检索产品文档和历史工单，返回最相关的 5 条片段。',
      status: 'success',
      latency: '320ms',
      position: { x: 320, y: 48 },
    },
    {
      id: 'llm',
      type: 'llm',
      title: '生成回复',
      description: '结合用户问题和知识片段生成准确、简洁的客服回复。',
      status: 'running',
      model: 'Doubao-pro-32k',
      latency: '1.8s',
      tokens: '2.4k',
      position: { x: 660, y: 150 },
      inputs: [
        { name: 'query', type: 'String' },
        { name: 'chunks', type: 'Array<Document>' },
      ],
    },
    {
      id: 'condition',
      type: 'condition',
      title: '满意度判断',
      description: '判断回复是否需要人工复核或直接发送给用户。',
      position: { x: 1000, y: 70 },
      outputs: [
        { name: 'approved', type: 'Boolean' },
        { name: 'reason', type: 'String' },
      ],
    },
    {
      id: 'plugin',
      type: 'plugin',
      title: '创建工单',
      description: '当置信度不足时，创建人工客服跟进工单。',
      status: 'warning',
      latency: '540ms',
      position: { x: 1000, y: 300 },
      inputs: [{ name: 'reason', type: 'String' }],
      outputs: [{ name: 'ticket_id', type: 'String' }],
    },
    {
      id: 'message',
      type: 'message',
      title: '发送消息',
      description: '把最终答复发送给用户，并写入消息日志。',
      position: { x: 1340, y: 80 },
      inputs: [{ name: 'answer', type: 'String' }],
      outputs: [{ name: 'message_id', type: 'String' }],
    },
    {
      id: 'end',
      type: 'end',
      title: '结束',
      position: { x: 1660, y: 180 },
      inputs: [
        { name: 'message_id', type: 'String' },
        { name: 'ticket_id', type: 'String' },
      ],
    },
  ],
  edges: [
    { source: 'start', target: 'knowledge' },
    { source: 'start', target: 'llm' },
    { source: 'knowledge', target: 'llm' },
    { source: 'llm', target: 'condition' },
    { source: 'condition', target: 'plugin', label: '需人工' },
    { source: 'condition', target: 'message', label: '通过' },
    { source: 'plugin', target: 'end' },
    { source: 'message', target: 'end' },
  ],
}

export function getNodeBaseConfig(kind: WorkflowNodeKind) {
  return nodeBaseConfig[kind]
}

export function createWorkflowNode(
  node: WorkflowSchemaNode,
  fallbackIndex = 0
): WorkflowNode {
  const position = node.position ?? {
    x: 280 + fallbackIndex * 280,
    y: 160 + (fallbackIndex % 3) * 110,
  }

  return {
    id: node.id,
    type: `workflow-${node.type}`,
    position,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selectable: true,
    deletable: node.type !== 'start' && node.type !== 'end',
    data: createWorkflowNodeData(node),
  }
}

export function createWorkflowNodeData(
  node: WorkflowSchemaNode
): WorkflowNodeData {
  const base = getNodeBaseConfig(node.type)

  return {
    kind: node.type,
    title: node.title || base.title,
    description: node.description ?? base.description,
    icon: node.icon ?? base.icon,
    accent: node.accent ?? base.accent,
    status: node.status ?? 'idle',
    model: node.model,
    latency: node.latency,
    tokens: node.tokens,
    config: node.config ?? { ...base.config },
    inputs: node.inputs ?? base.inputs,
    outputs: node.outputs ?? base.outputs,
  }
}

export function createWorkflowEdge(edge: WorkflowSchemaEdge): WorkflowEdge {
  return {
    id: edge.id ?? `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'custom',
    animated:
      edge.animated ??
      (edge.source.includes('llm') || edge.source.includes('condition')),
    markerEnd: MarkerType.ArrowClosed,
  }
}

export function schemaToFlow(schema: WorkflowJsonSchema) {
  return {
    nodes: schema.nodes.map((node, index) => createWorkflowNode(node, index)),
    edges: schema.edges.map(createWorkflowEdge),
  }
}

export function flowToSchema(
  schema: WorkflowJsonSchema,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): WorkflowJsonSchema {
  return {
    ...schema,
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.data.kind,
      title: node.data.title,
      description: node.data.description,
      position: node.position,
      status: node.data.status,
      model: node.data.model,
      latency: node.data.latency,
      tokens: node.data.tokens,
      icon: node.data.icon,
      accent: node.data.accent,
      config: node.data.config,
      inputs: node.data.inputs,
      outputs: node.data.outputs,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: typeof edge.label === 'string' ? edge.label : undefined,
      animated: edge.animated,
    })),
  }
}

export function createSchemaNodeFromPalette(
  item: WorkflowPaletteItem,
  id: string,
  position: XYPosition
): WorkflowSchemaNode {
  const base = getNodeBaseConfig(item.kind)

  return {
    id,
    type: item.kind,
    title: item.title,
    description: item.description,
    position,
    icon: item.icon,
    accent: item.accent,
    model:
      item.kind === 'llm' || item.kind === 'agent'
        ? 'Doubao-pro-32k'
        : undefined,
    config: { ...base.config },
    inputs: base.inputs,
    outputs: base.outputs,
  }
}

export function formatWorkflowSchema(schema: WorkflowJsonSchema) {
  return JSON.stringify(schema, null, 2)
}

export function parseWorkflowSchema(value: string) {
  const parsed = JSON.parse(value) as WorkflowJsonSchema
  validateWorkflowSchema(parsed)
  return parsed
}

export function validateWorkflowSchema(schema: WorkflowJsonSchema) {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Schema 必须是对象')
  }

  if (!Array.isArray(schema.nodes)) {
    throw new Error('Schema.nodes 必须是数组')
  }

  if (!Array.isArray(schema.edges)) {
    throw new Error('Schema.edges 必须是数组')
  }

  const nodeIds = new Set<string>()
  schema.nodes.forEach((node) => {
    if (!node.id) throw new Error('节点缺少 id')
    if (!node.type || !nodeBaseConfig[node.type]) {
      throw new Error(`节点 ${node.id} 的 type 不合法`)
    }
    if (nodeIds.has(node.id)) throw new Error(`节点 id 重复：${node.id}`)
    nodeIds.add(node.id)
  })

  schema.edges.forEach((edge) => {
    if (!edge.source || !edge.target) {
      throw new Error('连线必须包含 source 和 target')
    }
    if (!nodeIds.has(edge.source)) {
      throw new Error(`连线 source 不存在：${edge.source}`)
    }
    if (!nodeIds.has(edge.target)) {
      throw new Error(`连线 target 不存在：${edge.target}`)
    }
  })
}
