import type {
  CardProps as AntdvCardProps,
  CardSlots as AntdvCardSlots,
} from 'antdv-next'

export interface CardProps extends AntdvCardProps {
  /**
   * @desc 是否启用品牌色渐变背景
   * @default true
   */
  gradient?: boolean
}

export type CardSlots = AntdvCardSlots
