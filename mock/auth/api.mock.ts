import { defineMock, type MockRequest } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk } from '#mock/helper'

import type { AuthSession, LoginRequest, LoginResponse } from '@/apis'

const accessToken = 'mock-admin-access-token'
const session: AuthSession = {
  user: {
    id: '1',
    account: 'admin',
    name: '管理员',
    roles: ['admin'],
  },
  permissions: ['*'],
}

function isValidCredentials(credentials: LoginRequest) {
  if (credentials.loginType === 'account') {
    return Boolean(credentials.account.trim() && credentials.password)
  }
  return (
    /^1\d{10}$/.test(credentials.mobile) && /^\d{6}$/.test(credentials.code)
  )
}

export default defineMock([
  {
    url: '/api/v1/auth/login',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const credentials = body as unknown as LoginRequest
      if (!isValidCredentials(credentials)) return apiErr('账号或凭据不正确')
      return apiOk<LoginResponse>({ ...session, accessToken })
    },
  },
  {
    url: '/api/v1/auth/session',
    method: 'GET',
    body: ({ headers }: MockRequest) => {
      const authorization = headers.authorization
      if (authorization !== `Bearer ${accessToken}`) {
        return apiErr('会话已失效')
      }
      return apiOk(session)
    },
  },
])
