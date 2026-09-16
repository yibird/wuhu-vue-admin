import type { DictItemResp, DictResp } from '@/apis'

export interface DropdownProps {
  item: DictResp
}

export interface DropdownEmits {
  (e: 'edit', item: DictResp): void
  (e: 'delete', item: DictResp): void
}

export interface SiderProps {
  data: DictResp[]
  loading?: boolean
  selectedId?: string
}

export interface SiderEmits {
  (e: 'select', item: DictResp): void
  (e: 'create'): void
  (e: 'edit', item: DictResp): void
  (e: 'delete', item: DictResp): void
}

export interface DictHeaderProps {
  dictionary?: DictResp
  keyword?: string
  status?: boolean
}

export interface DictItemContentProps {
  dictId: string
  filters: DictItemFilters
}

export interface DictItemFilters {
  label?: string
  value?: string
  status?: boolean
}

export type DictItem = DictItemResp
