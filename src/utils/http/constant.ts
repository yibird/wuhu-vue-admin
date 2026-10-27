/**
 * 无需携带 token 的接口白名单
 */
export const AUTH_WHITE_LIST: string[] = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/captcha',
  '/api/auth/hello',
  '/api/ai',
] as const
