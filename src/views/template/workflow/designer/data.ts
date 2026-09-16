import { cloneDeep } from 'es-toolkit'
import { MarkerType, Position, type XYPosition } from '@vue-flow/core'
import {
  requireWorkflowNodeDefinition,
  validateWorkflowSchema as validateDomainWorkflowSchema,
  WORKFLOW_DSL_VERSION,
  WORKFLOW_SCHEMA_URL,
  workflowNodeDefinitions,
} from '../domain'
import { normalizeWorkflowSchema } from '../domain/migration'
import type {
  WorkflowEdge,
  WorkflowJsonSchema,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeKind,
  WorkflowNodePort,
  WorkflowPaletteGroup,
  WorkflowPaletteItem,
  WorkflowSchemaEdge,
  WorkflowSchemaNode,
} from './types'

export const workflowNodeKinds = workflowNodeDefinitions.map(
  (definition) => definition.kind
)

export const workflowPaletteGroupLabels: Record<WorkflowPaletteGroup, string> =
  {
    basic: '基础节点',
    ai: 'AI 节点',
    data: '数据节点',
    logic: '逻辑节点',
    workflow: '工作流节点',
    human: '人机交互',
    integration: '扩展节点',
  }

export const workflowPalette: WorkflowPaletteItem[] = workflowNodeDefinitions
  .filter((definition) => definition.palette)
  .map((definition) => ({
    kind: definition.kind,
    group: definition.category,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    accent: definition.accent,
    gradient: definition.gradient,
  }))

const timestamp = '2026-08-27T08:00:00.000Z'

