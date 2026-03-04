import { getToken, isWhiteListed } from '../util'
import { TOKEN_PREFIX } from '../constant'

import type { BeforeRequestHook } from 'ky'

const tokenRequestHook: BeforeRequestHook = (req) => {
  if (isWhiteListed(req.url)) return
  const token = getToken()
  if (!token) {
    throw new Error('NO_AUTH_TOKEN')
  }
  req.headers.set('Authorization', `${TOKEN_PREFIX} ${token}`)
  return req
}

const traceIdRequestHook: BeforeRequestHook = (req) => {
  const traceId = crypto.randomUUID()
  req.headers.set('X-Trace-Id', traceId)
}

export const beforeRequest: BeforeRequestHook[] = [
  tokenRequestHook,
  traceIdRequestHook,
]
