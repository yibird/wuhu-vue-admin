import type { LoadingAnimationType } from '@/constants'

export interface LoadingProps {
  /**
   * @desc Loading 描述
   * @default
   */
  description?: string
  /**
   * @desc 是否全屏
   * @default false
   */
  full?: boolean
  /**
   * @desc loading的类型
   * @default ''
   */
  type?: LoadingAnimationType
}
