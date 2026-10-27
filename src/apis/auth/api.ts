import { apiRequest } from '@/utils'
import { HTTP_METHOD } from '@/constants'

import type { ApiResult } from '#/http'
import type {
  AccountLoginReq,
  MobileLoginReq,
  AuthResponse,
  AuthSession,
} from './types'

export function accountLoginApi(data: AccountLoginReq, signal?: AbortSignal) {
  return apiRequest<ApiResult<AuthResponse>>('/v1/auth/login', {
    method: HTTP_METHOD.Post,
    json: data,
    signal,
  })
}

export function mobileLoginApi(data: MobileLoginReq, signal?: AbortSignal) {
  return apiRequest<ApiResult<AuthResponse>>('/v1/auth/login', {
    method: HTTP_METHOD.Post,
    json: data,
    signal,
  })
}

export function getAuthSessionApi(signal?: AbortSignal) {
  return apiRequest<ApiResult<AuthSession>>('/v1/auth/session', {
    method: HTTP_METHOD.Get,
    signal,
    dedupe: false,
  })
}
