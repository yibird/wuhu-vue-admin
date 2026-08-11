import ky, { type Input } from 'ky'
import { ContentType, HttpHeader } from '@/constants'
import { beforeRequest, beforeError, beforeRetry, afterResponse } from './hooks'
import {
  buildRequestDedupKey,
  dedupeRequest,
  type ApiRequestOptions,
} from './dedupe'

export const kyInstance = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  method: 'post',
  headers: {
    [HttpHeader.ContentType]: ContentType.Json,
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
  return dedupeRequest(buildRequestDedupKey(url, options), () =>
    kyInstance<T>(url, options).then(
      (response) => response.json() as Promise<T>
    )
  )
}

export { useRequest } from './composables'
export type {
  RequestContext,
  Service,
  UseRequestOptions,
  UseRequestReturn,
} from './composables'
export type { ApiRequestOptions } from './dedupe'
export { getToken, setToken, removeToken } from './util'
