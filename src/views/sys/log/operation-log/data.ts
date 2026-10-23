import { formatLogTime, resolveLogStatusMeta } from '../data'
import type { SysOperationLogDetail } from '@/apis'
import type { LogDetailField, LogDetailGroup } from '../components'

/**
 * 请求方法下拉选项
 */
export const operationMethodOptions = ['GET', 'POST', 'PUT', 'DELETE'].map(
  (value) => ({ label: value, value })
)

/**
 * 组装操作日志详情的基本信息
 *
 * 请求 URI 较长且独占一行(span 2),放在前两个字段之后,
 * 保证每行的列数与 descriptions 的 column 对齐。
 *
 * @param detail 日志详情
 */
export function createOperationDetailFields(
  detail?: SysOperationLogDetail
): LogDetailField[] {
  if (!detail) return []

  return [
    { label: '日志 ID', value: detail.id },
    { label: 'Trace ID', value: detail.traceId },
    { label: '请求 URI', value: detail.uri, span: 2 },
    { label: '操作人', value: detail.username },
    { label: '操作时间', value: formatLogTime(detail.logAt) },
    { label: '所属模块', value: detail.module },
    { label: '操作描述', value: detail.message },
    { label: '请求方法', value: detail.method },
    { label: '耗时', value: `${detail.costTime} ms` },
    { label: '来源 IP', value: detail.ip },
    { label: '归属地', value: detail.location },
    { label: '浏览器', value: detail.browser },
    { label: '终端系统', value: detail.os },
    {
      label: '执行结果',
      value: resolveLogStatusMeta(detail.status).label,
    },
  ]
}

/**
 * 组装操作日志详情的 JSON 分块
 *
 * @param detail 日志详情
 */
export function createOperationDetailGroups(
  detail?: SysOperationLogDetail
): LogDetailGroup[] {
  if (!detail) return []

  return [
    {
      title: '请求信息',
      tabs: [
        { key: 'requestHeaders', label: '请求头', data: detail.requestHeaders },
        { key: 'requestBody', label: '请求体', data: detail.requestBody },
      ],
    },
    {
      title: '响应信息',
      tabs: [
        {
          key: 'responseHeaders',
          label: '响应头',
          data: detail.responseHeaders,
        },
        { key: 'responseBody', label: '响应体', data: detail.responseBody },
      ],
    },
  ]
}
