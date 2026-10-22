import { formatLogTime } from '../data'
import type { SysClientLogDetail, LogLevel } from '@/apis'
import type { LogDetailField, LogDetailGroup } from '../components'

/**
 * 日志级别展示配置
 */
export const clientLevelMeta: Record<
  LogLevel,
  {
    /**
     * @desc 级别名称
     */
    label: string
    /**
     * @desc 标签颜色
     */
    color: string
  }
> = {
  debug: { label: '调试', color: 'default' },
  info: { label: '信息', color: 'blue' },
  warn: { label: '警告', color: 'warning' },
  error: { label: '错误', color: 'error' },
}

/**
 * 日志级别下拉选项
 */
export const clientLevelOptions = (
  Object.keys(clientLevelMeta) as LogLevel[]
).map((value) => ({
  label: clientLevelMeta[value].label,
  value,
}))

/**
 * 取日志级别的展示配置
 *
 * 表格插槽里的 record 是 any,这里收敛一次类型并兜底未知级别
 *
 * @param level 日志级别
 */
export function resolveClientLevelMeta(level: LogLevel) {
  return clientLevelMeta[level] ?? clientLevelMeta.info
}

/**
 * 组装客户端日志详情的基本信息
 *
 * @param detail 日志详情
 */
export function createClientDetailFields(
  detail?: SysClientLogDetail
): LogDetailField[] {
  if (!detail) return []

  return [
    { label: '日志 ID', value: detail.id },
    { label: 'Trace ID', value: detail.traceId },
    { label: '日志级别', value: resolveClientLevelMeta(detail.level).label },
    { label: '来源模块', value: detail.source },
    { label: '登录账号', value: detail.username },
    { label: '上报时间', value: formatLogTime(detail.logAt) },
    { label: '来源 IP', value: detail.ip },
    { label: '归属地', value: detail.location },
    { label: '浏览器', value: detail.browser },
    { label: '终端系统', value: detail.os },
    { label: '页面地址', value: detail.url, span: 2 },
    { label: '日志内容', value: detail.message, span: 2 },
  ]
}

/**
 * 组装客户端日志详情的 JSON 分块
 *
 * @param detail 日志详情
 */
export function createClientDetailGroups(
  detail?: SysClientLogDetail
): LogDetailGroup[] {
  if (!detail) return []

  return [
    {
      title: '上报数据',
      tabs: [
        { key: 'error', label: '异常信息', data: detail.error },
        { key: 'context', label: '上报上下文', data: detail.context },
      ],
    },
  ]
}
