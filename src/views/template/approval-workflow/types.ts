export type ApprovalNodeType =
  | 'start'
  | 'approver'
  | 'handler'
  | 'cc'
  | 'condition'
  | 'parallel'
  | 'subProcess'
  | 'data'
  | 'script'
  | 'message'
  | 'end'

export type ApprovalAssigneeMode =
  | 'initiator'
  | 'initiatorSelect'
  | 'supervisor'
  | 'departmentSupervisor'
  | 'role'
  | 'user'
  | 'formUser'
  | 'continuousSupervisor'

export type ApprovalMultiMode =
  | 'sequential'
  | 'parallelAll'
  | 'parallelAny'
  | 'percent'
export type EmptyApproverStrategy = 'autoPass' | 'admin' | 'error'
export type FieldPermissionMode = 'readonly' | 'editable' | 'hidden'
export type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'between'
export type ApprovalActionKey =
  | 'agree'
  | 'reject'
  | 'transfer'
  | 'addSigner'
  | 'rollback'
  | 'comment'
export type ApprovalValidationLevel = 'error' | 'warning' | 'success'
export type ApprovalPublishState = 'draft' | 'testing' | 'published'

export interface ApprovalUserRef {
  id: string
  name: string
  avatar?: string
  dept?: string
}

export interface ApprovalFieldPermission {
  field: string
  label: string
  mode: FieldPermissionMode
}

export interface ApprovalConditionRule {
  id: string
  field: string
  label: string
  operator: ConditionOperator
  value: string
  secondValue?: string
}

export interface ApprovalTimeoutRule {
  enabled: boolean
  hours: number
  remindEveryHours: number
  escalateTo: ApprovalUserRef[]
  autoAction: 'none' | 'autoPass' | 'autoReject' | 'transferAdmin'
}

export interface ApprovalAssigneeConfig {
  mode: ApprovalAssigneeMode
  users: ApprovalUserRef[]
  roles: string[]
  formField?: string
  supervisorLevel: number
  multiMode: ApprovalMultiMode
  percent: number
  emptyStrategy: EmptyApproverStrategy
  allowSelfApproval: boolean
  deduplicate: boolean
}

export interface ApprovalNodeConfig {
  assignee: ApprovalAssigneeConfig
  actions: ApprovalActionKey[]
  conditionRules: ApprovalConditionRule[]
  fieldPermissions: ApprovalFieldPermission[]
  timeout: ApprovalTimeoutRule
  ccUsers: ApprovalUserRef[]
  formRequiredFields: string[]
  messageTemplate: string
  webhookUrl: string
  subProcessId: string
  script: string
}

export interface ApprovalNode {
  id: string
  type: ApprovalNodeType
  title: string
  description: string
  icon: string
  accent: string
  required: boolean
  config: ApprovalNodeConfig
  children?: ApprovalNode[]
  branches?: ApprovalBranch[]
}

export interface ApprovalBranch {
  id: string
  title: string
  priority: number
  rules: ApprovalConditionRule[]
  nodes: ApprovalNode[]
}

export interface ApprovalFormField {
  key: string
  label: string
  type: 'text' | 'number' | 'money' | 'date' | 'user' | 'department' | 'select'
  required: boolean
}

export interface ApprovalWorkflowSettings {
  id: string
  name: string
  group: string
  version: string
  state: ApprovalPublishState
  description: string
  allowRevoke: boolean
  allowResubmit: boolean
  allowUrge: boolean
  enableWatermark: boolean
  enableSignature: boolean
  notifyChannels: string[]
  adminUsers: ApprovalUserRef[]
}

export interface ApprovalWorkflowSchema {
  $schema: string
  settings: ApprovalWorkflowSettings
  formFields: ApprovalFormField[]
  nodes: ApprovalNode[]
}

export interface ApprovalPaletteItem {
  type: ApprovalNodeType
  title: string
  description: string
  icon: string
  accent: string
}

export interface ApprovalTemplateItem {
  id: string
  title: string
  description: string
  icon: string
  nodes: ApprovalNode[]
}

export interface ApprovalValidationIssue {
  id: string
  level: ApprovalValidationLevel
  title: string
  description: string
  nodeId?: string
}

export interface ApprovalSimulationInput {
  amount: number
  leaveDays: number
  department: string
  applicant: string
  assetType: string
}

export interface ApprovalSimulationStep {
  nodeId: string
  title: string
  status: 'pending' | 'passed' | 'skipped'
  actor: string
  reason: string
}
