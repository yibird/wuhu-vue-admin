import {
  approvalFormFields,
  createApprovalNode,
  createNodeConfig,
} from '@/components/approval-designer'
import type {
  ApprovalAssigneeConfig,
  ApprovalTemplateItem,
  ApprovalTimeoutRule,
  ApprovalUserRef,
  ApprovalWorkflowSchema,
} from '@/components/approval-designer'

export const approvalUsers: ApprovalUserRef[] = [
  { id: 'u-001', name: '张敏', dept: '销售一部' },
  { id: 'u-002', name: '李航', dept: '财务部' },
  { id: 'u-003', name: '王珂', dept: '行政部' },
  { id: 'u-004', name: '赵宁', dept: '总经办' },
  { id: 'u-005', name: '周明', dept: '人力资源' },
]

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
        timeout: {
          ...defaultTimeout,
          escalateTo: [...defaultTimeout.escalateTo],
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
