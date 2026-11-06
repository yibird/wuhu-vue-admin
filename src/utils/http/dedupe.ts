import type { Input, Options } from 'ky'

import { HTTP_METHOD } from '@/constants'
import { getToken } from './util'

const DEFAULT_HTTP_METHOD = HTTP_METHOD.Get
const RESPONSE_DEDUPE_INTERVAL = 1500

export interface ApiRequestOptions extends Options {
  /**
   * 是否开启去重
   */
  dedupe?: boolean
  /**
   * 自定义去重键
   */
  dedupeKey?: string
  /**
   * 响应类型
   */
  responseType?: ApiResponseType
}

export type ApiResponseType =
  | 'arrayBuffer'
  | 'blob'
  | 'formData'
  | 'json'
  | 'response'
  | 'stream'
  | 'text'

const pendingRequests = new Map<string, Promise<unknown>>()
const pendingResponses = new Set<string>()

/**
 * 获取请求去重键
 *
 * @param input 请求输入
 * @param options 请求选项
 * @returns 请求去重键
 */
export function getRequestDedupKey(
  input: Input,
  options: ApiRequestOptions = {}
): string | null {
  if (options.signal) return null
  if (options.responseType && options.responseType !== 'json') return null
  const method = getHttpMethod(input, options)
  const canUseAutoKey = method === HTTP_METHOD.Get
  const shouldDedupe = options.dedupe ?? canUseAutoKey
  if (!shouldDedupe) return null
  const customKey = options.dedupeKey?.trim()
  if (customKey) return [method, customKey, getTokenKey()].join(':')
  if (!canUseAutoKey) return null
  return [
    method,
    getRequestUrl(input),
    stringifySearchParams(options.searchParams),
    getTokenKey(),
  ].join(':')
}

/**
 * 去重请求
 *
 * @param key 请求去重键
 * @param request 请求函数
 * @returns 去重后的请求
 */
export function dedupeRequest<T>(
  key: string | null,
  request: () => Promise<T>
): Promise<T> {
  if (!key) return request()
  const pending = pendingRequests.get(key) as Promise<T> | undefined
  if (pending) return pending
  const promise = request().finally(() => {
    pendingRequests.delete(key)
  })
  pendingRequests.set(key, promise)
  return promise
}

/**
 * 获取响应去重键
 *
 * @param status 响应状态码
 * @param errorMessage 响应错误信息
 * @returns 响应去重键
 */
export function getResponseDedupKey(
  status: number | string,
  errorMessage: string
) {
  return [status, errorMessage.trim()].join(':')
}

/**
 * 去重响应
 *
 * @param key 响应去重键
 * @param response 响应函数
 * @param interval 去重间隔
 * @returns 是否去重成功
 */
export function dedupeResponse(
  key: string,
  response: () => void,
  interval = RESPONSE_DEDUPE_INTERVAL
) {
  if (pendingResponses.has(key)) return false
  pendingResponses.add(key)
  response()
  globalThis.setTimeout(() => {
    pendingResponses.delete(key)
  }, interval)
  return true
}

/**
 * 获取 HTTP 方法
 *
 * @param input 请求输入
 * @param options 请求选项
 * @returns HTTP 方法
 */
function getHttpMethod(input: Input, options: ApiRequestOptions): string {
  if (options.method) return String(options.method).toUpperCase()
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.method.toUpperCase()
  }
  return DEFAULT_HTTP_METHOD
}

/**
 * 获取请求 URL
 *
 * @param input 请求输入
 * @returns 请求 URL
 */
function getRequestUrl(input: Input): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.url
  }
  return String(input)
}

/**
 * 获取请求 URL 中的查询参数
 *
 * @param searchParams 查询参数
 * @returns 查询参数
 */
function getTokenKey(): string {
  return getToken() ?? ''
}

/**
 * 字符串化查询参数
 *
 * @param searchParams 查询参数
 * @returns 字符串化后的查询参数
 */
function stringifySearchParams(
  searchParams: ApiRequestOptions['searchParams']
): string {
  if (!searchParams) return ''
  const params = new URLSearchParams()
  if (typeof searchParams === 'string') {
    new URLSearchParams(searchParams).forEach((value, key) => {
      params.append(key, value)
    })
  } else if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })
  } else if (Array.isArray(searchParams)) {
    searchParams.forEach(([key, value]) => {
      params.append(String(key), String(value))
    })
  } else {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })
  }
  params.sort()
  return params.toString()
}
