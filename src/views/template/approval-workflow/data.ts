import type {
  ApprovalAssigneeConfig,
  ApprovalFieldPermission,
  ApprovalFormField,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalNodeType,
  ApprovalPaletteItem,
  ApprovalTemplateItem,
  ApprovalTimeoutRule,
  ApprovalUserRef,
  ApprovalWorkflowSchema,
} from './types'

// SIZE_OK: local sample users, palettes, templates, and typed node factories stay
// together so the workflow designer can render a complete offline preview.
export const approvalUsers: ApprovalUserRef[] = [
  { id: 'u-001', name: '张敏', dept: '销售一部' },
  { id: 'u-002', name: '李航', dept: '财务部' },
  { id: 'u-003', name: '王珂', dept: '行政部' },
  { id: 'u-004', name: '赵宁', dept: '总经办' },
  { id: 'u-005', name: '周明', dept: '人力资源' },
]

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
  mode: 'supervisor',
  users: [approvalUsers[0]],
  roles: ['部门主管'],
  supervisorLevel: 1,
  multiMode: 'sequential',
  percent: 100,
  emptyStrategy: 'admin',
  allowSelfApproval: false,
  deduplicate: true,
}

const defaultTimeout: ApprovalTimeoutRule = {
  enabled: true,
  hours: 24,
  remindEveryHours: 4,
  escalateTo: [approvalUsers[3]],
  autoAction: 'transferAdmin',
}

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

function createNodeConfig(type: ApprovalNodeType): ApprovalNodeConfig {
  return {
    assignee: {
      ...defaultAssignee,
      mode: type === 'cc' ? 'user' : defaultAssignee.mode,
      users: type === 'cc' ? [approvalUsers[2]] : [...defaultAssignee.users],
      roles: [...defaultAssignee.roles],
    },
    actions:
      type === 'cc'
        ? ['comment']
        : ['agree', 'reject', 'transfer', 'addSigner', 'rollback', 'comment'],
    conditionRules: [],
    fieldPermissions: defaultFieldPermissions.map((item) => ({ ...item })),
    timeout: {
      ...defaultTimeout,
      escalateTo: [...defaultTimeout.escalateTo],
    },
    ccUsers: type === 'cc' ? [approvalUsers[2]] : [],
    formRequiredFields: approvalFormFields
      .filter((field) => field.required)
      .map((field) => field.key),
    messageTemplate: '您有一条审批任务待处理：${workflowName}',
    webhookUrl: '',
    subProcessId: '',
    script: 'return { approved: true }',
  }
}

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

