import type { IMenu } from '#/config'

export interface AccountLoginReq {
  loginType: 'account'
  account: string
  password: string
}

export interface MobileLoginReq {
  loginType: 'mobile'
  mobile: string
  code: string
}

export type LoginRequest = AccountLoginReq | MobileLoginReq

export interface AuthUser {
  id: string
  account: string
  name: string
  avatar?: string
  roles: string[]
}

export interface AuthResponse {
  accessToken: string
  menus: IMenu[]
  userInfo: AuthUser
}

export interface AuthSession {
  user: AuthUser
  permissions: string[]
}
