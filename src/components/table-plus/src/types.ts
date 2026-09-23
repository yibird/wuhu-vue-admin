import type { ToRefs, VNodeChild } from 'vue'

import type { TableProps } from 'antdv-next'

export type TablePlusColumn<T = Record<string, unknown>> = {
  /**
   * 列数据类型占位
   */
  _t?: T
  /**
   * 列唯一标识
   */
  key?: string | number
  /**
   * 列数据在数据项中对应的路径
   */
  dataIndex?: string | number
  /**
   * 列标题
   */
  title?: string | (() => VNodeChild)
  /**
   * 是否显示该列
   */
  show?: boolean
  /**
   * 自定义单元格渲染
   */
  customRender?: (opt: {
    /**
     * 当前单元格文本
     */
    text: unknown
    /**
     * 当前行数据
     */
    record: T
    /**
     * 当前行索引
     */
    index: number
    /**
     * 当前列配置
     */
    column: unknown
  }) => VNodeChild
  /**
   * 其他列配置
   */
  [key: string]: any
}

export interface TablePlusProps<T = any> extends Omit<
  TableProps<T>,
  'columns' | 'rowSelection'
> {
  /**
   * @desc 已选中的行 key
   */
  checkedRowKeys?: Array<string | number>
  /**
   * @desc 自定义行属性
   */
  customRow?: (record: T, index: number) => Record<string, unknown>
  /**
   * @desc 表格列配置
   * @default []
   */
  columns?: TablePlusColumn<T>[]
  /**
   * @desc 是否斑马纹
   * @default false
   */
  striped?: boolean
  /**
   * @desc 是否单列显示
   * @default false
   */
  singleColumn?: boolean
  /**
   * @desc 是否单行显示
   * @default false
   */
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
   */
  rowSelection?: TablePlusColumn
  /**
   * @desc 右击菜单,扩展自DataTable rowProps
   */
  contextMenu?: any[] | ((row: T, rowIndex: number) => any[])
}

export interface TablePlusEmits<T = any> {
  /**
   * @desc 选中行变化时触发
   */
  (
    e: 'update:checked-row-keys',
    keys: Array<string | number>,
    rows: T[],
    meta: {
      /**
       * 触发操作的行
       */
      row: T | undefined
      /**
       * 触发操作的类型
       */
      action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }
  ): void
  /**
   * @desc 刷新时触发
   */
  (e: 'refresh'): void
}

export interface TablePlusSlots<
  T extends Record<string, any> = Record<string, any>,
> {
  /**
   * @desc 表格头部左侧内容
   */
  headerLeft?: () => VNode[]
  /**
   * @desc 表格头部右侧内容
   */
  headerRight?: () => VNode[]
  /**
   * @desc 自定义单元格内容
   */
  bodyCell?: (props: {
    /**
     * 当前单元格文本
     */
    text: unknown
    /**
     * 当前行数据
     */
    record: T
    /**
     * 当前行索引
     */
    index: number
    /**
     * 当前列配置
     */
    column: TablePlusColumn<T>
  }) => VNodeChild
}

export interface TableContextState<T> extends TablePlusProps<T> {
  /**
   * 是否全屏
   */
  fullScreen?: boolean
}

export type TablePlusProvide<T extends Record<string, any>> = ToRefs<
  Required<TableContextState<T>>
> & {
  /**
   * 表格事件
   */
  emits: TablePlusEmits<T>
}
export interface TablePlusContext {}

export interface TablePlusContextMenuInstance {
  /**
   * @desc 显示右键菜单
   */
  show: (e: MouseEvent, menuOptions?: any[]) => void
  /**
   * @desc 隐藏右键菜单
   */
  hide: () => void
}
