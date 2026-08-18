import type {
  TicketCategory,
  TicketPriority,
  TicketRecord,
  TicketStatus,
} from './types'

interface TicketMeta<T extends string> {
  value: T
  label: string
  color: string
  icon: string
}

export const ticketStatusList: TicketMeta<TicketStatus>[] = [
  {
    value: 'pending',
    label: '待受理',
    color: 'gold',
    icon: 'i-lucide:inbox',
  },
  {
    value: 'processing',
    label: '处理中',
    color: 'blue',
    icon: 'i-lucide:loader-circle',
  },
  {
    value: 'waiting',
    label: '待补充',
    color: 'orange',
    icon: 'i-lucide:message-circle-question',
  },
  {
    value: 'resolved',
    label: '已解决',
    color: 'green',
    icon: 'i-lucide:circle-check',
  },
  {
    value: 'closed',
    label: '已关闭',
    color: 'default',
    icon: 'i-lucide:archive',
  },
]

export const ticketPriorityList: TicketMeta<TicketPriority>[] = [
  {
    value: 'low',
    label: '低',
    color: 'default',
    icon: 'i-lucide:arrow-down',
  },
  {
    value: 'medium',
    label: '普通',
    color: 'blue',
    icon: 'i-lucide:minus',
  },
  {
    value: 'high',
    label: '高',
    color: 'orange',
    icon: 'i-lucide:arrow-up',
  },
  {
    value: 'urgent',
    label: '紧急',
    color: 'red',
    icon: 'i-lucide:chevrons-up',
  },
]

export const ticketCategoryList: TicketMeta<TicketCategory>[] = [
  {
    value: 'bug',
    label: '功能异常',
    color: 'red',
    icon: 'i-lucide:bug',
  },
  {
    value: 'feature',
    label: '产品建议',
    color: 'purple',
    icon: 'i-lucide:lightbulb',
  },
  {
    value: 'account',
    label: '账号权限',
    color: 'blue',
    icon: 'i-lucide:shield-user',
  },
  {
    value: 'performance',
    label: '性能问题',
    color: 'orange',
    icon: 'i-lucide:gauge',
  },
  {
    value: 'other',
    label: '其他',
    color: 'default',
    icon: 'i-lucide:circle-ellipsis',
  },
]

export const ticketStatusOptions = [
  { label: '全部状态', value: 'all' },
  ...ticketStatusList.map(({ label, value }) => ({ label, value })),
]

export const ticketPriorityOptions = [
  { label: '全部优先级', value: 'all' },
  ...ticketPriorityList.map(({ label, value }) => ({ label, value })),
]

export const ticketCategoryOptions = [
  { label: '全部类型', value: 'all' },
  ...ticketCategoryList.map(({ label, value }) => ({ label, value })),
]

export const ticketEnvironmentOptions = [
  { label: '生产环境', value: '生产环境' },
  { label: '测试环境', value: '测试环境' },
  { label: '本地环境', value: '本地环境' },
  { label: '不确定', value: '不确定' },
]

export function getTicketStatusMeta(status: TicketStatus) {
  return ticketStatusList.find((item) => item.value === status)!
}

export function getTicketPriorityMeta(priority: TicketPriority) {
  return ticketPriorityList.find((item) => item.value === priority)!
}

export function getTicketCategoryMeta(category: TicketCategory) {
  return ticketCategoryList.find((item) => item.value === category)!
}

