import type { ToRefs, VNodeChild } from 'vue'
import type { DataTableColumn, DataTableProps, MenuOption } from 'naive-ui'

export type TablePlusColumn<T = Record<string, unknown>> =
  DataTableColumn<T> & {
    key?: string | number
    title?: string | (() => VNodeChild)
    show?: boolean
  }

export interface NDataTableProps {
  allowCheckingNotLoaded?: DataTableProps['allowCheckingNotLoaded']
  bordered?: DataTableProps['bordered']
  bottomBordered?: DataTableProps['bottomBordered']
  checkedRowKeys?: DataTableProps['checkedRowKeys']
  cascade?: DataTableProps['cascade']
  childrenKey?: DataTableProps['childrenKey']
  data?: DataTableProps['data']
  defaultCheckedRowKeys?: DataTableProps['defaultCheckedRowKeys']
  defaultExpandedRowKeys?: DataTableProps['defaultExpandedRowKeys']
  defaultExpandAll?: DataTableProps['defaultExpandAll']
  expandedRowKeys?: DataTableProps['expandedRowKeys']
  filterIconPopoverProps?: DataTableProps['filterIconPopoverProps']
  flexHeight?: DataTableProps['flexHeight']
  getCsvCell?: DataTableProps['getCsvCell']
  getCsvHeader?: DataTableProps['getCsvHeader']
  headerHeight?: DataTableProps['headerHeight']
  heightForRow?: DataTableProps['heightForRow']
  indent?: DataTableProps['indent']
  loading?: DataTableProps['loading']
  maxHeight?: DataTableProps['maxHeight']
  minHeight?: DataTableProps['minHeight']
  minRowHeight?: DataTableProps['minRowHeight']
  paginateSinglePage?: DataTableProps['paginateSinglePage']
  pagination?: DataTableProps['pagination']
  paginationBehaviorOnFilter?: DataTableProps['paginationBehaviorOnFilter']
  remote?: DataTableProps['remote']
  renderCell?: DataTableProps['renderCell']
  renderExpandIcon?: DataTableProps['renderExpandIcon']
  rowClassName?: DataTableProps['rowClassName']
  rowKey?: DataTableProps['rowKey']
  rowProps?: DataTableProps['rowProps']
  scrollX?: DataTableProps['scrollX']
  scrollbarProps?: DataTableProps['scrollbarProps']
  singleColumn?: DataTableProps['singleColumn']
  singleLine?: DataTableProps['singleLine']
  size?: DataTableProps['size']
  spinProps?: DataTableProps['spinProps']
  stickyExpandedRows?: DataTableProps['stickyExpandedRows']
  striped?: DataTableProps['striped']
  summary?: DataTableProps['summary']
  summaryPlacement?: DataTableProps['summaryPlacement']
  tableLayout?: DataTableProps['tableLayout']
  virtualScroll?: DataTableProps['virtualScroll']
  virtualScrollHeader?: DataTableProps['virtualScrollHeader']
  virtualScrollX?: DataTableProps['virtualScrollX']
}

export interface TablePlusProps<T = object> extends NDataTableProps {
  columns?: TablePlusColumn<T>[]
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
  contextMenu?: MenuOption[] | ((row: T, rowIndex: number) => MenuOption[])
}

export interface TablePlusEmits<T> {
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
  show: (e: MouseEvent, menuOptions?: MenuOption[]) => void
  hide: () => void
}
