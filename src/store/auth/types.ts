import type { AuthUser } from '@/apis'

export interface AuthStoreState {
  /**
   * 访问令牌
   */
  accessToken: string | null
  /**
   * 用户信息
   */
  userInfo: AuthUser | null
  /**
   * loading状态
   */
  loading: boolean
  /**
   * 是否登录
   */
  isAuthenticated: boolean
}
