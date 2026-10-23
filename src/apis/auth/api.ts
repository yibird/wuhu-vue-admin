import { apiRequest } from '@/utils'
import { REQUEST_METHOD } from '@/constants'

import type { ApiResult } from '#/http'
import type {
  AccountLoginReq,
  MobileLoginReq,
  AuthResponse,
  AuthSession,
} from './types'

export function accountLoginApi(data: AccountLoginReq, signal?: AbortSignal) {
  return apiRequest<ApiResult<AuthResponse>>('/v1/auth/login', {
    method: REQUEST_METHOD.POST,
    json: data,
    signal,
  })
}

export function mobileLoginApi(data: MobileLoginReq, signal?: AbortSignal) {
  return apiRequest<ApiResult<AuthResponse>>('/v1/auth/login', {
    method: REQUEST_METHOD.POST,
    json: data,
    signal,
  })
}

export function getAuthSessionApi(signal?: AbortSignal) {
  return apiRequest<ApiResult<AuthSession>>('/v1/auth/session', {
    method: REQUEST_METHOD.GET,
    signal,
    dedupe: false,
  })
}
