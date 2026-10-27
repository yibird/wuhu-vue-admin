import { HTTP_METHOD, TOKEN_KEY } from '@/constants'
import { AUTH_WHITE_LIST } from './constant'
import { resetSessionExpiredNotification } from './sse'
import { appEnv } from '../env'
import type { ApiRequestOptions } from './dedupe'
import { getParsedBodyCache } from './hooks'
import { AppError } from '@/errors'

/**
 * 移除 API 基础路径，避免白名单匹配受部署前缀影响。
 *
 * @param pathname - 请求 URL 的路径部分
 * @returns 移除 API 基础路径后的路径
 */
function normalizePath(pathname: string) {
  const baseUrl = appEnv.apiBaseUrl
  if (!baseUrl) return pathname
  const basePath = (
    baseUrl.startsWith('http') ? new URL(baseUrl).pathname : baseUrl
  ).replace(/\/+$/, '')
  if (!basePath || !pathname.startsWith(`${basePath}/`)) return pathname
  return pathname.slice(basePath.length)
}

/**
 * 判断请求 URL 是否匹配认证白名单。匹配完整路径或其子路径，避免路径前缀误匹配。
 *
 * @param url - 请求的完整 URL
 * @returns 命中白名单返回 true，否则返回 false
 */
export function isWhiteListed(url: string) {
  const { pathname } = new URL(url)
  const normalizedPath = normalizePath(pathname)
  return AUTH_WHITE_LIST.some(
    (path) => normalizedPath === path || normalizedPath.startsWith(`${path}/`)
  )
}

/**
 * 解析url，将 '/xxxx/xxx' 或 'POST /xxxx/xxx' 解析为一个包含 method 和 url 的对象
 *
 * @param url 待解析的url
 * @returns 解析后的对象(包含method和url,method表示请求方法,url表示请求url)
 */
export function parseUrl(url?: string) {
  if (!url || url.trim().length === 0) {
    return {
      url: '',
      method: HTTP_METHOD.Get,
    }
  }
  const [m, u] = url.split(' ')
  const method = Object.values(HTTP_METHOD).find(
    (item) => item === m!.toUpperCase()
  )
  return {
    method: method ?? HTTP_METHOD.Get,
    url: u,
  }
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
  const cached = getParsedBodyCache(response)
  if (cached !== undefined) return cached as T
  const text = await response.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    throw new AppError('响应数据解析失败,请检查接口返回格式')
  }
}

export function getToken() {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  resetSessionExpiredNotification()
}

export function removeToken() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}
