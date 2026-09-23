import { cloneDeep } from 'es-toolkit'
import {
  areWorkflowDataSchemasCompatible,
  getWorkflowNodeDefinition,
  requireWorkflowNodeDefinition,
  validateWorkflowSchema as validateDomainWorkflowSchema,
} from '../../domain'
import { layoutWorkflowNodes, schemaToFlow } from '../data'
import { workflowAiHints, workflowAiTemplates } from './aiTemplates'
import type {
  WorkflowAiTemplateEdge,
  WorkflowAiTemplateNode,
} from './aiTemplates'
import type { WorkflowDataSchema } from '../../domain'
import type {
  WorkflowAiMessage,
  WorkflowAiPlan,
  WorkflowAiRole,
  WorkflowAiSuggestion,
  WorkflowJsonSchema,
  WorkflowNodeKind,
  WorkflowSchemaEdge,
  WorkflowSchemaNode,
  WorkflowValueBinding,
} from '../types'

export interface WorkflowAiGenerateOptions {
  /**
   * @desc 用户输入的自然语言描述
   */
  prompt: string
  /**
   * @desc 当前画布对应的 DSL,用于保留 id、接口、策略等元信息
   */
  baseSchema: WorkflowJsonSchema
}

const createAiId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

const formatAiTime = () =>
  new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

export function createWorkflowAiMessage(
  role: WorkflowAiRole,
  content: string
): WorkflowAiMessage {
  return {
    id: createAiId(`ai-${role}`),
    role,
    content,
    createdAt: formatAiTime(),
  }
}

export const workflowAiSuggestions: WorkflowAiSuggestion[] = [
  {
    id: 'approval',
    title: '退款审批流程',
    prompt:
      '客户退款审批：先查询订单，金额 5000 以内自动通过，否则转人工审批，最后通知客户结果。',
    icon: 'i-lucide:user-round-check',
  },
  {
    id: 'qa',
    title: '知识库问答',
    prompt: '智能客服问答：先检索产品知识库，再让大模型生成答复并输出给用户。',
    icon: 'i-lucide:book-open-text',
  },
  {
    id: 'review',
    title: '内容风控审核',
    prompt:
      '内容审核：识别违规风险，命中风险转人工复核，通过后放行，驳回要说明原因。',
    icon: 'i-lucide:shield-alert',
  },
  {
    id: 'data-sync',
    title: '数据同步入库',
    prompt:
      '每天抓取第三方接口数据，清洗转换后写入数据库，并发送同步结果通知。',
    icon: 'i-lucide:database',
  },
]

export const initialWorkflowAiMessages: WorkflowAiMessage[] = [
  {
    id: 'ai-welcome',
    role: 'assistant',
    content:
      '描述你要搭建的业务流程，我会按模板生成节点与连线，确认无误后再应用到画布。生成结果同样可以继续手动调整。',
    createdAt: '09:30',
  },
]

/**
 * 从提示词里提取一句可读的流程标题
 *
 * @param prompt - 用户输入
 * @param fallback - 提取失败时的兜底标题
 * @returns 流程标题
 */
function deriveTitle(prompt: string, fallback: string) {
  const head = prompt.split(/[：:，,。.;；!！?？\n]/)[0]?.trim() ?? ''
  const cleaned = head
    .replace(
      /^(帮我|请|麻烦|想要|我想|我要|需要|生成|做一个|做|设计|搭建|建一个|创建)+/g,
      ''
    )
    .trim()

  if (cleaned.length < 3) return fallback
  return cleaned.length > 20 ? `${cleaned.slice(0, 20)}…` : cleaned
}

/**
 * 把补充节点串在指定节点的下游
 *
 * @param edges - 模板连线
 * @param sourceId - 需要插入下游的节点 id
 * @param chain - 依次插入的节点
 * @returns 重写后的连线
 */
function insertAfterSource(
  edges: WorkflowAiTemplateEdge[],
  sourceId: string,
  chain: WorkflowAiTemplateNode[]
): WorkflowAiTemplateEdge[] {
  if (!chain.length) return edges

  return edges.flatMap((edge) => {
    if (edge.source !== sourceId) return [edge]

    return [
      ...chain.map((node, index) => ({
        source: index === 0 ? sourceId : chain[index - 1].id,
        target: node.id,
      })),
      { ...edge, source: chain[chain.length - 1].id },
    ]
  })
}

/**
 * 把补充节点串在指定节点的上游
 *
 * @param edges - 模板连线
 * @param targetId - 需要插入上游的节点 id
 * @param chain - 依次插入的节点
 * @returns 重写后的连线
 */
function insertBeforeTarget(
  edges: WorkflowAiTemplateEdge[],
  targetId: string,
  chain: WorkflowAiTemplateNode[]
): WorkflowAiTemplateEdge[] {
  if (!chain.length) return edges

  return edges.flatMap((edge) => {
    if (edge.target !== targetId) return [edge]

    return [
      { ...edge, target: chain[0].id },
      ...chain.slice(1).map((node, index) => ({
        source: chain[index].id,
        target: node.id,
      })),
      { source: chain[chain.length - 1].id, target: targetId },
    ]
  })
}

