export const WORKFLOW_DSL_VERSION = '0.0.1' as const
export const WORKFLOW_SCHEMA_URL =
  'https://wuhu.dev/schemas/workflow/0.0.1/schema.json'

export type JsonPrimitive = boolean | null | number | string

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue }

export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
    return true
  if (Array.isArray(value)) return value.every(isJsonValue)
  if (typeof value !== 'object') return false
  return Object.values(value as Record<string, unknown>).every(isJsonValue)
}

export type WorkflowNodeKind =
  | 'start'
  | 'end'
  | 'variable'
  | 'set-variable'
  | 'llm'
  | 'agent'
  | 'tool'
  | 'question-classifier'
  | 'parameter-extractor'
  | 'embedding'
  | 'rerank'
  | 'http'
  | 'database'
  | 'code'
  | 'file'
  | 'document-extractor'
  | 'template-transform'
  | 'variable-aggregator'
  | 'list-operator'
  | 'knowledge'
  | 'if-else'
  | 'switch'
  | 'condition'
  | 'loop'
  | 'iterator'
  | 'parallel'
  | 'subflow'
  | 'workflow-input'
  | 'workflow-output'
  | 'approval'
  | 'human-input'
  | 'delay'
  | 'plugin'
  | 'webhook'
  | 'message'
  | 'answer'

export type WorkflowNodeCategory =
  | 'basic'
  | 'ai'
  | 'data'
  | 'logic'
  | 'workflow'
  | 'human'
  | 'integration'

export type WorkflowDataType =
  | 'any'
  | 'array'
  | 'boolean'
  | 'document'
  | 'file'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string'
  | 'vector'

export interface WorkflowDataSchema {
  type: WorkflowDataType
  title?: string
  description?: string
  nullable?: boolean
  format?: string
  enum?: JsonPrimitive[]
  default?: JsonValue
  items?: WorkflowDataSchema
  properties?: Record<string, WorkflowDataSchema>
  required?: string[]
  additionalProperties?: boolean
}

export interface WorkflowNodePortSchema {
  id: string
  label: string
  schema: WorkflowDataSchema
  required?: boolean
  multiple?: boolean
  dynamic?: boolean
}

export type WorkflowConfigControl =
  | 'code'
  | 'expression'
  | 'input'
  | 'json'
  | 'number'
  | 'resource'
  | 'secret'
  | 'select'
  | 'switch'
  | 'textarea'

export interface WorkflowNodeConfigFieldSchema {
  key: string
  label: string
  control: WorkflowConfigControl
  schema: WorkflowDataSchema
  required?: boolean
  options?: Array<{ label: string; value: JsonPrimitive }>
  resourceType?: WorkflowResourceType
  placeholder?: string
}

export interface WorkflowNodeDefinition {
  kind: WorkflowNodeKind
  version: string
  category: WorkflowNodeCategory
  title: string
  description: string
  icon: string
  accent: string
  /** 节点主视觉渐变色（起始色 → 结束色） */
  gradient: [string, string]
  inputs: WorkflowNodePortSchema[]
  outputs: WorkflowNodePortSchema[]
  config: WorkflowNodeConfigFieldSchema[]
  defaults: Record<string, JsonValue>
  executable: boolean
  sideEffect: boolean
  supportsRetry: boolean
  palette: boolean
}

export type WorkflowValueBinding =
  | { kind: 'literal'; value: JsonValue }
  | { kind: 'workflow-input'; input: string; path?: string }
  | { kind: 'variable'; variable: string; path?: string }
  | { kind: 'node-output'; nodeId: string; port: string; path?: string }
  | {
      kind: 'expression'
      language: 'cel' | 'jsonata'
      expression: string
    }
  | { kind: 'template'; template: string }

export type WorkflowVariableScope = 'workflow' | 'environment' | 'secret'

