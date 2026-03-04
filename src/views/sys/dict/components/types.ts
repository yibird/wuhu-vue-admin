import type { TreeOption } from 'naive-ui'

export interface DropdownProps {}
export interface DropdownEmits {
  (e: 'del'): void
}

export interface SiderProps {
  keys?: Array<string | number>
  data?: TreeOption[]
}
export interface SiderEmits {
  (e: 'change:keys', keys: Array<string | number>): void
}
