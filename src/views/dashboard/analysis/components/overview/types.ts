/**
 * 总览卡片的统计周期
 */
export type StatPeriod = 'year' | 'month' | 'day'

/**
 * 各统计周期对应的数值
 */
export type PeriodValues = Record<StatPeriod, number>

export interface OverviewCard {
  id: number
  title: string
  description: string
  icon: string
  /** 各周期的数值,随卡片右上角的周期切换 */
  values: PeriodValues
  /** 累计值,不随周期变化 */
  totalValue: string
}

export interface CardListProps {
  items?: OverviewCard[]
}

export interface CardItemProps {
  item?: OverviewCard
}
