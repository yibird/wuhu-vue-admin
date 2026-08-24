import type { IMenu } from '#/config'

export interface LogoProps {
  /**
   * @desc 收缩状态
   * @default false
   */
  collapsed?: boolean
}

export interface SearchProps {
  collapsed?: boolean
}

export interface SearchEmits {
  (e: 'change', value: string): void
  (e: 'clear'): void
}

export interface SiderSearchResult {
  item: IMenu
  breadcrumb: string
}

export interface SearchPanelProps {
  keyword: string
  results: SiderSearchResult[]
  resultCount: number
  history: string[]
  historyExpanded: boolean
  canToggleHistory: boolean
  activeIndex: number
}

export interface SearchPanelEmits {
  (e: 'select', item: IMenu): void
  (e: 'select-history', keyword: string): void
  (e: 'remove-history', keyword: string): void
  (e: 'clear-history'): void
  (e: 'toggle-history'): void
  (e: 'active-change', index: number): void
}
