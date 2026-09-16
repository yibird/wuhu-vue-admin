import {
  WORKFLOW_DSL_VERSION,
  WORKFLOW_SCHEMA_URL,
  type JsonValue,
  type WorkflowDataSchema,
  type WorkflowDeploymentPolicy,
  type WorkflowEditorMetadata,
  type WorkflowInterface,
  type WorkflowInterfaceField,
  type WorkflowJsonSchema,
  type WorkflowMetadata,
  type WorkflowObservabilityPolicy,
  type WorkflowPermissionPolicy,
  type WorkflowResourceReference,
  type WorkflowResourceType,
  type WorkflowRetryPolicy,
  type WorkflowRuntimePolicy,
  type WorkflowSchemaEdge,
  type WorkflowSchemaNode,
  type WorkflowTrigger,
  type WorkflowTriggerType,
  type WorkflowValueBinding,
} from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function asJsonRecord(value: unknown): Record<string, JsonValue> {
  return isRecord(value) ? (value as Record<string, JsonValue>) : {}
}

function normalizeDataSchema(value: unknown): WorkflowDataSchema {
  if (!isRecord(value) || typeof value.type !== 'string') return { type: 'any' }
  return value as unknown as WorkflowDataSchema
}

function normalizeInterfaceField(
  value: unknown,
  index: number
): WorkflowInterfaceField {
  const field = isRecord(value) ? value : {}
  return {
    key: asString(field.key, `field_${index + 1}`),
    title: asString(field.title, `字段 ${index + 1}`),
    description:
      typeof field.description === 'string' ? field.description : undefined,
    schema: normalizeDataSchema(field.schema),
    required: field.required === true,
    default: field.default as JsonValue | undefined,
  }
}

function normalizeInterface(value: unknown): WorkflowInterface {
  const source = isRecord(value) ? value : {}
  return {
    inputs: Array.isArray(source.inputs)
      ? source.inputs.map(normalizeInterfaceField)
      : [],
    outputs: Array.isArray(source.outputs)
      ? source.outputs.map(normalizeInterfaceField)
      : [],
  }
}

function normalizeBinding(value: unknown): WorkflowValueBinding | undefined {
  if (!isRecord(value) || typeof value.kind !== 'string') return undefined
  return value as unknown as WorkflowValueBinding
}

function normalizeBindings(value: unknown) {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, binding]) => {
      const normalized = normalizeBinding(binding)
      return normalized ? [[key, normalized]] : []
    })
  ) as Record<string, WorkflowValueBinding>
}

function normalizeNodeType(value: unknown) {
  const aliases: Record<string, string> = {
    aiAgent: 'agent',
    database: 'database',
    end: 'end',
    httpRequest: 'http',
    if: 'if-else',
    input: 'workflow-input',
    output: 'workflow-output',
    setVariable: 'set-variable',
    subWorkflow: 'subflow',
  }
  const type = typeof value === 'string' ? value : 'unknown'
  return (aliases[type] ?? type) as WorkflowSchemaNode['type']
}

function normalizeNode(value: unknown, index: number): WorkflowSchemaNode {
  const source = isRecord(value) ? value : {}
  return {
    id: asString(source.id, `node-${index + 1}`),
    type: normalizeNodeType(source.type ?? source.kind),
    version: WORKFLOW_DSL_VERSION,
    name: asString(source.name ?? source.title, `未命名节点 ${index + 1}`),
    description:
      typeof source.description === 'string' ? source.description : undefined,
    disabled: source.disabled === true,
    config: asJsonRecord(source.config),
    inputBindings: normalizeBindings(source.inputBindings),
    next: [],
    prev: [],
    runtime: isRecord(source.runtime)
      ? (source.runtime as WorkflowSchemaNode['runtime'])
      : undefined,
    metadata: isRecord(source.metadata)
      ? (source.metadata as Record<string, JsonValue>)
      : undefined,
  }
}

function normalizeEdge(value: unknown, index: number): WorkflowSchemaEdge {
  const source = isRecord(value) ? value : {}
  const edgeSource = asString(source.source, '')
  const edgeTarget = asString(source.target, '')
  const kind = ['branch', 'error', 'flow', 'loop'].includes(String(source.kind))
    ? source.kind
    : 'flow'
  return {
    id: asString(source.id, `edge-${index + 1}`),
    source: edgeSource,
    target: edgeTarget,
    sourcePort:
      typeof source.sourcePort === 'string'
        ? source.sourcePort
        : typeof source.sourceHandle === 'string'
          ? source.sourceHandle
          : undefined,
    targetPort:
      typeof source.targetPort === 'string'
        ? source.targetPort
        : typeof source.targetHandle === 'string'
          ? source.targetHandle
          : undefined,
    kind: kind as WorkflowSchemaEdge['kind'],
    label: typeof source.label === 'string' ? source.label : undefined,
    condition: normalizeBinding(source.condition),
    priority: typeof source.priority === 'number' ? source.priority : undefined,
  }
}

