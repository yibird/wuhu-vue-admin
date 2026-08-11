import type { TicketActivityType, TicketSlaStatus } from '../types'
import type { TicketQueueKey } from './types'

export const CURRENT_AGENT = '李明'
export const DEFAULT_TEAM = '平台支持组'

export const ticketQueueMeta: Array<{
  key: TicketQueueKey
  label: string
  icon: string
}> = [
  { key: 'all', label: '全部工单', icon: 'i-lucide:inbox' },
  { key: 'unassigned', label: '待分配', icon: 'i-lucide:user-round-plus' },
  { key: 'mine', label: '我的工单', icon: 'i-lucide:user-round-check' },
  { key: 'overdue', label: 'SLA 超时', icon: 'i-lucide:timer-off' },
  {
    key: 'waiting',
    label: '等待用户',
    icon: 'i-lucide:message-circle-question',
  },
  { key: 'resolved', label: '待关闭', icon: 'i-lucide:circle-check-big' },
]

export const supportTeamOptions = [
  { label: '平台支持组', value: '平台支持组' },
  { label: '前端支持组', value: '前端支持组' },
  { label: '性能专项组', value: '性能专项组' },
  { label: '产品支持组', value: '产品支持组' },
]

export const supportAgentsByTeam: Record<string, string[]> = {
  平台支持组: ['李明', '陈杰', '周倩'],
  前端支持组: ['赵敏', '李明', '许言'],
  性能专项组: ['孙悦', '周倩'],
  产品支持组: ['陈杰', '许言'],
}

export const waitingReasonOptions = [
  { label: '等待用户补充信息', value: '等待用户补充信息' },
  { label: '等待用户验证结果', value: '等待用户验证结果' },
  { label: '等待第三方反馈', value: '等待第三方反馈' },
  { label: '等待变更窗口', value: '等待变更窗口' },
]

export const resolutionReasonOptions = [
  { label: '缺陷已修复', value: '缺陷已修复' },
  { label: '配置已调整', value: '配置已调整' },
  { label: '已提供使用指导', value: '已提供使用指导' },
  { label: '需求已转产品评估', value: '需求已转产品评估' },
  { label: '重复工单', value: '重复工单' },
  { label: '无法复现', value: '无法复现' },
]

export const closingReasonOptions = [
  { label: '用户确认解决', value: '用户确认解决' },
  { label: '超过 3 个工作日无回复', value: '超过 3 个工作日无回复' },
  { label: '合并至其他工单', value: '合并至其他工单' },
  { label: '无效或重复请求', value: '无效或重复请求' },
]

export const slaStatusMeta: Record<
  TicketSlaStatus,
  { label: string; color: string; icon: string; textClass: string }
> = {
  'on-track': {
    label: 'SLA 正常',
    color: 'green',
    icon: 'i-lucide:timer',
    textClass: 'text-success',
  },
  'at-risk': {
    label: '即将超时',
    color: 'orange',
    icon: 'i-lucide:timer-reset',
    textClass: 'text-warning',
  },
  breached: {
    label: 'SLA 已超时',
    color: 'red',
    icon: 'i-lucide:timer-off',
    textClass: 'text-error',
  },
}

export const activityTypeMeta: Record<
  TicketActivityType,
  { label: string; icon: string; color: string }
> = {
  created: { label: '创建', icon: 'i-lucide:plus', color: 'blue' },
  reply: { label: '公开回复', icon: 'i-lucide:message-square', color: 'green' },
  'internal-note': {
    label: '内部备注',
    icon: 'i-lucide:lock-keyhole',
    color: 'orange',
  },
  status: { label: '状态变更', icon: 'i-lucide:refresh-cw', color: 'gray' },
  assignment: {
    label: '分配变更',
    icon: 'i-lucide:user-round-cog',
    color: 'gray',
  },
  priority: {
    label: '优先级变更',
    icon: 'i-lucide:signal-high',
    color: 'orange',
  },
  resolution: {
    label: '处理完成',
    icon: 'i-lucide:circle-check-big',
    color: 'green',
  },
}
