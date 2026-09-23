import type { MotionProps, Options } from 'motion-v'

export type MotionType = 'smooth' | 'reorder'

export interface AnimatedGroupProps<T> {
  items: T[]
  as?: string
  mode?: 'sync' | 'popLayout' | 'wait'
  initial?: boolean
  class?: string

  /**
   * @desc LayoutGroup 的命名空间 id,同页存在多组布局动画时应各自唯一,避免互相配对
   */
  id?: string
  /**
   * @desc 是否遵循系统「减少动态效果」偏好,取值同 motion-v 的 MotionConfig
   *
   * 不传时不注入 MotionConfig,沿用外层配置或 motion-v 默认值
   */
  reducedMotion?: 'user' | 'never' | 'always'

  motionType?: MotionType
  motionAs?: MotionProps['as']
  layout?: boolean | 'position' | 'size'
  motionInitial?: Options['initial']
  motionAnimate?: Options['animate']
  motionExit?: Options['exit']
  motionTransition?: Options['transition']
  motionClass?: string
  getKey: (item: T) => string | number
}
