export const ApiCode = {
  Ok: 200,
  Err: 500,
} as const

export const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const

export const RespStatusCode = {
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

export type ApiCodeType = (typeof ApiCode)[keyof typeof ApiCode]
export type RequestMethodType =
  (typeof RequestMethod)[keyof typeof RequestMethod]
export type RespStatusCodeType =
  (typeof RespStatusCode)[keyof typeof RespStatusCode]
