import { AppError } from './app.ts'

/**
 * 业务错误
 *
 * HTTP 层成功但业务 code 非成功码时抛出(见 afterResponse 钩子)。
 */
export class ApiError extends AppError {
  /**
   * @desc 业务错误码
   */
  readonly code: number

  constructor(message: string, code: number) {
    super(message, { code })
    this.name = 'ApiError'
    this.code = code
  }
}

/**
 * 判断是否为业务错误
 * @param value 待判断的值
 * @returns 是否为 ApiError
 */
export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}
