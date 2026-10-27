import ky, { type Input } from 'ky'
import { appEnv } from '../env'
import { beforeRequest, beforeError, beforeRetry, afterResponse } from './hooks'
import {
  buildRequestDedupKey,
  dedupeRequest,
  type ApiRequestOptions,
} from './dedupe'
import { parseApiResponse } from './util'

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
