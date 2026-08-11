export type WorkflowDefinitionStatus = 'disabled' | 'draft' | 'published'

export type WorkflowRunStatus =
  | 'failed'
  | 'running'
  | 'success'
  | 'suspended'
  | 'terminated'

export type WorkflowStepStatus =
  | 'failed'
  | 'pending'
  | 'running'
  | 'skipped'
  | 'success'

export type WorkflowAlertSeverity = 'critical' | 'info' | 'warning'

export interface WorkflowOwner {
  id: string
  name: string
  department: string
}

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  category: string
  status: WorkflowDefinitionStatus
  version: string
  icon: string
  owner: WorkflowOwner
  trigger: string
  nodeCount: number
  runCount: number
  successRate: number
  averageDuration: string
  createdAt: string
  updatedAt: string
  lastRunAt?: string
}

export interface WorkflowRunStep {
  id: string
  name: string
  type: string
  status: WorkflowStepStatus
  startedAt?: string
  duration?: string
  detail: string
}

export interface WorkflowRunInstance {
  id: string
  traceId: string
  workflowId: string
  workflowName: string
  version: string
  status: WorkflowRunStatus
  environment: 'production' | 'staging'
  trigger: string
  initiator: string
  currentNode: string
  progress: number
  startedAt: string
  finishedAt?: string
  duration: string
  retries: number
  steps: WorkflowRunStep[]
}

export interface WorkflowAlert {
  id: string
  severity: WorkflowAlertSeverity
  title: string
  message: string
  workflowName: string
  instanceId: string
  createdAt: string
  acknowledged: boolean
}

export interface WorkflowThroughputPoint {
  label: string
  success: number
  failed: number
}

export interface WorkflowLatencyRank {
  node: string
  workflowName: string
  duration: number
  unit: 'ms' | 's'
}
