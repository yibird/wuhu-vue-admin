import dayjs from 'dayjs'

import type {
  MilestoneStatus,
  ProjectMemberRole,
  ProjectPriority,
  ProjectStatus,
  ProjectTaskStatus,
} from '@/apis'

export interface OptionMeta {
  /**
   * @desc 展示文案
   */
  label: string
  /**
   * @desc a-tag 颜色
   */
  color: string
}

export const projectStatusOptions = [
  { label: '未开始', value: 0 },
  { label: '进行中', value: 1 },
  { label: '已完成', value: 2 },
  { label: '已归档', value: 3 },
] as const

export const projectStatusMeta: Record<ProjectStatus, OptionMeta> = {
  0: { label: '未开始', color: 'default' },
  1: { label: '进行中', color: 'processing' },
  2: { label: '已完成', color: 'success' },
  3: { label: '已归档', color: 'default' },
}

export const priorityOptions = [
  { label: '低', value: 1 },
  { label: '中', value: 2 },
  { label: '高', value: 3 },
] as const

export const priorityMeta: Record<ProjectPriority, OptionMeta> = {
  1: { label: '低', color: 'default' },
  2: { label: '中', color: 'warning' },
  3: { label: '高', color: 'error' },
}

export const taskStatusOptions = [
  { label: '待处理', value: 0 },
  { label: '进行中', value: 1 },
  { label: '已完成', value: 2 },
] as const

export const taskStatusMeta: Record<ProjectTaskStatus, OptionMeta> = {
  0: { label: '待处理', color: 'default' },
  1: { label: '进行中', color: 'processing' },
  2: { label: '已完成', color: 'success' },
}

export const milestoneStatusOptions = [
  { label: '待达成', value: 0 },
  { label: '已达成', value: 1 },
  { label: '已延期', value: 2 },
] as const

export const milestoneStatusMeta: Record<MilestoneStatus, OptionMeta> = {
  0: { label: '待达成', color: 'default' },
  1: { label: '已达成', color: 'success' },
  2: { label: '已延期', color: 'error' },
}

export const memberRoleOptions = [
  { label: '负责人', value: 'owner' },
  { label: '管理员', value: 'manager' },
  { label: '成员', value: 'member' },
] as const

export const memberRoleMeta: Record<ProjectMemberRole, OptionMeta> = {
  owner: { label: '负责人', color: 'processing' },
  manager: { label: '管理员', color: 'warning' },
  member: { label: '成员', color: 'default' },
}

/**
 * @param value ISO 时间或日期字符串
 * @returns YYYY-MM-DD 文本
 */
export function formatDate(value?: string) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-'
}

/**
 * @param value ISO 时间字符串
 * @returns YYYY-MM-DD HH:mm 文本
 */
export function formatDateTime(value?: string) {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-'
}

/**
 * @param value 金额
 * @returns 千分位人民币文本
 */
export function formatMoney(value?: number) {
  if (value === undefined || value === null) return '-'
  return `¥${value.toLocaleString('zh-CN')}`
}

/**
 * 解析表单中的日期值
 * @param value Dayjs / 字符串
 * @returns YYYY-MM-DD,非法值返回 undefined
 */
export function toDateValue(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return dayjs(value).format('YYYY-MM-DD')
  const candidate = value as { format?: (template: string) => string }
  return typeof candidate.format === 'function'
    ? candidate.format('YYYY-MM-DD')
    : undefined
}

/**
 * 把 FormPlus 日期区间值拆成查询参数
 * @param value [开始, 结束]
 * @returns startDate / endDate
 */
export function resolveDateRange(value: unknown) {
  if (!Array.isArray(value)) return {}
  const startDate = toDateValue(value[0])
  const endDate = toDateValue(value[1])
  return {
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }
}
