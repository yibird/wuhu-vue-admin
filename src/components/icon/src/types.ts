export interface IconProps {
  /**
   * @desc icon 名称
   */
  name: string
  /**
   * @desc icon 大小
   * @default 14
   */
  size?: number | string
  /**
   * @desc icon color
   */
  color?: string
  /**
   * @desc icon prefix
   */
  prefix?: string
  /**
   * @desc 非装饰图标的可访问名称
   */
  label?: string
  /**
   * @desc rendered HTML tag
   * @default "i"
   */
  tag?: keyof HTMLElementTagNameMap
}
