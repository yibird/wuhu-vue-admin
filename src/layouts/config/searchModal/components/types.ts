import type { IMenu } from '#/config'

export interface SearchProps {}
export interface SearchEmits {}

export interface ListProps {
  items?: IMenu[]
  searchValue?: string
}
export interface ListEmits {
  (e: 'select', params: { item: IMenu; index: number }): void
}
