import { apiRequest } from '@/utils'
import { HTTP_METHOD } from '@/constants'

import type { ApiResult } from '#/http'
import type { AccountLoginReq, MobileLoginReq, AuthResponse } from './types'

export function accountLoginApi(data: AccountLoginReq) {
  return apiRequest<ApiResult<AuthResponse>>('/auth/login', {
    method: HTTP_METHOD.Post,
    json: data,
  })
}

export function mobileLoginApi(data: MobileLoginReq) {
  return apiRequest<ApiResult<AuthResponse>>('/auth/login', {
    method: HTTP_METHOD.Post,
    json: data,
  })
}
