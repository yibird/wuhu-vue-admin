import type { IMenu } from '#/config'
import type { MenuProps } from 'naive-ui'

export interface AppMenuProps extends Omit<MenuProps, 'items'> {
  items?: IMenu[]
  // collapsed?: boolean
  // collapsedWidth?: number
  // theme?: 'light' | 'dark'
  // mode?: 'horizontal' | 'vertical'
  // responsive?: boolean
  selectedKey?: string
  expandedKeys?: string[]
}

export interface MenuEmits {
  (e: 'open'): void
}
