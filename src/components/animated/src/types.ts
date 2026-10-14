import type { VNodeChild } from 'vue'
import type { MotionProps } from 'motion-v'

export type MotionType = 'smooth' | 'reorder'

/**
 * AnimatedGroup 插槽
 */
export interface AnimatedGroupSlots<T> {
  /**
   * @desc 列表项渲染插槽,参数为当前列表项元素
   */
  default?: (props: { item: T }) => VNodeChild
}

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

  /**
   * @desc 动画预设
   * @default 'smooth'
   */
  motionType?: MotionType
  motionAs?: MotionProps['as']
  layout?: boolean | 'position' | 'size'
  motionClass?: string
  getKey: (item: T) => string | number
}