export const initialWorkflowSchema: WorkflowJsonSchema = {
  $schema: WORKFLOW_SCHEMA_URL,
  dslVersion: WORKFLOW_DSL_VERSION,
  id: 'wf-customer-support',
  key: 'customer-support-assistant',
  version: WORKFLOW_DSL_VERSION,
  revision: 12,
  title: '智能客服自动化工作流',
  description: '使用知识库与大模型生成客服答复，并输出结构化执行结果。',
  status: 'draft',
  namespace: 'ai-platform/customer-service',
  entrypoint: 'start',
  triggers: [
    { id: 'manual', type: 'manual', enabled: true, config: {} },
    {
      id: 'customer-support-api',
      type: 'api',
      enabled: true,
      config: {
        method: 'POST',
        path: '/workflows/customer-support/run',
      },
    },
  ],
  interface: {
    inputs: [
      {
        key: 'query',
        title: '用户问题',
        schema: { type: 'string' },
        required: true,
      },
      {
        key: 'sessionId',
        title: '会话标识',
        schema: { type: 'string' },
        required: true,
      },
    ],
    outputs: [
      {
        key: 'answer',
        title: '客服答复',
        schema: { type: 'string' },
        required: true,
      },
    ],
  },
  variables: [
    {
      key: 'locale',
      title: '答复语言',
      scope: 'workflow',
      schema: { type: 'string', default: 'zh-CN' },
      default: 'zh-CN',
      mutable: true,
    },
  ],
  resources: [
    {
      id: 'llm-main',
      type: 'llm-provider',
      ref: 'resource://llm/doubao-production',
      required: true,
    },
    {
      id: 'kb-product',
      type: 'knowledge-base',
      ref: 'resource://knowledge/product-docs',
      required: true,
    },
  ],
  permissions: {
    owners: ['team:ai-platform'],
    editors: ['role:workflow-editor'],
    runners: ['role:workflow-runner'],
    viewers: ['role:workflow-viewer'],
    allowServiceAccounts: true,
  },
  policies: {
    timeoutMs: 60_000,
    maxConcurrency: 4,
    failureStrategy: 'fail-fast',
    retry: {
      maxAttempts: 2,
      backoff: 'exponential',
      initialDelayMs: 500,
      maxDelayMs: 5_000,
      retryOn: ['TIMEOUT', 'RATE_LIMIT', 'UPSTREAM_5XX'],
    },
    idempotency: 'supported',
  },
  deployment: {
    environments: ['development', 'staging', 'production'],
    strategy: 'immutable-version',
    approvalRequired: true,
  },
  observability: {
    logLevel: 'info',
    tracing: true,
    metrics: true,
    retentionDays: 30,
    redact: ['interface.inputs.sessionId'],
  },
  metadata: {
    owner: 'team:ai-platform',
    team: 'AI Platform',
    tags: ['customer-service', 'rag'],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  nodes: [
    {
      id: 'start',
      type: 'start',
      version: WORKFLOW_DSL_VERSION,
      name: '接收用户问题',
      description: '注入 API 请求中的用户问题与会话标识。',
      config: { trigger: 'api' },
      inputBindings: {},
      next: ['knowledge'],
      prev: [],
    },
    {
      id: 'knowledge',
      type: 'knowledge',
      version: WORKFLOW_DSL_VERSION,
      name: '检索产品知识库',
      description: '召回与用户问题最相关的产品文档。',
      config: {
        knowledgeBase: 'kb-product',
        topK: 5,
        scoreThreshold: 0.6,
      },
      inputBindings: {
        query: { kind: 'node-output', nodeId: 'start', port: 'query' },
      },
      next: ['llm'],
      prev: ['start'],
    },
    {
      id: 'llm',
      type: 'llm',
      version: WORKFLOW_DSL_VERSION,
      name: '生成客服答复',
      description: '基于问题与召回文档生成准确、简洁的答复。',
      config: {
        provider: 'llm-main',
        model: 'Doubao-pro-32k',
        systemPrompt: '仅依据知识库上下文回答，无法确认时明确说明。',
        temperature: 0.3,
        maxTokens: 2048,
      },
      inputBindings: {
        prompt: { kind: 'node-output', nodeId: 'start', port: 'query' },
        context: {
          kind: 'node-output',
          nodeId: 'knowledge',
          port: 'chunks',
        },
      },
      next: ['end'],
      prev: ['knowledge'],
    },
    {
      id: 'end',
      type: 'end',
      version: WORKFLOW_DSL_VERSION,
      name: '输出答复',
      description: '返回客服答复和本次执行摘要。',
      config: {},
      inputBindings: {
        result: { kind: 'node-output', nodeId: 'llm', port: 'text' },
      },
      next: [],
      prev: ['llm'],
    },
  ],
  edges: [
    {
      id: 'edge-start-knowledge',
      source: 'start',
      target: 'knowledge',
      sourcePort: 'query',
      targetPort: 'query',
      kind: 'flow',
    },
    {
      id: 'edge-knowledge-llm',
      source: 'knowledge',
      target: 'llm',
      sourcePort: 'chunks',
      targetPort: 'context',
      kind: 'flow',
    },
    {
      id: 'edge-llm-end',
      source: 'llm',
      target: 'end',
      sourcePort: 'text',
      targetPort: 'result',
      kind: 'flow',
    },
  ],
  ui: {
    nodes: {
      start: { position: { x: 0, y: 150 } },
      knowledge: { position: { x: 340, y: 40 } },
      llm: { position: { x: 680, y: 150 } },
      end: { position: { x: 1020, y: 150 } },
    },
    viewport: { x: 80, y: 60, zoom: 0.7 },
  },
}

function toDisplayType(type: string) {
  const labels: Record<string, string> = {
    any: '任意',
    array: '数组',
    boolean: '布尔值',
    document: '文档',
    file: '文件',
    integer: '整数',
    null: '空值',
    number: '数字',
    object: '对象',
    string: '文本',
    vector: '向量',
  }
  return labels[type] ?? type
}

function toPorts(
  ports: ReturnType<typeof requireWorkflowNodeDefinition>['inputs']
): WorkflowNodePort[] {
  return ports.map((port) => ({
    id: port.id,
    name: port.label,
    type: toDisplayType(port.schema.type),
    required: port.required,
    multiple: port.multiple,
  }))
}

export function getNodeBaseConfig(kind: WorkflowNodeKind) {
  const definition = requireWorkflowNodeDefinition(kind)
  return {
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    accent: definition.accent,
    gradient: definition.gradient,
    config: cloneDeep(definition.defaults),
    inputs: toPorts(definition.inputs),
    outputs: toPorts(definition.outputs),
  }
}

export function createWorkflowNode(
  node: WorkflowSchemaNode,
  position?: XYPosition,
  fallbackIndex = 0
): WorkflowNode {
  const fallbackPosition = {
    x: 280 + fallbackIndex * 280,
    y: 160 + (fallbackIndex % 3) * 110,
  }

  return {
    id: node.id,
    type: `workflow-${node.type}`,
    position: position ?? fallbackPosition,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selectable: true,
    deletable: true,
    data: createWorkflowNodeData(node),
  }
}

export function createWorkflowNodeData(
  node: WorkflowSchemaNode
): WorkflowNodeData {
  const definition = requireWorkflowNodeDefinition(node.type)
  const model = node.config.model

  return {
    kind: node.type,
    nodeVersion: node.version,
    title: node.name || definition.title,
    description: node.description ?? definition.description,
    icon: definition.icon,
    accent: definition.accent,
    gradient: definition.gradient,
    status: 'idle',
    breakpoint: false,
    model: typeof model === 'string' ? model : undefined,
    config: cloneDeep(node.config),
    configSchema: definition.config,
    inputBindings: cloneDeep(node.inputBindings),
    inputs: toPorts(definition.inputs),
    outputs: toPorts(definition.outputs),
  }
}

export function createWorkflowEdge(edge: WorkflowSchemaEdge): WorkflowEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourcePort,
    targetHandle: edge.targetPort,
    label: edge.label,
    type: 'custom',
    animated: false,
    markerEnd: MarkerType.ArrowClosed,
    data: { kind: edge.kind, priority: edge.priority },
  }
}

