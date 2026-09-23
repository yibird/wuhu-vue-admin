import type { LoadingAnimation } from '@/config'

export interface LoadingProps {
  /**
   * @desc Loading 描述
   * @default 'Loading...'
   */
  description?: string
  /**
   * @desc 是否全屏
   * @default false
   */
  full?: boolean
  /**
   * @desc loading 的类型，未设置时回退为 beat
   */
  type?: LoadingAnimation
}
