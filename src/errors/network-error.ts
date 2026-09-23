import { AppError } from './app-error.ts'

/**
 * 网络异常基类
 *
 * 注意:ky 也导出同名的 NetworkError / isNetworkError,
 * 同一文件内同时使用两者时请用别名区分(例如 `import { isNetworkError as isKyNetworkError } from 'ky'`)。
 */
export class NetworkError extends AppError {
  constructor(message = '网络异常，请稍后重试。') {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * 网络连接已断开(浏览器离线或链路不可达)
 */
export class NetworkDisconnectedError extends NetworkError {
  constructor(message = '网络连接已断开，请检查网络后重试。') {
    super(message)
    this.name = 'NetworkDisconnectedError'
  }
}

/**
 * 请求超时
 */
export class NetworkTimeoutError extends NetworkError {
  constructor(message = '请求超时，请稍后重试。') {
    super(message)
    this.name = 'NetworkTimeoutError'
  }
}

/**
 * 判断是否为网络类异常(包含断网、超时等子类)
 * @param value 待判断的值
 * @returns 是否为 NetworkError
 */
export function isNetworkError(value: unknown): value is NetworkError {
  return value instanceof NetworkError
}

/**
 * 判断是否为网络连接断开错误
 * @param value 待判断的值
 * @returns 是否为 NetworkDisconnectedError
 */
export function isNetworkDisconnectedError(
  value: unknown
): value is NetworkDisconnectedError {
  return value instanceof NetworkDisconnectedError
}

/**
 * 判断是否为请求超时错误
 * @param value 待判断的值
 * @returns 是否为 NetworkTimeoutError
 */
export function isNetworkTimeoutError(
  value: unknown
): value is NetworkTimeoutError {
  return value instanceof NetworkTimeoutError
}
