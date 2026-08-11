import type { IMenu } from '#/config'
import type { MenuProps } from 'antdv-next'

export interface AppMenuProps extends Omit<MenuProps, 'items'> {
  items?: IMenu[]
  collapsed?: boolean
  theme?: 'light' | 'dark'
  mode?: 'horizontal' | 'vertical' | 'inline'
  selectedKey?: string
  expandedKeys?: string[]
}
