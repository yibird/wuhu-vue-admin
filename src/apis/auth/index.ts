import { apiRequest } from '@/utils'
import { REQUEST_METHOD } from '@/constants'

import type { ApiResult } from '#/http'
import type { AuthSession, LoginRequest, LoginResponse } from './types'

export function loginApi(data: LoginRequest, signal?: AbortSignal) {
  return apiRequest<ApiResult<LoginResponse>>('/v1/auth/login', {
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

export type {
  AuthSession,
  AuthUser,
  LoginRequest,
  LoginResponse,
} from './types'
