import type { Edge, Node, XYPosition } from '@vue-flow/core'
import type {
  JsonValue,
  WorkflowJsonSchema,
  WorkflowNodeConfigFieldSchema,
  WorkflowNodeKind,
  WorkflowValidationIssue,
  WorkflowValueBinding,
} from '../domain'

export type {
  JsonValue,
  WorkflowEdgeKind,
  WorkflowJsonSchema,
  WorkflowNodeConfigFieldSchema,
  WorkflowNodeKind,
  WorkflowSchemaEdge,
  WorkflowSchemaNode,
  WorkflowValidationIssue,
  WorkflowValueBinding,
} from '../domain'

export type WorkflowFlowNodeType = `workflow-${WorkflowNodeKind}`

export type WorkflowNodeStatus =
  | 'failed'
  | 'idle'
  | 'paused'
  | 'queued'
  | 'running'
  | 'skipped'
  | 'success'
  | 'warning'

export type WorkflowPaletteGroup =
  | 'ai'
  | 'basic'
  | 'data'
  | 'human'
  | 'integration'
  | 'logic'
  | 'workflow'

export type WorkflowCanvasTab = 'design' | 'test' | 'log'

export type WorkflowSourceStatus = 'error' | 'formatted' | 'synced'

export interface WorkflowNodePort {
  id: string
  name: string
  type: string
  required?: boolean
  multiple?: boolean
}

export interface WorkflowNodeData {
  kind: WorkflowNodeKind
  nodeVersion: string
  title: string
  description: string
  icon: string
  accent: string
  status: WorkflowNodeStatus
  breakpoint?: boolean
  model?: string
  latency?: string
  tokens?: string
  config: Record<string, JsonValue>
  configSchema: WorkflowNodeConfigFieldSchema[]
  inputBindings: Record<string, WorkflowValueBinding>
  inputs: WorkflowNodePort[]
  outputs: WorkflowNodePort[]
}

export interface WorkflowPaletteItem {
  kind: WorkflowNodeKind
  group: WorkflowPaletteGroup
  title: string
  description: string
  icon: string
  accent: string
}

export type WorkflowNode = Node<
  WorkflowNodeData,
  Record<string, never>,
  WorkflowFlowNodeType
> & {
  data: WorkflowNodeData
  type: WorkflowFlowNodeType
}

export type WorkflowEdge = Edge

export type WorkflowEditableField = 'description' | 'model' | 'title'

export type WorkflowContextTargetType = 'edge' | 'node' | 'pane'

export type WorkflowContextActionKey =
  | 'add-after'
  | 'add-condition'
  | 'add-node'
  | 'copy'
  | 'delete'
  | 'duplicate'
  | 'export-node'
  | 'run-from'
  | 'test-node'
  | 'toggle-breakpoint'
  | `add-kind-${WorkflowNodeKind}`
  | `add-group-${WorkflowPaletteGroup}`

export interface WorkflowContextMenuState {
  open: boolean
  x: number
  y: number
  flowPosition?: XYPosition
  targetId?: string
  targetType?: WorkflowContextTargetType
}

export interface WorkflowContextMenuAction {
  key: WorkflowContextActionKey
  label: string
  icon: string
  children?: WorkflowContextMenuAction[]
  danger?: boolean
  disabled?: boolean
}

export interface WorkflowTestCase {
  id: string
  title: string
  description: string
  input: string
  expected: string
  status: 'ready' | 'passed' | 'warning'
  duration: string
}

export interface WorkflowRunLog {
  id: string
  time: string
  level: 'error' | 'info' | 'success' | 'warning'
  nodeId: string
  title: string
  message: string
  input?: JsonValue
  output?: JsonValue
  durationMs?: number
}

export interface WorkflowBindingOption {
  label: string
  value: string
  kind: Extract<
    WorkflowValueBinding['kind'],
    'node-output' | 'variable' | 'workflow-input'
  >
  nodeId?: string
  port?: string
}

export interface WorkflowDebugState {
  breakpoints: Set<string>
  validationIssues: WorkflowValidationIssue[]
}

export type WorkflowAiRole = 'assistant' | 'user'

export interface WorkflowAiMessage {
  id: string
  role: WorkflowAiRole
  content: string
  createdAt: string
}

export interface WorkflowAiSuggestion {
  id: string
  title: string
  prompt: string
  icon: string
}

export interface WorkflowAiPlanNode {
  id: string
  kind: WorkflowNodeKind
  name: string
  icon: string
  accent: string
  /**
   * @desc 该节点所属的分支输出端口,例如 true / rejected
   */
  branch?: string
}

export interface WorkflowAiPlanEdge {
  id: string
  from: string
  to: string
  label: string
}

export interface WorkflowAiPlan {
  id: string
  /**
   * @desc 命中的模板标识,便于回显与埋点
   */
  templateId: string
  title: string
  summary: string
  /**
   * @desc 生成依据的要点,例如命中的模板与补充节点
   */
  highlights: string[]
  /**
   * @desc 可直接应用到画布的完整 DSL,已按分层算法写好坐标
   */
  schema: WorkflowJsonSchema
  nodes: WorkflowAiPlanNode[]
  edges: WorkflowAiPlanEdge[]
  /**
   * @desc 非阻断的校验提示,应用前展示给用户
   */
  warnings: WorkflowValidationIssue[]
}
