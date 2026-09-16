export class ApiError extends Error {
  readonly code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}
