/**
 * 无需携带 token 的接口白名单。
 */
export const AUTH_WHITE_LIST: string[] = [
  '/v1/auth/login',
  '/v1/auth/register',
  '/v1/auth/captcha',
  '/v1/auth/hello',
  '/v1/ai',
] as const