function normalizeTopology(
  nodes: WorkflowSchemaNode[],
  edges: WorkflowSchemaEdge[]
) {
  const nextByNode = new Map<string, Set<string>>()
  const prevByNode = new Map<string, Set<string>>()
  edges.forEach((edge) => {
    if (!edge.source || !edge.target) return
    nextByNode.set(
      edge.source,
      new Set([...(nextByNode.get(edge.source) ?? []), edge.target])
    )
    prevByNode.set(
      edge.target,
      new Set([...(prevByNode.get(edge.target) ?? []), edge.source])
    )
  })
  nodes.forEach((node) => {
    node.next = [...(nextByNode.get(node.id) ?? [])]
    node.prev = [...(prevByNode.get(node.id) ?? [])]
  })
}

function normalizeResources(value: unknown): WorkflowResourceReference[] {
  if (!Array.isArray(value)) return []
  return value.map((item, index) => {
    const resource = isRecord(item) ? item : {}
    return {
      id: asString(resource.id, `resource-${index + 1}`),
      type: (typeof resource.type === 'string'
        ? resource.type
        : 'secret') as WorkflowResourceType,
      ref: asString(resource.ref, ''),
      required: resource.required !== false,
      description:
        typeof resource.description === 'string'
          ? resource.description
          : undefined,
    }
  })
}

const defaultRetry: WorkflowRetryPolicy = {
  maxAttempts: 1,
  backoff: 'exponential',
  initialDelayMs: 250,
  maxDelayMs: 5000,
  retryOn: [],
}

function normalizePolicies(value: unknown): WorkflowRuntimePolicy {
  const source = isRecord(value) ? value : {}
  const retry = isRecord(source.retry) ? source.retry : {}
  return {
    timeoutMs: typeof source.timeoutMs === 'number' ? source.timeoutMs : 60000,
    maxConcurrency:
      typeof source.maxConcurrency === 'number' ? source.maxConcurrency : 4,
    failureStrategy: ['fail-fast', 'continue', 'route-error'].includes(
      String(source.failureStrategy)
    )
      ? (source.failureStrategy as WorkflowRuntimePolicy['failureStrategy'])
      : 'fail-fast',
    retry: {
      ...defaultRetry,
      ...retry,
      retryOn: asStringArray(retry.retryOn),
    },
    idempotency: ['disabled', 'required', 'supported'].includes(
      String(source.idempotency)
    )
      ? (source.idempotency as WorkflowRuntimePolicy['idempotency'])
      : 'supported',
  }
}

function normalizeTriggers(value: unknown): WorkflowTrigger[] {
  if (!Array.isArray(value)) return []
  return value.map((item, index) => {
    const trigger = isRecord(item) ? item : {}
    const type = ['api', 'event', 'manual', 'schedule', 'webhook'].includes(
      String(trigger.type)
    )
      ? trigger.type
      : 'manual'
    return {
      id: asString(trigger.id, `trigger-${index + 1}`),
      type: type as WorkflowTriggerType,
      enabled: trigger.enabled !== false,
      config: asJsonRecord(trigger.config),
    }
  })
}

function normalizeDeployment(value: unknown): WorkflowDeploymentPolicy {
  const source = isRecord(value) ? value : {}
  return {
    environments: asStringArray(source.environments),
    strategy: source.strategy === 'replace' ? 'replace' : 'immutable-version',
    approvalRequired: source.approvalRequired === true,
  }
}

function normalizeObservability(value: unknown): WorkflowObservabilityPolicy {
  const source = isRecord(value) ? value : {}
  const logLevel = ['debug', 'error', 'info', 'warning'].includes(
    String(source.logLevel)
  )
    ? source.logLevel
    : 'info'
  return {
    logLevel: logLevel as WorkflowObservabilityPolicy['logLevel'],
    tracing: source.tracing !== false,
    metrics: source.metrics !== false,
    retentionDays:
      typeof source.retentionDays === 'number' ? source.retentionDays : 30,
    redact: asStringArray(source.redact),
  }
}

function normalizePermissions(value: unknown): WorkflowPermissionPolicy {
  const source = isRecord(value) ? value : {}
  return {
    owners: asStringArray(source.owners),
    editors: asStringArray(source.editors),
    runners: asStringArray(source.runners),
    viewers: asStringArray(source.viewers),
    allowServiceAccounts: source.allowServiceAccounts === true,
  }
}

