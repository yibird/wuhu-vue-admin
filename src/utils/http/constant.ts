export const AUTH_WHITE_LIST: Array<string | RegExp> = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/captcha',
  '/api/v1/auth/hello',
  '/api/sys/role/getPageList',
  /^public\//,
]

export const TOKEN_KEY = 'token'
export const TOKEN_PREFIX = 'Bearer '