/**
 * 为输入端口挑选一个上游输出端口,优先类型兼容
 *
 * @param kind - 上游节点类型
 * @param target - 目标输入端口的数据结构
 * @returns 可用的输出端口
 */
function pickOutputPort(kind: WorkflowNodeKind, target: WorkflowDataSchema) {
  const outputs = getWorkflowNodeDefinition(kind)?.outputs ?? []

  return (
    outputs.find((port) =>
      areWorkflowDataSchemasCompatible(port.schema, target)
    ) ?? outputs[0]
  )
}

/**
 * 依据入边为必填输入端口补齐上游绑定
 *
 * DSL 校验要求必填输入端口必须出现在 inputBindings 中,仅连边不算
 *
 * @param nodes - 生成出来的节点
 * @param edges - 生成出来的连线
 */
function resolveInputBindings(
  nodes: WorkflowSchemaNode[],
  edges: WorkflowSchemaEdge[]
) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const incomingByNode = new Map<string, WorkflowSchemaEdge[]>()

  edges.forEach((edge) => {
    incomingByNode.set(edge.target, [
      ...(incomingByNode.get(edge.target) ?? []),
      edge,
    ])
  })

  nodes.forEach((node) => {
    const definition = getWorkflowNodeDefinition(node.type)
    if (!definition) return

    const incoming = incomingByNode.get(node.id) ?? []
    const bindings: Record<string, WorkflowValueBinding> = {}

    definition.inputs.forEach((port) => {
      if (!port.required) return

      const source = incoming
        .map((edge) => nodeById.get(edge.source))
        .find((item) => item && pickOutputPort(item.type, port.schema))
      if (!source) return

      const output = pickOutputPort(source.type, port.schema)
      if (!output) return

      bindings[port.id] = {
        kind: 'node-output',
        nodeId: source.id,
        port: output.id,
      }
    })

    node.inputBindings = bindings
  })
}

/**
 * 按节点定义默认值创建 DSL 节点
 *
 * @param node - 模板节点声明
 * @returns DSL 节点,next / prev 由调用方补齐
 */
function createSchemaNode(node: WorkflowAiTemplateNode): WorkflowSchemaNode {
  const definition = requireWorkflowNodeDefinition(node.kind)

  return {
    id: node.id,
    type: node.kind,
    version: definition.version,
    name: node.name,
    description: node.description ?? definition.description,
    config: {
      ...cloneDeep(definition.defaults),
      ...cloneDeep(node.config ?? {}),
    },
    inputBindings: {},
    next: [],
    prev: [],
  }
}

/**
 * 补齐节点配置里引用、但基准 DSL 尚未声明的资源,避免生成结果因资源缺失而校验失败
 *
 * @param baseSchema - 基准 DSL
 * @param nodes - 生成出来的节点
 * @returns 资源声明列表
 */
function resolveResources(
  baseSchema: WorkflowJsonSchema,
  nodes: WorkflowSchemaNode[]
) {
  const resources = [...(baseSchema.resources ?? [])]
  const knownIds = new Set(resources.map((item) => item.id))

  nodes.forEach((node) => {
    const definition = getWorkflowNodeDefinition(node.type)
    definition?.config.forEach((field) => {
      if (field.control !== 'resource' || !field.resourceType) return
      const resourceId = node.config[field.key]
      if (typeof resourceId !== 'string' || !resourceId) return
      if (knownIds.has(resourceId)) return

      knownIds.add(resourceId)
      resources.push({
        id: resourceId,
        type: field.resourceType,
        ref: `resource://${field.resourceType}/${resourceId}`,
        required: false,
        description: `AI 生成时自动补齐的${field.label}资源。`,
      })
    })
  })

  return resources
}

/**
 * 依据自然语言描述生成工作流方案
 *
 * 生成过程是确定性的:命中模板 → 按提示词补充节点 → 计算坐标 → 校验 DSL
 *
 * @param options - 提示词与基准 DSL
 * @returns 可预览、可应用的生成方案
 * @throws 提示词为空、无可用模板或生成结果未通过 DSL 校验时抛出
 */