function normalizeMetadata(value: unknown): WorkflowMetadata {
  const source = isRecord(value) ? value : {}
  const now = new Date().toISOString()
  return {
    owner: asString(source.owner, 'unknown'),
    team: typeof source.team === 'string' ? source.team : undefined,
    tags: asStringArray(source.tags),
    createdAt: asString(source.createdAt, now),
    updatedAt: asString(source.updatedAt, now),
    publishedAt:
      typeof source.publishedAt === 'string' ? source.publishedAt : undefined,
    changelog:
      typeof source.changelog === 'string' ? source.changelog : undefined,
  }
}

function normalizeEditorMetadata(
  value: unknown,
  nodes: WorkflowSchemaNode[],
  sourceNodes: unknown[]
): WorkflowEditorMetadata {
  const source = isRecord(value) ? value : {}
  const rawNodes = isRecord(source.nodes) ? source.nodes : {}
  const legacyNodes = new Map(
    sourceNodes.flatMap((item) =>
      isRecord(item) && typeof item.id === 'string'
        ? [[item.id, item] as const]
        : []
    )
  )
  const editorNodes = Object.fromEntries(
    nodes.map((node, index) => {
      const rawState = rawNodes[node.id]
      const state = isRecord(rawState) ? rawState : {}
      const legacyNode = legacyNodes.get(node.id)
      const position = isRecord(state.position)
        ? state.position
        : isRecord(legacyNode?.position)
          ? legacyNode.position
          : {}
      return [
        node.id,
        {
          position: {
            x: typeof position.x === 'number' ? position.x : 80 + index * 320,
            y: typeof position.y === 'number' ? position.y : 120,
          },
          collapsed: state.collapsed === true,
        },
      ]
    })
  )
  const viewport = isRecord(source.viewport) ? source.viewport : undefined
  return {
    nodes: editorNodes,
    viewport:
      viewport &&
      typeof viewport.x === 'number' &&
      typeof viewport.y === 'number' &&
      typeof viewport.zoom === 'number'
        ? { x: viewport.x, y: viewport.y, zoom: viewport.zoom }
        : undefined,
  }
}

export function normalizeWorkflowSchema(value: unknown): WorkflowJsonSchema {
  if (!isRecord(value)) throw new Error('工作流 JSONSchema 必须是对象。')
  if (
    typeof value.dslVersion === 'string' &&
    value.dslVersion !== WORKFLOW_DSL_VERSION
  )
    return value as unknown as WorkflowJsonSchema

  const sourceNodes = Array.isArray(value.nodes) ? value.nodes : []
  const nodes = sourceNodes.map(normalizeNode)
  const edges = Array.isArray(value.edges) ? value.edges.map(normalizeEdge) : []
  normalizeTopology(nodes, edges)
  const startNode = nodes.find((node) => node.type === 'start')
  const id = asString(value.id, 'workflow-imported')

  return {
    $schema: WORKFLOW_SCHEMA_URL,
    dslVersion: WORKFLOW_DSL_VERSION,
    id,
    key: asString(value.key, id),
    version: asString(value.version, WORKFLOW_DSL_VERSION),
    revision:
      typeof value.revision === 'number' && value.revision >= 0
        ? value.revision
        : 1,
    title: asString(value.title, '未命名工作流'),
    description: typeof value.description === 'string' ? value.description : '',
    status: ['archived', 'deprecated', 'draft', 'published'].includes(
      String(value.status)
    )
      ? (value.status as WorkflowJsonSchema['status'])
      : 'draft',
    namespace: asString(value.namespace, 'default'),
    entrypoint: asString(value.entrypoint, startNode?.id ?? nodes[0]?.id ?? ''),
    triggers: normalizeTriggers(value.triggers),
    interface: normalizeInterface(value.interface),
    variables: Array.isArray(value.variables)
      ? (value.variables as WorkflowJsonSchema['variables'])
      : [],
    resources: normalizeResources(value.resources),
    permissions: normalizePermissions(value.permissions),
    policies: normalizePolicies(value.policies),
    deployment: normalizeDeployment(value.deployment),
    observability: normalizeObservability(value.observability),
    metadata: normalizeMetadata(value.metadata),
    nodes,
    edges,
    ui: normalizeEditorMetadata(value.ui, nodes, sourceNodes),
    extensions: isRecord(value.extensions)
      ? (value.extensions as Record<string, JsonValue>)
      : undefined,
  }
}
