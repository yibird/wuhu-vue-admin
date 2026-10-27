export const HTTP_STATUS = {
  Ok: 200,
  Err: 500,
} as const

export const HTTP_METHOD = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
  Patch: 'PATCH',
  Options: 'OPTIONS',
  Head: 'HEAD',
} as const

export const HTTP_HEADER = {
  /** 请求体/响应体的 MIME 类型（如 application/json） */
  ContentType: 'Content-Type',
  /** 客户端期望接收的响应数据类型（如 application/json） */
  Accept: 'Accept',
  /** 请求体或响应体的字节长度（通常由浏览器或网关自动计算，一般不需要手动设置） */
  ContentLength: 'Content-Length',

  /** 身份认证凭证。常见格式为：Bearer <token> 或 Basic <base64> */
  Authorization: 'Authorization',
  /** 客户端携带的 Cookie（注意：前端发请求通常由浏览器自动携带，且受跨域限制，手动设置常被浏览器拦截） */
  Cookie: 'Cookie',

  /** 请求的来源（协议 + 域名 + 端口）。在解决跨域问题时，服务端常通过校验该字段来决定是否放行 */
  Origin: 'Origin',
  /** 服务端允许跨域的来源。通常由服务端返回，前端一般不需要在请求头里设置 */
  AccessControlAllowOrigin: 'Access-Control-Allow-Origin',

  /** 客户端标识（浏览器类型、操作系统等）。前端浏览器自动携带，且不允许手动修改 */
  UserAgent: 'User-Agent',
  /** 请求的来源页面地址。常用于追踪来源或防盗链（注：标准拼写是 Referer，历史上少写了一个 r） */
  Referer: 'Referer',
  /** 用于标识这是一个 Ajax 请求（值通常为 XMLHttpRequest）。在 jQuery 时代非常常用，现在逐渐被废弃 */
  XRequestedWith: 'X-Requested-With',
  /** 记录客户端的真实 IP 地址。通常由 Nginx 等代理服务器自动添加，用于防止客户端伪造 */
  XForwardedFor: 'X-Forwarded-For',
} as const

export const CONTENT_TYPE = {
  Json: 'application/json',
  Blob: 'blob',
} as const

export const API_STATUS = {
  Ok: 200,
  Error: 500,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  PayloadTooLarge: 413,
  UnsupportedMediaType: 415,
  TooManyRequests: 429,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  NetworkAuthenticationRequired: 511,
} as const

export const TOKEN_KEY = 'token'
export const TOKEN_PREFIX = 'Bearer '

export type HttpStatus = ValueOf<typeof HTTP_STATUS>
export type HttpMethod = ValueOf<typeof HTTP_METHOD>
export type HttpHeader = ValueOf<typeof HTTP_HEADER>
export type ContentType = ValueOf<typeof CONTENT_TYPE>
export type ApiStatus = ValueOf<typeof API_STATUS>
