export class NetworkDisconnectedError extends Error {
  constructor() {
    super('网络连接已断开，请检查网络后重试。')
    this.name = 'NetworkDisconnectedError'
  }
}

export function isNetworkDisconnectedError(
  error: Error
): error is NetworkDisconnectedError {
  return error instanceof NetworkDisconnectedError
}
