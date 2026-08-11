import { TransitionPresets } from '@vueuse/core'

export interface NumberTickerProps {
  /** 目标数字 */
  value: number | string
  /** 动画时长 (毫秒)，默认 1500ms */
  duration?: number
  /** 保留小数位数，默认 0 */
  decimals?: number
  /** 前缀，如 "￥" 或 "$" */
  prefix?: string
  /** 后缀，如 "%" 或 "元" */
  suffix?: string
  /** 是否使用千分位分隔符 (如 1,234,567)，默认 true */
  useGrouping?: boolean
  /** Intl.NumberFormat 使用的区域设置。 */
  locale?: string | string[]
  /** 缓动曲线类型，默认 easeOutCubic */
  transition?: keyof typeof TransitionPresets
}
