export interface IconProps {
  /**
   * @desc icon name
   */
  name: string
  /**
   * @desc icon size
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
   * @desc 是否为纯装饰图标。非装饰图标需要同时提供 label。
   * @default true
   */
  decorative?: boolean
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
