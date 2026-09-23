/**
 * 应用错误基类
 *
 * 用于统一区分「项目已知错误」与「未预期异常」,
 * 错误边界、全局提示等可以据此决定展示与上报策略。
 */
export class AppError extends Error {
  /**
   * @desc 错误码或错误标识,便于调用方进一步分类
   */
  readonly code?: string | number

  constructor(message: string, options: AppErrorOptions = {}) {
    super(
      message,
      options.cause === undefined ? undefined : { cause: options.cause }
    )
    this.name = 'AppError'
    this.code = options.code
  }
}

/**
 * AppError 构造参数
 */
export interface AppErrorOptions {
  /**
   * @desc 错误码或错误标识
   */
  code?: string | number
  /**
   * @desc 原始错误
   */
  cause?: unknown
}

/**
 * 判断是否为项目已知错误
 * @param value 待判断的值
 * @returns 是否为 AppError
 */
export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError
}
