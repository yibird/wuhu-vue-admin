import type { CardProps, CardSlots } from 'antdv-next'

/**
 * WCard 基于 antdv Card：
 * - `gradient` 仅控制 WCard 自身的渐变背景，不会透传给 antdv / DOM
 * - 边框通过 `variant` 控制；旧属性 `bordered` 会映射为 `outlined` / `borderless`，
 *   未显式传入 `bordered` 时默认为 `borderless`
 */
export interface WCardProps extends CardProps {
  /**
   * @desc 是否启用品牌色渐变背景
   * @default true
   */
  gradient?: boolean
}

/**
 * WCard 插槽，与 antdv Card 保持一致
 */
export type WCardSlots = CardSlots
