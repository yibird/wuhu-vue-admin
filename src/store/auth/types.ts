import type { AuthUser } from '@/apis'

export interface AuthState {
  /**
   * 访问令牌
   */
  accessToken: string | null
  /**
   * 用户信息
   */
  userInfo: AuthUser | null
  /**
   * 登录加载中
   */
  loginLoading: boolean
  /**
   * 是否登录
   */
  isAuthenticated: boolean
}
