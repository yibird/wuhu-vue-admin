import { ApiCode, ContentType, HttpHeader, RespStatusCode } from '@/constants'
import { ApiError } from '../errors'
import { notifySessionExpired } from '../sessionEvents'

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

const unauthorizedResponseHook: AfterResponseHook = async ({
  response: res,
}) => {
  if (res.status === RespStatusCode.Unauthorized) {
    notifySessionExpired()
  }
}

const businessResponseHook: AfterResponseHook = async ({ response: res }) => {
  if (!res.ok) return

  const contentType = res.headers.get(HttpHeader.ContentType) ?? ''
  if (!contentType.toLowerCase().includes(ContentType.Json)) return

  const payload: unknown = await res
    .clone()
    .json()
    .catch(() => null)

  if (!isResultEnvelope(payload) || payload.code === ApiCode.Ok) return

  throw new ApiError(
    payload.message?.trim() || '请求失败，请稍后重试',
    payload.code
  )
}

export const afterResponse: AfterResponseHook[] = [
  unauthorizedResponseHook,
  businessResponseHook,
]
