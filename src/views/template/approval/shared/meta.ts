import dayjs from 'dayjs'
import type { ApprovalDefinitionState, ApprovalInstanceStatus } from '@/apis'

export interface ApprovalOptionMeta {
  /**
   * @desc 展示文案
   */
  label: string
  /**
   * @desc 标签颜色
   */
  color: string
}

export const definitionStateOptions = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已停用', value: 'disabled' },
] as const

export const definitionStateMeta: Record<
  ApprovalDefinitionState,
  ApprovalOptionMeta
> = {
  draft: { label: '草稿', color: 'default' },
  published: { label: '已发布', color: 'success' },
  disabled: { label: '已停用', color: 'warning' },
}

export const instanceStatusOptions = [
  { label: '运行中', value: 'running' },
  { label: '待审批', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' },
  { label: '已超时', value: 'timeout' },
  { label: '已终止', value: 'terminated' },
] as const

export const instanceStatusMeta: Record<
  ApprovalInstanceStatus,
  ApprovalOptionMeta
> = {
  running: { label: '运行中', color: 'processing' },
  pending: { label: '待审批', color: 'warning' },
  approved: { label: '已通过', color: 'success' },
  rejected: { label: '已驳回', color: 'error' },
  timeout: { label: '已超时', color: 'error' },
  terminated: { label: '已终止', color: 'default' },
}

/**
 * @param value ISO 时间字符串
 * @returns YYYY-MM-DD HH:mm 文本
 */
export function formatDateTime(value?: string) {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-'
}

/**
 * @param value 毫秒
 * @returns 可读耗时文本
 */
export function formatDuration(value?: number) {
  if (!value || value < 0) return '-'
  const hours = Math.floor(value / (60 * 60 * 1000))
  const minutes = Math.max(1, Math.round((value % (60 * 60 * 1000)) / 60000))
  if (hours <= 0) return `${minutes} 分钟`
  return `${hours} 小时 ${minutes} 分钟`
}
