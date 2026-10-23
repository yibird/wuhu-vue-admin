import type { SysDictData, SysDictType } from '@/apis'

export interface DropdownProps {
  item: SysDictType
}

export interface DropdownEmits {
  (e: 'edit', item: SysDictType): void
  (e: 'delete', item: SysDictType): void
}

export interface SiderProps {
  data: SysDictType[]
  loading?: boolean
  selectedId?: string
}

export interface SiderEmits {
  (e: 'select', item: SysDictType): void
  (e: 'create'): void
  (e: 'edit', item: SysDictType): void
  (e: 'delete', item: SysDictType): void
}

export interface DictHeaderProps {
  dictionary?: SysDictType
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

export type DictItem = SysDictData
