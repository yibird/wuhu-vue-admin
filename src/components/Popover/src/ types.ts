export type TriggerType = 'click' | 'hover'
export interface PopoverProps {
  /**
   * @desc 是否使用动画
   * @default true
   */
  animated?: boolean
  /**
   * @desc 触发方式
   * @default click
   */
  trigger?: TriggerType
  /**
   * @default 层级
   * @default 2000
   */
  zIndex?: number
  /**
   * @desc 目标挂载元素
   * @default
   */
  to?: string | HTMLElement | false
}
