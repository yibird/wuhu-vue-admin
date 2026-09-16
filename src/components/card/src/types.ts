import type { CardProps, CardSlots } from 'antdv-next'

export interface WCardProps extends CardProps {
  /**
   * @desc 是否启用品牌色渐变背景
   * @default true
   */
  gradient?: boolean
}

export type WCardSlots = CardSlots
