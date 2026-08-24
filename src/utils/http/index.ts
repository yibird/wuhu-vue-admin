import ky, { type Input } from 'ky'
import { beforeRequest, beforeError, beforeRetry, afterResponse } from './hooks'
import {
  buildRequestDedupKey,
  dedupeRequest,
  type ApiRequestOptions,
} from './dedupe'

export const kyInstance = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
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
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export { useRequest } from './composables'
export type {
  RequestContext,
  Service,
  UseRequestOptions,
  UseRequestReturn,
} from './composables'
export type { ApiRequestOptions, ApiResponseType } from './dedupe'
export { getToken, setToken, removeToken } from './util'
