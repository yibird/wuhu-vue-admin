import type { Input, Options } from 'ky'

import { RequestMethod } from '@/constants'
import { getToken } from './util'

const DEFAULT_REQUEST_METHOD = RequestMethod.GET
const RESPONSE_DEDUPE_INTERVAL = 1500

export interface ApiRequestOptions extends Options {
  dedupe?: boolean
  dedupeKey?: string
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

export function buildRequestDedupKey(
  input: Input,
  options: ApiRequestOptions = {}
): string | null {
  if (options.signal) return null
  const method = getRequestMethod(input, options)
  const canUseAutoKey = method === RequestMethod.GET
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

export function buildResponseDedupKey(
  status: number | string,
  errorMessage: string
) {
  return [status, errorMessage.trim()].join(':')
}

export function dedupeResponse(
  key: string,
  response: () => void,
  interval = RESPONSE_DEDUPE_INTERVAL
): boolean {
  if (pendingResponses.has(key)) return false

  pendingResponses.add(key)
  response()

  globalThis.setTimeout(() => {
    pendingResponses.delete(key)
  }, interval)

  return true
}

function getRequestMethod(input: Input, options: ApiRequestOptions): string {
  if (options.method) return String(options.method).toUpperCase()
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.method.toUpperCase()
  }
  return DEFAULT_REQUEST_METHOD
}

function getRequestUrl(input: Input): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.url
  }
  return String(input)
}

function getTokenKey(): string {
  return getToken() ?? ''
}

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
