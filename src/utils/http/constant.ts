/**
 * 无需携带 token 的接口白名单。
 *
 * 规则基于「去掉 API 基础前缀后的路径」，与部署前缀无关，
 * 匹配时按完整路径段边界判断，避免 `/loginAudit` 命中 `/login`。
 */
export const AUTH_WHITE_LIST: string[] = [
  '/v1/auth/login',
  '/v1/auth/register',
  '/v1/auth/captcha',
  '/v1/auth/hello',
]

export const TOKEN_KEY = 'token'
export const TOKEN_PREFIX = 'Bearer '
