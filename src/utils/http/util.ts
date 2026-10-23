import { REQUEST_METHOD, TOKEN_KEY } from '@/constants'
import { AUTH_WHITE_LIST } from './constant'
import { resetSessionExpiredNotification } from './sse'
import { appEnv } from '../env'

/**
 * 去掉 API 基础前缀，使白名单匹配不依赖部署前缀（/api 等）
 */
function normalizeApiPath(pathname: string) {
  if (!appEnv.apiBaseUrl) return pathname

  // 兼容绝对地址与尾斜杠,按路径段边界比较,避免前缀部分匹配
  const basePath = (
    appEnv.apiBaseUrl.startsWith('http')
      ? new URL(appEnv.apiBaseUrl).pathname
      : appEnv.apiBaseUrl
  ).replace(/\/+$/, '')
  if (!basePath || !pathname.startsWith(`${basePath}/`)) return pathname

  return pathname.slice(basePath.length)
}

export function isWhiteListed(url: string) {
  const pathname = normalizeApiPath(new URL(url).pathname)

  return AUTH_WHITE_LIST.some(
    (rule) => pathname === rule || pathname.startsWith(`${rule}/`)
  )
}

/**
 * 解析url，将 '/xxxx/xxx' 或 'POST /xxxx/xxx' 解析为一个包含 method 和 url 的对象
 * @param url 待解析的url
 * @returns 解析后的对象(包含method和url,method表示请求方法,url表示请求url)
 */
export function parseUrl(url?: string) {
  if (!url || url.trim().length === 0) {
    return {
      url: '',
      method: REQUEST_METHOD.GET,
    }
  }
  const [m, u] = url.split(' ')
  const method = Object.values(REQUEST_METHOD).find(
    (item) => item === m!.toUpperCase()
  )
  return {
    method: method || REQUEST_METHOD.GET,
    url: u,
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
