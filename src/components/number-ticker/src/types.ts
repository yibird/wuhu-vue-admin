import { TransitionPresets } from '@vueuse/core'

export interface NumberTickerProps {
  /**
   * @desc 目标数字
   */
  value: number | string
  /**
   * @desc 动画时长（毫秒）
   * @default 1500
   */
  duration?: number
  /**
   * @desc 保留小数位数
   * @default 0
   */
  decimals?: number
  /**
   * @desc 前缀，如 "￥" 或 "$"
   * @default ''
   */
  prefix?: string
  /**
   * @desc 后缀，如 "%" 或 "元"
   * @default ''
   */
  suffix?: string
  /**
   * @desc 是否使用千分位分隔符（如 1,234,567）
   * @default true
   */
  useGrouping?: boolean
  /**
   * @desc Intl.NumberFormat 使用的区域设置
   */
  locale?: string | string[]
  /**
   * @desc 缓动曲线类型
   * @default 'easeOutCubic'
   */
  transition?: keyof typeof TransitionPresets
}
