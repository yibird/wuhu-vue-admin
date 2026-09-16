import { getToken, isWhiteListed } from '../util'
import { TOKEN_PREFIX } from '../constant'
import { notifySessionExpired } from '../sessionEvents'

import type { BeforeRequestHook } from 'ky'

const tokenRequestHook: BeforeRequestHook = ({ request: req }) => {
  if (isWhiteListed(req.url)) return
  const token = getToken()
  if (!token) {
    notifySessionExpired()
    throw new Error('NO_AUTH_TOKEN')
  }
  req.headers.set('Authorization', `${TOKEN_PREFIX}${token}`)
  return req
}

function createTraceId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  const random = () => Math.random().toString(36).slice(2, 10)
  return `${Date.now().toString(36)}-${random()}-${random()}`
}

const traceIdRequestHook: BeforeRequestHook = ({ request: req }) => {
  req.headers.set('X-Trace-Id', createTraceId())
}

export const beforeRequest: BeforeRequestHook[] = [
  tokenRequestHook,
  traceIdRequestHook,
]
