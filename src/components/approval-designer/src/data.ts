import type {
  ApprovalAssigneeConfig,
  ApprovalFieldPermission,
  ApprovalFormField,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalNodeType,
  ApprovalPaletteItem,
  ApprovalTimeoutRule,
  ApprovalWorkflowExtensions,
  ApprovalWorkflowSchema,
} from './types'

/** 内置审批表单字段 */
export const approvalFormFields: ApprovalFormField[] = [
  { key: 'applicant', label: '申请人', type: 'user', required: true },
  { key: 'department', label: '所在部门', type: 'department', required: true },
  { key: 'amount', label: '报销金额', type: 'money', required: true },
  { key: 'leaveDays', label: '请假天数', type: 'number', required: false },
  { key: 'assetType', label: '资产类型', type: 'select', required: false },
  { key: 'reason', label: '申请事由', type: 'text', required: true },
  { key: 'attachment', label: '附件', type: 'text', required: false },
]

const defaultFieldPermissions: ApprovalFieldPermission[] =
  approvalFormFields.map((field) => ({
    field: field.key,
    label: field.label,
    mode: field.required ? 'readonly' : 'editable',
  }))

const defaultAssignee: ApprovalAssigneeConfig = {
  mode: 'initiatorSelect',
  users: [],
  roles: [],
  supervisorLevel: 1,
  multiMode: 'sequential',
  percent: 100,
  emptyStrategy: 'admin',
  allowSelfApproval: false,
  deduplicate: true,
}

const defaultTimeout: ApprovalTimeoutRule = {
  enabled: false,
  hours: 24,
  remindEveryHours: 4,
  escalateTo: [],
  autoAction: 'none',
}

/** 节点面板 */
export const approvalPalette: ApprovalPaletteItem[] = [
  {
    type: 'approver',
    title: '审批人',
    description: '指定成员、主管、角色、表单联系人或发起人自选',
    icon: 'i-lucide:user-check',
    accent: '#1677ff',
  },
  {
    type: 'handler',
    title: '办理人',
    description: '审批通过后补充处理业务动作',
    icon: 'i-lucide:clipboard-check',
    accent: '#13c2c2',
  },
  {
    type: 'cc',
    title: '抄送人',
    description: '流程到达时通知相关人',
    icon: 'i-lucide:send',
    accent: '#722ed1',
  },
  {
    type: 'condition',
    title: '条件分支',
    description: '按金额、天数、部门等字段分流',
    icon: 'i-lucide:git-branch',
    accent: '#fa8c16',
  },
  {
    type: 'parallel',
    title: '并行分支',
    description: '多条线同时审批，全部完成后汇合',
    icon: 'i-lucide:git-fork',
    accent: '#eb2f96',
  },
  {
    type: 'subProcess',
    title: '子流程',
    description: '调用采购、合同、人事等复用流程',
    icon: 'i-lucide:workflow',
    accent: '#2f54eb',
  },
  {
    type: 'data',
    title: '数据动作',
    description: '写入业务系统、更新状态或生成单据',
    icon: 'i-lucide:database-zap',
    accent: '#52c41a',
  },
  {
    type: 'message',
    title: '消息通知',
    description: '钉钉、站内、邮件等通知模板',
    icon: 'i-lucide:message-square-more',
    accent: '#0891b2',
  },
]

/**
 * 创建节点默认配置
 * @param type 节点类型
 * @returns 节点配置
 */
export function createNodeConfig(type: ApprovalNodeType): ApprovalNodeConfig {
  return {
    assignee: {
      ...defaultAssignee,
      mode: type === 'cc' ? 'user' : defaultAssignee.mode,
      users: [],
      roles: [],
    },
    actions:
      type === 'cc'
        ? ['comment']
        : ['agree', 'reject', 'transfer', 'addSigner', 'rollback', 'comment'],
    conditionRules: [],
    fieldPermissions: defaultFieldPermissions.map((item) => ({ ...item })),
    timeout: {
      ...defaultTimeout,
      escalateTo: [],
    },
    ccUsers: [],
    formRequiredFields: approvalFormFields
      .filter((field) => field.required)
      .map((field) => field.key),
    messageTemplate: '您有一条审批任务待处理：${workflowName}',
    webhookUrl: '',
    subProcessId: '',
    script: 'return { approved: true }',
  }
}

/**
 * 创建审批节点
 * @param type 节点类型
 * @param title 节点标题
 * @returns 审批节点
 */
export function createApprovalNode(
  type: ApprovalNodeType,
  title?: string
): ApprovalNode {
  const palette = approvalPalette.find((item) => item.type === type)
  const fallback = {
    title: title ?? '审批节点',
    description: '配置审批规则',
    icon: 'i-lucide:circle',
    accent: '#1677ff',
  }

  return {
    id: `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title: title ?? palette?.title ?? fallback.title,
    description: palette?.description ?? fallback.description,
    icon: palette?.icon ?? fallback.icon,
    accent: palette?.accent ?? fallback.accent,
    required: type === 'start' || type === 'end',
    config: createNodeConfig(type),
  }
}

/**
 * 创建扩展配置默认值
 * @returns 扩展配置
 */
export function createDefaultApprovalExtensions(): ApprovalWorkflowExtensions {
  return {
    roleFieldPermissions: approvalFormFields.map((field) => ({
      role: 'applicant',
      field: field.key,
      mode: field.required ? 'readonly' : 'editable',
      required: field.required,
    })),
    notifications: {
      channels: ['站内信'],
      onSubmit: true,
      onPending: true,
      onApproved: true,
      onRejected: true,
      onCc: true,
      onTimeout: true,
    },
    timeout: {
      enabled: false,
      hours: 24,
      remindEveryHours: 4,
      escalation: 'admin',
    },
    exception: {
      emptyApprover: 'admin',
      duplicateApprover: 'dedupe',
      nodeFailure: 'pause',
    },
    initiation: {
      allowRevoke: true,
      allowResubmit: true,
      maxResubmitCount: 3,
      allowUrge: true,
      allowTerminate: false,
    },
    dataPermission: {
      dataScope: 'self',
      adminUserIds: [],
    },
    automation: [],
  }
}

/**
 * 创建一份可直接编辑的空审批流
 * @returns 审批流 Schema
 */
export function createEmptyApprovalSchema(): ApprovalWorkflowSchema {
  return {
    $schema: 'https://wuhu.dev/schemas/approval-workflow/v1.json',
    settings: {
      id: '',
      name: '未命名审批流',
      group: '默认分组',
      version: '0.1.0',
      state: 'draft',
      description: '',
      allowRevoke: true,
      allowResubmit: true,
      allowUrge: true,
      enableWatermark: false,
      enableSignature: false,
      notifyChannels: ['站内信'],
      adminUsers: [],
    },
    formFields: approvalFormFields,
    extensions: createDefaultApprovalExtensions(),
    nodes: [
      {
        ...createApprovalNode('start', '发起人'),
        id: 'start',
        required: true,
        icon: 'i-lucide:play-circle',
        accent: '#1677ff',
      },
      {
        ...createApprovalNode('approver', '审批人'),
        id: 'approver',
        required: false,
      },
      {
        ...createApprovalNode('end', '结束'),
        id: 'end',
        required: true,
        icon: 'i-lucide:check-circle-2',
        accent: '#52c41a',
      },
    ],
  }
}