export function generateWorkflowPlan(
  options: WorkflowAiGenerateOptions
): WorkflowAiPlan {
  const prompt = options.prompt.trim()
  if (!prompt) throw new Error('请先描述你要生成的工作流。')

  const template = workflowAiTemplates
    .map((item, index) => ({
      item,
      index,
      score: item.keywords.filter((pattern) => pattern.test(prompt)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.item
  if (!template)
    throw new Error('没有匹配到可用的流程模板,请补充业务动作后重试。')

  const templateKinds = new Set(template.nodes.map((node) => node.kind))
  const hints = workflowAiHints
    .filter(
      (hint) =>
        hint.pattern.test(prompt) &&
        !hint.coveredBy.some((kind) => templateKinds.has(kind))
    )
    .map((hint) => ({ hint, nodes: hint.nodes }))
  const startHints = hints
    .filter((item) => item.hint.placement === 'after-start')
    .flatMap((item) => item.nodes)
  const endHints = hints
    .filter((item) => item.hint.placement === 'before-end')
    .flatMap((item) => item.nodes)

  const startNode = template.nodes.find((node) => node.id === 'start')
  const endNode = template.nodes.find((node) => node.id === 'end')
  const middleNodes = template.nodes.filter(
    (node) => node.id !== 'start' && node.id !== 'end'
  )
  const templateNodes = [
    ...(startNode ? [startNode] : []),
    ...startHints,
    ...middleNodes,
    ...endHints,
    ...(endNode ? [endNode] : []),
  ]

  const templateEdges = insertBeforeTarget(
    insertAfterSource(template.edges, 'start', startHints),
    'end',
    endHints
  )

  const nodeIds = new Set(templateNodes.map((node) => node.id))
  const usedEdgeIds = new Set<string>()
  const createEdgeId = (
    source: string,
    target: string,
    sourcePort?: string
  ) => {
    const base = `edge-${source}${sourcePort ? `-${sourcePort}` : ''}-${target}`
    let id = base
    let index = 2
    while (usedEdgeIds.has(id)) id = `${base}-${index++}`
    usedEdgeIds.add(id)
    return id
  }

  const edges: WorkflowSchemaEdge[] = templateEdges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      id: createEdgeId(edge.source, edge.target, edge.sourcePort),
      source: edge.source,
      target: edge.target,
      sourcePort: edge.sourcePort,
      kind: edge.kind ?? 'flow',
      label: edge.label,
    }))

  const nextByNode = new Map<string, string[]>()
  const prevByNode = new Map<string, string[]>()
  edges.forEach((edge) => {
    nextByNode.set(edge.source, [
      ...(nextByNode.get(edge.source) ?? []),
      edge.target,
    ])
    prevByNode.set(edge.target, [
      ...(prevByNode.get(edge.target) ?? []),
      edge.source,
    ])
  })

  const nodes = templateNodes.map((node) => {
    const schemaNode = createSchemaNode(node)
    schemaNode.next = nextByNode.get(node.id) ?? []
    schemaNode.prev = prevByNode.get(node.id) ?? []
    return schemaNode
  })

  resolveInputBindings(nodes, edges)

  // 先给一个按声明顺序递增的临时坐标,分层布局会据此确定同层节点的纵向顺序
  const draftSchema: WorkflowJsonSchema = {
    ...cloneDeep(options.baseSchema),
    title: deriveTitle(prompt, template.title),
    description: `AI 依据「${prompt.length > 60 ? `${prompt.slice(0, 60)}…` : prompt}」生成:${template.summary}`,
    nodes,
    edges,
    resources: resolveResources(options.baseSchema, nodes),
    metadata: {
      ...options.baseSchema.metadata,
      updatedAt: new Date().toISOString(),
    },
    ui: {
      nodes: Object.fromEntries(
        nodes.map((node, index) => [
          node.id,
          { position: { x: index * 360, y: index * 250 } },
        ])
      ),
    },
  }

  const flow = schemaToFlow(draftSchema)
  const positionedNodes = layoutWorkflowNodes(flow.nodes, flow.edges)
  const generatedSchema: WorkflowJsonSchema = {
    ...draftSchema,
    ui: {
      nodes: Object.fromEntries(
        positionedNodes.map((node) => [
          node.id,
          { position: { ...node.position } },
        ])
      ),
    },
  }

  const validation = validateDomainWorkflowSchema(generatedSchema)
  const firstError = validation.issues.find((item) => item.severity === 'error')
  if (firstError) {
    throw new Error(`生成结果未通过 DSL 校验：${firstError.message}`)
  }

  const nameById = new Map(nodes.map((node) => [node.id, node.name]))
  const branchByNode = new Map<string, string>()
  edges.forEach((edge) => {
    if (!edge.sourcePort || branchByNode.has(edge.target)) return
    branchByNode.set(edge.target, edge.label ?? edge.sourcePort)
  })

  return {
    id: createAiId('ai-plan'),
    templateId: template.id,
    title: generatedSchema.title,
    summary: template.summary,
    highlights: [
      `模板匹配：${template.title}`,
      ...hints.map((item) => item.hint.label),
      `DSL 校验通过：${nodes.length} 节点 / ${edges.length} 连线`,
    ],
    schema: generatedSchema,
    nodes: nodes.map((node) => {
      const definition = requireWorkflowNodeDefinition(node.type)
      return {
        id: node.id,
        kind: node.type,
        name: node.name,
        icon: definition.icon,
        accent: definition.accent,
        branch: branchByNode.get(node.id),
      }
    }),
    edges: edges.map((edge) => ({
      id: edge.id,
      from: nameById.get(edge.source) ?? edge.source,
      to: nameById.get(edge.target) ?? edge.target,
      label: edge.label ?? '',
    })),
    warnings: validation.issues.filter((item) => item.severity !== 'error'),
  }
}
