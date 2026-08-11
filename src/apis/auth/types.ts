export type LoginRequest =
  | {
      loginType: 'account'
      account: string
      password: string
    }
  | {
      loginType: 'mobile'
      mobile: string
      code: string
    }

export interface AuthUser {
  id: string
  account: string
  name: string
  avatar?: string
  roles: string[]
}

export interface AuthSession {
  user: AuthUser
  permissions: string[]
}

export interface LoginResponse extends AuthSession {
  accessToken: string
}
