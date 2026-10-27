import { AppError } from './app.ts'

/**
 * 请求被取消(主动 cancel 或所属作用域销毁)时抛出的错误
 *
 * 属于正常流程,不应作为失败上报或提示。
 */
export class CanceledError extends AppError {
  constructor(message = '请求已取消。') {
    super(message)
    this.name = 'CanceledError'
  }
}

/**
 * 请求条件未就绪(ready 为 false)时抛出的错误
 */
export class NotReadyError extends AppError {
  constructor(message = '当前请求尚未就绪(ready 为 false)。') {
    super(message)
    this.name = 'NotReadyError'
  }
}

/**
 * 判断是否为请求取消错误
 *
 * 兼容跨包/跨实例场景:除实例判断外同时校验 name。
 *
 * @param value 待判断的值
 * @returns 是否为取消错误
 */
export function isCanceledError(value: unknown): boolean {
  return (
    value instanceof CanceledError ||
    (value instanceof Error && value.name === 'CanceledError')
  )
}

/**
 * 判断是否为请求未就绪错误
 * @param value 待判断的值
 * @returns 是否为 NotReadyError
 */
export function isNotReadyError(value: unknown): value is NotReadyError {
  return value instanceof NotReadyError
}
