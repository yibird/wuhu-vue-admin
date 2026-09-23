import { message } from 'antdv-next'
import {
  isHTTPError,
  isNetworkError,
  isTimeoutError,
  type BeforeErrorHook,
} from 'ky'
import { buildResponseDedupKey, dedupeResponse } from '../dedupe'

interface ResponseErrorInfo {
  status: number | string
  message: string
}

const DEFAULT_NETWORK_ERROR = '网络异常，请稍后重试'
const DEFAULT_RESPONSE_ERROR = '请求失败，请稍后重试'
const DEFAULT_TIMEOUT_ERROR = '请求超时，请稍后重试'
const NO_AUTH_TOKEN_ERROR = 'NO_AUTH_TOKEN'

export const beforeErrorHook: BeforeErrorHook = async ({ error }) => {
  try {
    const errorInfo = resolveResponseErrorInfo(error)

    if (errorInfo) {
      dedupeResponse(
        buildResponseDedupKey(errorInfo.status, errorInfo.message),
        () => {
          message.error(errorInfo.message)
        }
      )
    }
  } catch {
    // 提示逻辑异常不能掩盖原始请求错误
  }

  return error
}

export const beforeError: BeforeErrorHook[] = [beforeErrorHook]

function resolveResponseErrorInfo(error: Error): ResponseErrorInfo | undefined {
  // 主动取消（useRequest.cancel / 重复请求中止）不提示
  if (error.name === 'AbortError') return undefined

  if (isHTTPError(error)) {
    // ky 在 beforeError 前已消费响应体并将结果写入 error.data，
    // 这里直接读取，不能再 clone / 读取 response body
    const payloadMessage = getPayloadMessage(error.data)

    return {
      status: error.response.status,
      message:
        payloadMessage || error.response.statusText || DEFAULT_RESPONSE_ERROR,
    }
  }

  if (isTimeoutError(error)) {
    return { status: 'TIMEOUT', message: DEFAULT_TIMEOUT_ERROR }
  }

  if (isNetworkError(error)) {
    return { status: 'NETWORK', message: DEFAULT_NETWORK_ERROR }
  }

  if (error.message === NO_AUTH_TOKEN_ERROR) {
    return { status: 'NO_AUTH_TOKEN', message: '登录状态已失效，请重新登录' }
  }

  return {
    status: 'UNKNOWN',
    message: error.message || DEFAULT_NETWORK_ERROR,
  }
}

function getPayloadMessage(payload: unknown): string {
  if (typeof payload === 'string') return payload.trim()
  if (!payload || typeof payload !== 'object') return ''

  const data = payload as Record<string, unknown>
  const message = data.message ?? data.msg ?? data.error

  return typeof message === 'string' ? message.trim() : ''
}
