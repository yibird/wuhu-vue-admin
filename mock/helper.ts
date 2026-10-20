import { HTTP_STATUS, type HttpStatus } from '@/constants'
import type { BaseQuery, PageResult, Result } from '#/http'

const API_CODE_MAPPING = {
  [HTTP_STATUS.Ok]: { message: '请求成功' },
  [HTTP_STATUS.Err]: { message: '请求异常' },
} as const

export function apiResp<T>(
  code: HttpStatus,
  data: T | null = null,
  message?: string
): Result<T | null> {
  return {
    code,
    message: message ?? API_CODE_MAPPING[code]?.message ?? 'unknown',
    data,
  }
}

export const apiOk = <T>(data: T) => apiResp(HTTP_STATUS.Ok, data)
export const apiErr = (message?: string) =>
  apiResp(HTTP_STATUS.Err, null, message)

export function getPageList<T>(data: T[], query: BaseQuery) {
  const { current = 1, pageSize = 10 } = query
  const total = data.length
  const pages = Math.ceil(total / pageSize)
  const list = data.slice((current - 1) * pageSize, current * pageSize)
  return { current, pageSize, total, totalPage: pages, list } as PageResult<T>
}
