export const HTTP_STATUS = {
  Ok: 200,
  Err: 500,
} as const

export const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const

export const HTTP_HEADER = {
  CONTENT_TYPE: 'Content-Type',
} as const

export const CONTENT_TYPE = {
  Json: 'application/json',
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

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
export type RequestMethod = (typeof REQUEST_METHOD)[keyof typeof REQUEST_METHOD]
export type HttpHeader = (typeof HTTP_HEADER)[keyof typeof HTTP_HEADER]
export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE]
export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS]
