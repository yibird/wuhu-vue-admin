import type { Edge, Node, XYPosition } from '@vue-flow/core'

export type WorkflowNodeKind =
  | 'start'
  | 'llm'
  | 'agent'
  | 'knowledge'
  | 'condition'
  | 'code'
  | 'plugin'
  | 'http'
  | 'database'
  | 'variable'
  | 'loop'
  | 'delay'
  | 'approval'
  | 'parallel'
  | 'subflow'
  | 'webhook'
  | 'message'
  | 'end'

export type WorkflowFlowNodeType = `workflow-${WorkflowNodeKind}`

export type WorkflowNodeStatus = 'idle' | 'running' | 'success' | 'warning'

export type WorkflowPaletteGroup = 'control' | 'data' | 'model' | 'tool'

export type WorkflowCanvasTab = 'design' | 'test' | 'log'

export interface WorkflowNodePort {
  name: string
  type: string
}

export interface WorkflowNodeData {
  kind: WorkflowNodeKind
  title: string
  description: string
  icon: string
  accent: string
  status: WorkflowNodeStatus
  model?: string
  latency?: string
  tokens?: string
  config?: Record<string, unknown>
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

export interface WorkflowSchemaNode {
  id: string
  type: WorkflowNodeKind
  title: string
  description?: string
  position?: XYPosition
  status?: WorkflowNodeStatus
  model?: string
  latency?: string
  tokens?: string
  icon?: string
  accent?: string
  config?: Record<string, unknown>
  inputs?: WorkflowNodePort[]
  outputs?: WorkflowNodePort[]
}

export interface WorkflowSchemaEdge {
  id?: string
  source: string
  target: string
  label?: string
  animated?: boolean
}

export interface WorkflowJsonSchema {
  $schema: string
  version: string
  title: string
  description: string
  nodes: WorkflowSchemaNode[]
  edges: WorkflowSchemaEdge[]
}

export type WorkflowContextTargetType = 'edge' | 'node' | 'pane'

export type WorkflowContextActionKey =
  | 'add-after'
  | 'add-node'
  | 'copy'
  | 'delete'
  | 'duplicate'
  | 'export-node'
  | 'run-from'
  | `add-${WorkflowNodeKind}`

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
  level: 'info' | 'success' | 'warning'
  nodeId: string
  title: string
  message: string
}