const initialTickets: TicketRecord[] = [
  {
    id: 'TK-20260807-0168',
    subject: '暗黑模式下表格筛选浮层颜色异常',
    description:
      '切换到暗黑模式后，用户列表的筛选浮层仍然是白色背景，文字对比度较低。刷新页面后问题依旧存在。',
    category: 'bug',
    priority: 'high',
    status: 'processing',
    environment: '生产环境',
    contact: 'lin@example.com',
    reporter: '林越',
    assignee: '赵敏',
    team: '前端支持组',
    createdAt: '2026-08-07 09:32',
    updatedAt: '2026-08-07 11:18',
    acceptedAt: '2026-08-07 10:04',
    firstResponseAt: '2026-08-07 10:04',
    slaDueAt: '2026-08-07 13:32',
    slaStatus: 'breached',
    tags: ['主题', '暗黑模式'],
    replyCount: 2,
    activities: [
      {
        id: 'activity-0168-1',
        type: 'created',
        actor: '林越',
        content: '提交了工单',
        createdAt: '2026-08-07 09:32',
      },
      {
        id: 'activity-0168-2',
        type: 'assignment',
        actor: '客服调度',
        content: '分配给前端支持组 · 赵敏',
        createdAt: '2026-08-07 10:04',
        visibility: 'internal',
      },
      {
        id: 'activity-0168-3',
        type: 'internal-note',
        actor: '赵敏',
        content: '正在检查主题 token 的覆盖范围和浮层挂载节点。',
        createdAt: '2026-08-07 10:26',
        visibility: 'internal',
      },
      {
        id: 'activity-0168-4',
        type: 'reply',
        actor: '林越',
        content: '补充：角色管理页面也能复现。',
        createdAt: '2026-08-07 11:18',
      },
    ],
  },
  {
    id: 'TK-20260806-0142',
    subject: '希望文件管理支持批量下载',
    description: '项目资料较多，目前需要逐个下载，希望增加多选后打包下载。',
    category: 'feature',
    priority: 'medium',
    status: 'pending',
    environment: '生产环境',
    contact: 'zhou@example.com',
    reporter: '周宁',
    assignee: '待分配',
    team: '待分配',
    createdAt: '2026-08-06 16:45',
    updatedAt: '2026-08-06 16:45',
    slaDueAt: '2026-08-07 16:45',
    slaStatus: 'breached',
    tags: ['文件管理', '产品建议'],
    replyCount: 0,
    activities: [
      {
        id: 'activity-0142-1',
        type: 'created',
        actor: '周宁',
        content: '提交了工单',
        createdAt: '2026-08-06 16:45',
      },
    ],
  },
  {
    id: 'TK-20260806-0135',
    subject: '新成员无法查看客户标签',
    description:
      '已加入销售角色，但客户标签页面提示无权限，请确认角色授权是否完整。',
    category: 'account',
    priority: 'urgent',
    status: 'waiting',
    environment: '生产环境',
    contact: 'wang@example.com',
    reporter: '王晨',
    assignee: '陈杰',
    team: '平台支持组',
    createdAt: '2026-08-06 13:20',
    updatedAt: '2026-08-07 08:56',
    acceptedAt: '2026-08-06 13:42',
    firstResponseAt: '2026-08-06 13:48',
    slaDueAt: '2026-08-06 17:20',
    slaStatus: 'breached',
    waitingReason: '等待用户补充账号和所属部门',
    tags: ['权限', '客户标签'],
    replyCount: 1,
    activities: [
      {
        id: 'activity-0135-1',
        type: 'created',
        actor: '王晨',
        content: '提交了工单',
        createdAt: '2026-08-06 13:20',
      },
      {
        id: 'activity-0135-2',
        type: 'status',
        actor: '平台支持组',
        content: '需要补充该成员的账号和所属部门',
        createdAt: '2026-08-07 08:56',
      },
    ],
  },
  {
    id: 'TK-20260805-0109',
    subject: '数据分析页面首次加载较慢',
    description: '弱网环境下首屏需要等待较长时间，希望优化图表资源加载。',
    category: 'performance',
    priority: 'high',
    status: 'resolved',
    environment: '生产环境',
    contact: 'chen@example.com',
    reporter: '陈希',
    assignee: '孙悦',
    team: '性能专项组',
    createdAt: '2026-08-05 10:11',
    updatedAt: '2026-08-06 18:30',
    acceptedAt: '2026-08-05 10:30',
    firstResponseAt: '2026-08-05 10:36',
    resolvedAt: '2026-08-06 18:30',
    slaDueAt: '2026-08-06 10:11',
    slaStatus: 'breached',
    processingResult: '图表模块改为进入视口后加载，首屏不再下载图表运行时。',
    resolutionReason: '性能优化已发布并验证通过',
    tags: ['性能', '图表'],
    replyCount: 3,
    activities: [
      {
        id: 'activity-0109-1',
        type: 'created',
        actor: '陈希',
        content: '提交了工单',
        createdAt: '2026-08-05 10:11',
      },
      {
        id: 'activity-0109-2',
        type: 'status',
        actor: '性能专项组',
        content: '已完成图表模块延迟加载并发布修复',
        createdAt: '2026-08-06 18:30',
      },
    ],
  },
  {
    id: 'TK-20260804-0087',
    subject: '移动端菜单无法保持展开状态',
    description: '横屏切换回竖屏后菜单会自动收起，需要重新打开。',
    category: 'bug',
    priority: 'medium',
    status: 'closed',
    environment: '测试环境',
    contact: 'he@example.com',
    reporter: '何嘉',
    assignee: '赵敏',
    team: '前端支持组',
    createdAt: '2026-08-04 15:27',
    updatedAt: '2026-08-05 14:02',
    acceptedAt: '2026-08-04 15:41',
    firstResponseAt: '2026-08-04 15:47',
    resolvedAt: '2026-08-05 12:40',
    closedAt: '2026-08-05 14:02',
    slaDueAt: '2026-08-05 15:27',
    slaStatus: 'on-track',
    processingResult: '修复了屏幕方向切换时错误重置菜单状态的问题。',
    resolutionReason: '缺陷修复并通过移动端回归',
    closingReason: '用户确认问题已解决',
    tags: ['移动端', '菜单'],
    replyCount: 2,
    activities: [
      {
        id: 'activity-0087-1',
        type: 'created',
        actor: '何嘉',
        content: '提交了工单',
        createdAt: '2026-08-04 15:27',
      },
      {
        id: 'activity-0087-2',
        type: 'status',
        actor: '前端支持组',
        content: '问题已修复并关闭',
        createdAt: '2026-08-05 14:02',
      },
    ],
  },
]

export function createInitialTickets() {
  return initialTickets.map((ticket) => ({
    ...ticket,
    activities: ticket.activities.map((activity) => ({ ...activity })),
  }))
}