export interface WorkflowVariableDeclaration {
  key: string
  title: string
  description?: string
  scope: WorkflowVariableScope
  schema: WorkflowDataSchema
  default?: JsonValue
  mutable: boolean
  resourceId?: string
}

export interface WorkflowInterfaceField {
  key: string
  title: string
  description?: string
  schema: WorkflowDataSchema
  required: boolean
  default?: JsonValue
}

export interface WorkflowInterface {
  inputs: WorkflowInterfaceField[]
  outputs: WorkflowInterfaceField[]
}

export type WorkflowResourceType =
  | 'database'
  | 'file-storage'
  | 'http-credential'
  | 'knowledge-base'
  | 'llm-provider'
  | 'secret'
  | 'sub-workflow'
  | 'tool'

export interface WorkflowResourceReference {
  id: string
  type: WorkflowResourceType
  ref: string
  required: boolean
  description?: string
}

export interface WorkflowPermissionPolicy {
  owners: string[]
  editors: string[]
  runners: string[]
  viewers: string[]
  allowServiceAccounts: boolean
}

export interface WorkflowRetryPolicy {
  maxAttempts: number
  backoff: 'constant' | 'exponential' | 'linear'
  initialDelayMs: number
  maxDelayMs: number
  retryOn: string[]
}

export interface WorkflowRuntimePolicy {
  timeoutMs: number
  maxConcurrency: number
  failureStrategy: 'fail-fast' | 'continue' | 'route-error'
  retry: WorkflowRetryPolicy
  idempotency: 'disabled' | 'required' | 'supported'
}

export type WorkflowTriggerType =
  | 'api'
  | 'event'
  | 'manual'
  | 'schedule'
  | 'webhook'

export interface WorkflowTrigger {
  id: string
  type: WorkflowTriggerType
  enabled: boolean
  config: Record<string, JsonValue>
}

export interface WorkflowDeploymentPolicy {
  environments: string[]
  strategy: 'immutable-version' | 'replace'
  approvalRequired: boolean
}

export interface WorkflowObservabilityPolicy {
  logLevel: 'debug' | 'error' | 'info' | 'warning'
  tracing: boolean
  metrics: boolean
  retentionDays: number
  redact: string[]
}

export interface WorkflowNodeRuntimePolicy {
  timeoutMs?: number
  retry?: Partial<WorkflowRetryPolicy>
  continueOnError?: boolean
}

export type WorkflowLifecycleStatus =
  | 'archived'
  | 'deprecated'
  | 'draft'
  | 'published'

export interface WorkflowMetadata {
  owner: string
  team?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  changelog?: string
}

export interface WorkflowSchemaNode {
  id: string
  type: WorkflowNodeKind
  version: string
  name: string
  description?: string
  disabled?: boolean
  config: Record<string, JsonValue>
  inputBindings: Record<string, WorkflowValueBinding>
  /** Derived adjacency index. `edges` remains the topology source of truth. */
  next: string[]
  prev: string[]
  runtime?: WorkflowNodeRuntimePolicy
  metadata?: Record<string, JsonValue>
}

export type WorkflowEdgeKind = 'branch' | 'error' | 'flow' | 'loop'

export interface WorkflowSchemaEdge {
  id: string
  source: string
  target: string
  sourcePort?: string
  targetPort?: string
  kind: WorkflowEdgeKind
  label?: string
  condition?: WorkflowValueBinding
  priority?: number
}

export interface WorkflowEditorNodeState {
  position: { x: number; y: number }
  collapsed?: boolean
}

export interface WorkflowEditorMetadata {
  nodes: Record<string, WorkflowEditorNodeState>
  viewport?: { x: number; y: number; zoom: number }
}

