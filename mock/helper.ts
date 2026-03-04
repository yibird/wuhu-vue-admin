import { ApiCode, type ApiCodeType } from '@/constant'
import type { BaseQuery, PageResult, Result } from '#/http'

const API_CODE_MAPPING = {
  [ApiCode.Ok]: { message: '请求成功' },
  [ApiCode.Err]: { message: '请求异常' },
} as const

export function apiResp<T>(
  code: ApiCodeType,
  data: T | null = null,
  message?: string
): Result<T | null> {
  return {
    code,
    message: message ?? API_CODE_MAPPING[code]?.message ?? 'unknown',
    data,
  }
}

export const apiOk = <T>(data: T) => apiResp(ApiCode.Ok, data)
export const apiErr = (message?: string) => apiResp(ApiCode.Err, null, message)

export function getPageList<T>(data: T[], query: BaseQuery) {
  const { pageNum = 1, pageSize = 10 } = query
  const total = data.length
  const pages = Math.ceil(total / pageSize)
  const list = data.slice((pageNum - 1) * pageSize, pageNum * pageSize)
  return { pageNum, pageSize, total, totalPage: pages, list } as PageResult<T>
}
