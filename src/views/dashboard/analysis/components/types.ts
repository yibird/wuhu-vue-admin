export interface Card {
  id: number
  title: string
  value: number
  description: string
  totalValue: string
  icon: string
}

export interface CardListProps {
  items?: Card[]
}

export interface CardItemProps {
  index: number
  item?: Card
}
export interface CardItemEmits {
  (e: 'change', val: string, index: number): void
}

export interface CardItemExtraEmits {
  (e: 'change', val: string): void
}