export interface WorkflowJsonSchema {
  $schema: string
  dslVersion: typeof WORKFLOW_DSL_VERSION
  id: string
  key: string
  version: string
  revision: number
  title: string
  description: string
  status: WorkflowLifecycleStatus
  namespace: string
  entrypoint: string
  triggers: WorkflowTrigger[]
  interface: WorkflowInterface
  variables: WorkflowVariableDeclaration[]
  resources: WorkflowResourceReference[]
  permissions: WorkflowPermissionPolicy
  policies: WorkflowRuntimePolicy
  deployment: WorkflowDeploymentPolicy
  observability: WorkflowObservabilityPolicy
  metadata: WorkflowMetadata
  nodes: WorkflowSchemaNode[]
  edges: WorkflowSchemaEdge[]
  ui?: WorkflowEditorMetadata
  extensions?: Record<string, JsonValue>
}

export type WorkflowValidationSeverity = 'error' | 'info' | 'warning'

export interface WorkflowValidationIssue {
  code: string
  message: string
  severity: WorkflowValidationSeverity
  path: string
  nodeId?: string
  edgeId?: string
  suggestion?: string
}

export interface WorkflowValidationResult {
  valid: boolean
  issues: WorkflowValidationIssue[]
}

export interface WorkflowExecutionStep {
  id: string
  nodeId: string
  nodeType: WorkflowNodeKind
  nodeVersion: string
  name: string
  dependencies: string[]
  downstream: string[]
  stage: number
  config: Record<string, JsonValue>
  inputBindings: Record<string, WorkflowValueBinding>
  inputPorts: string[]
  outputPorts: string[]
  runtime: WorkflowNodeRuntimePolicy
  sideEffect: boolean
}

export interface WorkflowExecutionTransition {
  id: string
  sourceNodeId: string
  targetNodeId: string
  sourcePort?: string
  targetPort?: string
  kind: WorkflowEdgeKind
  condition?: WorkflowValueBinding
  priority?: number
}

export interface WorkflowExecutionStage {
  index: number
  stepIds: string[]
}

export interface WorkflowExecutionPlan {
  id: string
  workflowId: string
  workflowVersion: string
  revision: number
  compiledAt: string
  entrypoint: string
  startNodeId: string
  steps: WorkflowExecutionStep[]
  stages: WorkflowExecutionStage[]
  transitions: WorkflowExecutionTransition[]
  outputNodes: string[]
  variables: Record<string, JsonValue>
  resources: WorkflowResourceReference[]
  policies: WorkflowRuntimePolicy
  observability: WorkflowObservabilityPolicy
  validation: WorkflowValidationResult
}

export type WorkflowRunStatus =
  | 'cancelled'
  | 'failed'
  | 'idle'
  | 'paused'
  | 'running'
  | 'success'

export type WorkflowNodeRunStatus =
  | 'cancelled'
  | 'failed'
  | 'idle'
  | 'paused'
  | 'queued'
  | 'running'
  | 'skipped'
  | 'success'

export interface WorkflowNodeExecution {
  id: string
  runId: string
  nodeId: string
  nodeType: WorkflowNodeKind
  name: string
  status: WorkflowNodeRunStatus
  attempt: number
  startedAt?: string
  finishedAt?: string
  durationMs?: number
  input?: JsonValue
  output?: JsonValue
  error?: { code: string; message: string; retryable: boolean }
}

export interface WorkflowRunEvent {
  id: string
  runId: string
  timestamp: string
  type:
    | 'log'
    | 'node-completed'
    | 'node-failed'
    | 'node-paused'
    | 'node-skipped'
    | 'node-started'
    | 'run-cancelled'
    | 'run-completed'
    | 'run-failed'
    | 'run-started'
  level: 'debug' | 'error' | 'info' | 'success' | 'warning'
  message: string
  nodeId?: string
  execution?: WorkflowNodeExecution
  data?: JsonValue
}

export interface WorkflowRunResult {
  id: string
  planId: string
  status: WorkflowRunStatus
  startedAt: string
  finishedAt: string
  durationMs: number
  input: JsonValue
  output?: JsonValue
  executions: WorkflowNodeExecution[]
  events: WorkflowRunEvent[]
}
