import { message } from 'antdv-next'
import { isHTTPError, type BeforeErrorHook } from 'ky'
import { ContentType, HttpHeader } from '@/constants'
import { buildResponseDedupKey, dedupeResponse } from '../dedupe'

interface ResponseErrorInfo {
  status: number | string
  message: string
}

const DEFAULT_NETWORK_ERROR = '网络异常，请稍后重试'
const DEFAULT_RESPONSE_ERROR = '请求失败，请稍后重试'
const NO_AUTH_TOKEN_ERROR = 'NO_AUTH_TOKEN'

export const beforeErrorHook: BeforeErrorHook = async ({ error }) => {
  const errorInfo = await resolveResponseErrorInfo(error)

  dedupeResponse(
    buildResponseDedupKey(errorInfo.status, errorInfo.message),
    () => {
      message.error(errorInfo.message)
    }
  )

  return error
}

export const beforeError: BeforeErrorHook[] = [beforeErrorHook]

async function resolveResponseErrorInfo(
  error: Error
): Promise<ResponseErrorInfo> {
  if (!isHTTPError(error) || !error.response) {
    return {
      status: error.message || 'NETWORK',
      message:
        error.message === NO_AUTH_TOKEN_ERROR
          ? '登录状态已失效，请重新登录'
          : error.message || DEFAULT_NETWORK_ERROR,
    }
  }

  const { response } = error
  const message =
    (await readResponseErrorMessage(response)) ||
    response.statusText ||
    DEFAULT_RESPONSE_ERROR

  return {
    status: response.status,
    message,
  }
}

async function readResponseErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get(HttpHeader.ContentType) ?? ''

  if (contentType.toLowerCase().includes(ContentType.Json)) {
    const payload = await response
      .clone()
      .json()
      .catch(() => null)
    return getPayloadMessage(payload)
  }

  return response
    .clone()
    .text()
    .catch(() => '')
}

function getPayloadMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''

  const data = payload as Record<string, unknown>
  const message = data.message ?? data.msg ?? data.error

  return typeof message === 'string' ? message.trim() : ''
}
