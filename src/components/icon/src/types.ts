export interface IconProps {
  /**
   * @desc 图标名称
   */
  name: string
  /**
   * @desc 图标大小
   * @default 14
   */
  size?: number | string
  /**
   * @desc 图标颜色
   */
  color?: string
  /**
   * @desc 图标类名前缀
   */
  prefix?: string
  /**
   * @desc 非装饰图标的可访问名称
   */
  label?: string
  /**
   * @desc 渲染的 HTML 标签
   * @default "i"
   */
  tag?: keyof HTMLElementTagNameMap
}
