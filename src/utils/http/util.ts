import { RequestMethod } from '@/constants'
import { AUTH_WHITE_LIST, TOKEN_KEY } from './constant'
import { resetSessionExpiredNotification } from './sessionEvents'

/**
 * 去掉 API 基础前缀，使白名单匹配不依赖部署前缀（/api 等）
 */
function normalizeApiPath(pathname: string) {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  if (!base || !pathname.startsWith(base)) return pathname

  return pathname.slice(base.length) || '/'
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
      method: RequestMethod.GET,
    }
  }
  const [m, u] = url.split(' ')
  const method = Object.values(RequestMethod).find(
    (item) => item === m!.toUpperCase()
  )
  return {
    method: method || RequestMethod.GET,
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
