export interface ExceptionProps {
  /**
   * @desc 异常图片
   * @default
   */
  image?: string
  /**
   * @desc 异常标题
   * @default
   */
  title?: string
  /**
   * @desc 异常描述
   * @default
   */
  description?: string
  /**
   * @desc 是否显示返回首页按钮
   * @default true
   */
  showBtn?: boolean
  /**
   * 点击返回首页按钮时触发
   * @returns void
   */
  onClick?: () => void
}

export interface ExceptionSlots {
  title?: () => VNode[]
  description?: () => VNode[]
}
