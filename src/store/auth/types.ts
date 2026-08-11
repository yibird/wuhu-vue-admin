import type { AuthUser } from '@/apis'

export interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  loginLoading: boolean
  sessionLoading: boolean
}
