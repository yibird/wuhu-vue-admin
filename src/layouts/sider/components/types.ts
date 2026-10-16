import type { IMenu } from '#/config'
import type { MenuProps as AntdvMenuProps } from 'antdv-next'
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

export interface MenuProps extends Omit<AntdvMenuProps, 'items'> {
  items?: IMenu[]
  collapsed?: boolean
  theme?: 'light' | 'dark'
  mode?: 'horizontal' | 'vertical' | 'inline'
  selectedKey?: string
  expandedKeys?: string[]
}
