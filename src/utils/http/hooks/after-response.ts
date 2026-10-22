import { HTTP_STATUS, CONTENT_TYPE, HTTP_HEADER, API_STATUS } from '@/constants'
import { ApiError } from '@/errors'
import { notifySessionExpired } from '../sse'

import type { AfterResponseHook } from 'ky'

interface ResultEnvelope {
  code: number
  message?: string
}

function isResultEnvelope(value: unknown): value is ResultEnvelope {
  return (
    !!value &&
    typeof value === 'object' &&
    'code' in value &&
    typeof (value as { code: unknown }).code === 'number'
  )
}

/**
 * 业务码校验时已解析过的响应体
 *
 * 校验响应包裹体必然要读一次 body,这里把结果按 Response 实例缓存,
 * 后续 parseApiResponse 直接复用,避免每个响应都 JSON.parse 两遍。
 */
const parsedBodyCache = new WeakMap<Response, unknown>()

/**
 * 取缓存中的已解析响应体
 *
 * @param response 响应对象
 */
export function getParsedBodyCache(response: Response) {
  return parsedBodyCache.get(response)
}

const unauthorizedResponseHook: AfterResponseHook = async ({
  response: res,
}) => {
  if (res.status === API_STATUS.Unauthorized) {
    notifySessionExpired()
  }
}

const businessResponseHook: AfterResponseHook = async ({ response: res }) => {
  if (!res.ok) return

  const contentType = res.headers.get(HTTP_HEADER.CONTENT_TYPE) ?? ''
  if (!contentType.toLowerCase().includes(CONTENT_TYPE.Json)) return

  const payload: unknown = await res
    .clone()
    .json()
    .catch(() => null)

  // 只有解析成功才缓存,解析失败留给调用方报出可读的错误
  if (payload !== null) parsedBodyCache.set(res, payload)

  if (!isResultEnvelope(payload) || payload.code === HTTP_STATUS.Ok) return

  throw new ApiError(
    payload.message?.trim() || '请求失败，请稍后重试',
    payload.code
  )
}

export const afterResponse: AfterResponseHook[] = [
  unauthorizedResponseHook,
  businessResponseHook,
]
