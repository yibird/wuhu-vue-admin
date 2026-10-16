export interface GradientTextProps {
  /**
   * @desc 渐变颜色
   * @default
   */
  colors?: string[]
  /**
   * @desc 渐变方向
   * @default
   */
  direction?: string
  /**
   * @desc 是否启用流动动画
   * @default
   */
  animated?: boolean
  /**
   * @desc 动画周期(单位毫秒)
   * @default
   */
  duration?: number
  /**
   * @desc 渲染标签
   * @default 'span'
   */
  as?: string
}