export const initialApprovalSchema: ApprovalWorkflowSchema = {
  $schema: 'https://wuhu.dev/schemas/approval-workflow/v1.json',
  settings: {
    id: 'approval-expense-v1',
    name: '报销与请假审批',
    group: '行政人事',
    version: '1.0.0',
    state: 'draft',
    description:
      '覆盖发起、主管审批、条件分支、财务复核、抄送和归档的数据化审批流。',
    allowRevoke: true,
    allowResubmit: true,
    allowUrge: true,
    enableWatermark: true,
    enableSignature: true,
    notifyChannels: ['钉钉工作通知', '待办', '短信提醒'],
    adminUsers: [approvalUsers[3]],
  },
  formFields: approvalFormFields,
  nodes: [
    {
      ...createApprovalNode('start', '发起人提交'),
      id: 'start',
      icon: 'i-lucide:play-circle',
      accent: '#1677ff',
      required: true,
      description: '校验必填字段、发起权限和重复提交策略',
    },
    {
      ...createApprovalNode('approver', '直属主管审批'),
      id: 'manager-approval',
      config: {
        ...createNodeConfig('approver'),
        assignee: {
          ...defaultAssignee,
          mode: 'supervisor',
          supervisorLevel: 1,
          multiMode: 'sequential',
        },
      },
    },
    {
      ...createApprovalNode('condition', '金额/天数条件'),
      id: 'amount-condition',
      branches: [
        {
          id: 'branch-high',
          title: '金额 >= 5000 或请假 >= 3 天',
          priority: 1,
          rules: [
            {
              id: 'rule-amount',
              field: 'amount',
              label: '报销金额',
              operator: 'gte',
              value: '5000',
            },
            {
              id: 'rule-leave',
              field: 'leaveDays',
              label: '请假天数',
              operator: 'gte',
              value: '3',
            },
          ],
          nodes: [
            {
              ...createApprovalNode('approver', '总监审批'),
              id: 'director-approval',
              config: {
                ...createNodeConfig('approver'),
                assignee: {
                  ...defaultAssignee,
                  mode: 'role',
                  roles: ['中心总监'],
                  users: [approvalUsers[3]],
                  multiMode: 'parallelAll',
                },
              },
            },
            {
              ...createApprovalNode('approver', '财务复核'),
              id: 'finance-review',
              config: {
                ...createNodeConfig('approver'),
                assignee: {
                  ...defaultAssignee,
                  mode: 'user',
                  users: [approvalUsers[1]],
                },
              },
            },
          ],
        },
        {
          id: 'branch-normal',
          title: '默认路径',
          priority: 99,
          rules: [],
          nodes: [
            {
              ...createApprovalNode('cc', '行政抄送'),
              id: 'admin-cc',
              config: {
                ...createNodeConfig('cc'),
                ccUsers: [approvalUsers[2], approvalUsers[4]],
              },
            },
          ],
        },
      ],
    },
    {
      ...createApprovalNode('data', '写入业务台账'),
      id: 'write-ledger',
      description: '审批通过后写入报销/请假台账并通知业务系统',
    },
    {
      ...createApprovalNode('end', '流程结束'),
      id: 'end',
      icon: 'i-lucide:check-circle-2',
      accent: '#52c41a',
      required: true,
      description: '归档审批记录、操作日志和电子签名',
    },
  ],
}

export const approvalTemplates: ApprovalTemplateItem[] = [
  {
    id: 'expense',
    title: '费用报销',
    description: '主管审批 + 金额条件 + 财务复核 + 抄送',
    icon: 'i-lucide:receipt-text',
    nodes: initialApprovalSchema.nodes,
  },
  {
    id: 'leave',
    title: '请假审批',
    description: '发起人自选交接人，按请假天数走主管/总监审批',
    icon: 'i-lucide:calendar-days',
    nodes: [
      { ...createApprovalNode('start', '提交请假') },
      { ...createApprovalNode('approver', '直属主管审批') },
      { ...createApprovalNode('condition', '请假天数分支') },
      { ...createApprovalNode('cc', 'HR 抄送') },
      { ...createApprovalNode('end', '结束') },
    ],
  },
  {
    id: 'purchase',
    title: '采购申请',
    description: '并行法务/财务评审，调用合同子流程',
    icon: 'i-lucide:shopping-cart',
    nodes: [
      { ...createApprovalNode('start', '提交采购') },
      { ...createApprovalNode('parallel', '并行评审') },
      { ...createApprovalNode('subProcess', '合同子流程') },
      { ...createApprovalNode('data', '生成采购单') },
      { ...createApprovalNode('end', '结束') },
    ],
  },
]

export const approvalCapabilityChecklist = [
  '发起权限、必填校验、撤回/重新提交',
  '审批人：指定人、主管、连续多级主管、角色、表单联系人、发起人自选',
  '多人审批：依次、会签、或签、百分比通过',
  '条件分支、并行分支、默认分支、优先级',
  '办理人、抄送人、消息通知、子流程、数据动作',
  '字段权限：可见、只读、可编辑、隐藏',
  '超时提醒、催办、升级、空审批人策略',
  '转交、加签、退回、评论、电子签名与水印',
  '流程校验、模拟测试、版本发布、Schema 导入导出',
]
