export interface IconProps {
  /**
   * @desc icon 名称
   * @default
   */
  name: string
  /**
   * @desc icon 大小
   * @default 14
   */
  size?: number | string
  /**
   * @desc icon颜色
   * @default
   */
  color?: string
  /**
   * @desc icon前缀
   * @default "i-ri:"
   */
  prefix?: string
  /**
   * @desc 渲染的 HTML 标签
   * @default "i"
   */
  tag?: string
}
