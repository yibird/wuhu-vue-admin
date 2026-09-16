import type { Edge, Node, XYPosition } from '@vue-flow/core'
import type {
  JsonValue,
  WorkflowNodeConfigFieldSchema,
  WorkflowNodeKind,
  WorkflowValidationIssue,
  WorkflowValueBinding,
} from '../domain'

export type {
  JsonValue,
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
  gradient: [string, string]
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
  gradient: [string, string]
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
  | 'add-node'
  | 'copy'
  | 'delete'
  | 'duplicate'
  | 'export-node'
  | 'run-from'
  | 'test-node'
  | 'toggle-breakpoint'
  | `add-${WorkflowNodeKind}`
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
