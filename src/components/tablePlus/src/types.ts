import type { ToRefs, VNodeChild } from 'vue'

import type { TableProps } from 'antdv-next'

export type TablePlusColumn<T = Record<string, unknown>> = {
  _t?: T
  key?: string | number
  dataIndex?: string | number
  title?: string | (() => VNodeChild)
  show?: boolean
  customRender?: (opt: {
    text: any
    record: T
    index: number
    column: any
  }) => VNodeChild
  [key: string]: any
}

export interface TablePlusProps<T = any> extends Omit<
  TableProps<T>,
  'columns' | 'rowSelection'
> {
  checkedRowKeys?: Array<string | number>
  customRow?: (record: T, index: number) => any
  columns?: TablePlusColumn<T>[]
  striped?: boolean
  singleColumn?: boolean
  singleLine?: boolean
  /**
   * @desc 是否自动计算table大小(height和width)
   * @default true
   */
  autoSize?: boolean
  /**
   * @desc 是否开启序列号
   * @default true
   */
  indexCol?: boolean
  /**
   * @desc 选择列
   * @default true
   */
  selectionCol?: boolean
  /**
   * @desc 表格行选择
   * @default
   */
  rowSelection?: TablePlusColumn
  /**
   * @desc 右击菜单,扩展自DataTable rowProps
   * @default
   */
  contextMenu?: any[] | ((row: T, rowIndex: number) => any[])
}

export interface TablePlusEmits<T = any> {
  (
    e: 'update:checked-row-keys',
    keys: Array<string | number>,
    rows: T[],
    meta: {
      row: T | undefined
      action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }
  ): void
  (e: 'refresh'): void
}

export interface TablePlusSlots {
  headerLeft?: () => VNode[]
  headerRight?: () => VNode[]
}

export interface TableContextState<T> extends TablePlusProps<T> {
  fullScreen?: boolean
}

export type TablePlusProvide<T extends Record<string, any>> = ToRefs<
  Required<TableContextState<T>>
> & {
  emits: TablePlusEmits<T>
}
export interface TablePlusContext {}

export interface TablePlusContextMenuInstance {
  show: (e: MouseEvent, menuOptions?: any[]) => void
  hide: () => void
}
