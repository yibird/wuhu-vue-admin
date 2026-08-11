import { apiRequest } from '@/utils'
import { RequestMethod } from '@/constants'

import type { Result } from '#/http'
import type { AuthSession, LoginRequest, LoginResponse } from './types'

export function loginApi(data: LoginRequest, signal?: AbortSignal) {
  return apiRequest<Result<LoginResponse>>('/v1/auth/login', {
    method: RequestMethod.POST,
    json: data,
    signal,
  })
}

export function getAuthSessionApi(signal?: AbortSignal) {
  return apiRequest<Result<AuthSession>>('/v1/auth/session', {
    method: RequestMethod.GET,
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
