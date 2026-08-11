export interface DropdownProps {}
export interface DropdownEmits {
  (e: 'del'): void
}

export interface SiderProps {
  keys?: Array<string | number>
  data?: any[]
}
export interface SiderEmits {
  (e: 'change:keys', keys: Array<string | number>): void
}
