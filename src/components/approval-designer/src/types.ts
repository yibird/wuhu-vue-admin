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

export type ApprovalFormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'money'
  | 'date'
  | 'datetime'
  | 'time'
  | 'user'
  | 'department'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'cascader'
  | 'switch'
  | 'slider'
  | 'color'
  | 'uploadFile'
  | 'uploadImage'
  | 'divider'

export interface ApprovalFormField {
  key: string
  label: string
  type: ApprovalFormFieldType
  required: boolean
  /**
   * @desc 输入占位提示
   */
  placeholder?: string
  /**
   * @desc 默认值
   */
  defaultValue?: string
  /**
   * @desc select/radio/checkbox/cascader 的可选项
   */
  options?: string[]
  /**
   * @desc 是否支持多选
   */
  multiple?: boolean
  /**
   * @desc 是否可清空
   */
  clearable?: boolean
  /**
   * @desc 是否禁用
   */
  disabled?: boolean
  /**
   * @desc 是否隐藏
   */
  hidden?: boolean
  /**
   * @desc 字段宽度
   */
  width?: 'full' | 'half'
  /**
   * @desc 预设类型标识(邮箱/手机号等)
   */
  preset?: string
}

/**
 * 扩展配置中的字段权限角色
 */
export type ApprovalPermissionRole = 'applicant' | 'approver' | 'handler'

export interface ApprovalRoleFieldPermission {
  role: ApprovalPermissionRole
  field: string
  mode: FieldPermissionMode
  required: boolean
}

export interface ApprovalNotificationSettings {
  channels: string[]
  onSubmit: boolean
  onPending: boolean
  onApproved: boolean
  onRejected: boolean
  onCc: boolean
  onTimeout: boolean
}

export interface ApprovalGlobalTimeoutSettings {
  enabled: boolean
  hours: number
  remindEveryHours: number
  escalation: 'none' | 'admin' | 'superior'
}

export interface ApprovalExceptionPolicy {
  emptyApprover: 'autoPass' | 'admin' | 'error'
  duplicateApprover: 'dedupe' | 'keep'
  nodeFailure: 'pause' | 'terminate' | 'retry'
}

export interface ApprovalInitiationRules {
  allowRevoke: boolean
  allowResubmit: boolean
  maxResubmitCount: number
  allowUrge: boolean
  allowTerminate: boolean
}

export interface ApprovalDataPermission {
  dataScope: 'self' | 'department' | 'all'
  adminUserIds: string[]
}

export type ApprovalAutomationTrigger = 'start' | 'nodeComplete' | 'end'
export type ApprovalAutomationType = 'webhook' | 'status'

export interface ApprovalAutomationAction {
  id: string
  name: string
  trigger: ApprovalAutomationTrigger
  type: ApprovalAutomationType
  target: string
  enabled: boolean
}

export interface ApprovalWorkflowExtensions {
  roleFieldPermissions: ApprovalRoleFieldPermission[]
  notifications: ApprovalNotificationSettings
  timeout: ApprovalGlobalTimeoutSettings
  exception: ApprovalExceptionPolicy
  initiation: ApprovalInitiationRules
  dataPermission: ApprovalDataPermission
  automation: ApprovalAutomationAction[]
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
  /**
   * @desc 扩展配置,旧版本 Schema 可缺省
   */
  extensions?: ApprovalWorkflowExtensions
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