export function schemaToFlow(schema: WorkflowJsonSchema) {
  return {
    nodes: schema.nodes.map((node, index) =>
      createWorkflowNode(node, schema.ui?.nodes[node.id]?.position, index)
    ),
    edges: schema.edges.map(createWorkflowEdge),
  }
}

export function flowToSchema(
  schema: WorkflowJsonSchema,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): WorkflowJsonSchema {
  const schemaNodeMap = new Map(schema.nodes.map((node) => [node.id, node]))
  const schemaEdgeMap = new Map(schema.edges.map((edge) => [edge.id, edge]))
  const nextByNode = new Map<string, Set<string>>()
  const prevByNode = new Map<string, Set<string>>()
  edges.forEach((edge) => {
    const next = nextByNode.get(edge.source) ?? new Set<string>()
    const prev = prevByNode.get(edge.target) ?? new Set<string>()
    next.add(edge.target)
    prev.add(edge.source)
    nextByNode.set(edge.source, next)
    prevByNode.set(edge.target, prev)
  })

  return {
    ...schema,
    revision: schema.revision,
    metadata: { ...schema.metadata, updatedAt: new Date().toISOString() },
    nodes: nodes.map((node) => {
      const previous = schemaNodeMap.get(node.id)
      return {
        ...previous,
        id: node.id,
        type: node.data.kind,
        version: node.data.nodeVersion,
        name: node.data.title,
        description: node.data.description,
        config: cloneDeep(node.data.config),
        inputBindings: cloneDeep(node.data.inputBindings),
        next: [...(nextByNode.get(node.id) ?? [])],
        prev: [...(prevByNode.get(node.id) ?? [])],
      }
    }),
    edges: edges.map((edge) => {
      const previous = schemaEdgeMap.get(edge.id)
      return {
        ...previous,
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourcePort: edge.sourceHandle ?? undefined,
        targetPort: edge.targetHandle ?? undefined,
        kind: previous?.kind ?? 'flow',
        label: typeof edge.label === 'string' ? edge.label : undefined,
      }
    }),
    ui: {
      ...schema.ui,
      nodes: Object.fromEntries(
        nodes.map((node) => [
          node.id,
          {
            ...schema.ui?.nodes[node.id],
            position: { ...node.position },
          },
        ])
      ),
    },
  }
}

export function createSchemaNodeFromPalette(
  item: WorkflowPaletteItem,
  id: string
): WorkflowSchemaNode {
  const definition = requireWorkflowNodeDefinition(item.kind)

  return {
    id,
    type: item.kind,
    version: definition.version,
    name: item.title,
    description: item.description,
    config: cloneDeep(definition.defaults),
    inputBindings: {},
    next: [],
    prev: [],
  }
}

export function formatWorkflowSchema(schema: WorkflowJsonSchema) {
  return JSON.stringify(schema, null, 2)
}

export function formatJsonSource(value: string) {
  const parsed: unknown = JSON.parse(value)
  const formatted = JSON.stringify(parsed, null, 2)
  if (typeof formatted !== 'string') {
    throw new Error('JSON 内容无法格式化')
  }
  return formatted
}

export function parseWorkflowSchema(value: string) {
  const parsed: unknown = JSON.parse(value)
  const schema = normalizeWorkflowSchema(parsed)
  validateWorkflowSchema(schema)
  return schema
}

export function validateWorkflowSchema(schema: WorkflowJsonSchema) {
  const result = validateDomainWorkflowSchema(schema)
  const firstError = result.issues.find((item) => item.severity === 'error')
  if (firstError) throw new Error(firstError.message)
  return result
}
