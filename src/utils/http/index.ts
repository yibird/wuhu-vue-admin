import ky, { type Input } from 'ky'
import { AppError } from '@/errors'
import { appEnv } from '../env'
import {
  beforeRequest,
  beforeError,
  beforeRetry,
  afterResponse,
  getParsedBodyCache,
} from './hooks'
import {
  buildRequestDedupKey,
  dedupeRequest,
  type ApiRequestOptions,
} from './dedupe'

export const kyInstance = ky.create({
  prefix: appEnv.apiBaseUrl,
  timeout: appEnv.apiTimeout,
  retry: {
    limit: appEnv.apiRetryLimit,
    maxRetryAfter: appEnv.apiMaxRetryAfter,
  },
  hooks: {
    beforeRequest,
    beforeError,
    beforeRetry,
    afterResponse,
  },
})

export function apiRequest<T>(
  url: Input,
  options?: ApiRequestOptions
): Promise<T> {
  const { responseType = 'json', ...requestOptions } = options ?? {}
  return dedupeRequest(buildRequestDedupKey(url, options), async () => {
    const response = await kyInstance(url, requestOptions)
    return parseApiResponse<T>(response, responseType)
  })
}

export async function parseApiResponse<T>(
  response: Response,
  responseType: NonNullable<ApiRequestOptions['responseType']> = 'json'
): Promise<T> {
  if (responseType === 'response') return response as T
  if (responseType === 'stream') return response.body as T
  if (responseType === 'arrayBuffer') return (await response.arrayBuffer()) as T
  if (responseType === 'blob') return (await response.blob()) as T
  if (responseType === 'formData') return (await response.formData()) as T
  if (responseType === 'text') return (await response.text()) as T

  const contentLength = response.headers.get('content-length')
  if ([204, 205].includes(response.status) || contentLength === '0') {
    return undefined as T
  }

  // 业务码校验已经解析过一次,命中缓存时不再重复解析
  const cached = getParsedBodyCache(response)
  if (cached !== undefined) return cached as T

  const text = await response.text()
  if (!text) return undefined as T

  try {
    return JSON.parse(text) as T
  } catch {
    // 网关/代理返回的 HTML 错误页也会走到这里,给出可读错误而不是裸的 SyntaxError
    throw new AppError('响应数据解析失败,请检查接口返回格式')
  }
}

export type { ApiRequestOptions, ApiResponseType } from './dedupe'
export { ApiError, isApiError } from '@/errors'
export { onSessionExpired } from './sse'
export { getToken, setToken, removeToken } from './util'
