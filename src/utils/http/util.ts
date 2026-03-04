import { RequestMethod } from '@/constant'
import { AUTH_WHITE_LIST, TOKEN_KEY } from './constant'

export function isWhiteListed(url: string) {
  const pathname = new URL(url).pathname
  return AUTH_WHITE_LIST.some((rule) => {
    return typeof rule === 'string'
      ? pathname.startsWith(rule)
      : rule.test(pathname)
  })
}

/**
 * 解析url 将 '/xxxx/xxx'或'POST /xxxx/xxx'解析为一个包含method和url的对象
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
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}
