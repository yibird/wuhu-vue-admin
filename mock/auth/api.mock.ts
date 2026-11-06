import { defineMock, type MockRequest } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk } from '#mock/helper'

import type { AuthResponse, AuthUser, LoginRequest } from '@/apis'

const accessToken = 'mock-admin-access-token'
const user: AuthUser = {
  id: '1',
  account: 'admin',
  name: '管理员',
  roles: ['admin'],
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
    url: '/api/auth/login',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const credentials = body as unknown as LoginRequest
      if (!isValidCredentials(credentials)) return apiErr('账号或凭据不正确')
      return apiOk<AuthResponse>({
        accessToken,
        menus: [],
        userInfo: user,
      })
    },
  },
])
