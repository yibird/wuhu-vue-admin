import { formatLogTime, resolveLogStatusMeta } from '../data'
import type { SysLoginLogDetail } from '@/apis'
import type { LogDetailField, LogDetailGroup } from '../components'

/**
 * 组装登录日志详情的基本信息
 *
 * @param detail 日志详情
 */
export function createLoginDetailFields(
  detail?: SysLoginLogDetail
): LogDetailField[] {
  if (!detail) return []

  return [
    { label: '日志 ID', value: detail.id },
    { label: 'Trace ID', value: detail.traceId },
    { label: '登录账号', value: detail.username },
    { label: '登录时间', value: formatLogTime(detail.logAt) },
    { label: '来源 IP', value: detail.ip },
    { label: '归属地', value: detail.location },
    { label: '浏览器', value: detail.browser },
    { label: '终端系统', value: detail.os },
    { label: '登录结果', value: resolveLogStatusMeta(detail.status).label },
    { label: '耗时', value: `${detail.costTime} ms` },
    { label: '操作信息', value: detail.message, span: 2 },
  ]
}

/**
 * 组装登录日志详情的 JSON 分块
 *
 * @param detail 日志详情
 */
export function createLoginDetailGroups(
  detail?: SysLoginLogDetail
): LogDetailGroup[] {
  if (!detail) return []

  return [
    {
      title: '请求信息',
      tabs: [
        { key: 'requestHeaders', label: '请求头', data: detail.requestHeaders },
        { key: 'requestBody', label: '请求参数', data: detail.requestBody },
      ],
    },
    {
      title: '响应信息',
      tabs: [
        { key: 'responseBody', label: '响应内容', data: detail.responseBody },
      ],
    },
  ]
}
