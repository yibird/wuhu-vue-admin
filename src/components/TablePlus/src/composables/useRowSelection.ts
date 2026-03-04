import type { DataTableSelectionColumn } from 'naive-ui'
import type { TablePlusProps } from '../types'

const SELECTED_ALL = 'selectedAll'
const SELECTED_CURRENT_PAGE = 'selectedCurrentPage'
const CANCEL_ALL = 'cancelAll'
const CANCEL_CURRENT_PAGE = 'cancelCurrentPage'

export interface UseRowSelectionOptions<T> {
  /**
   * @desc 行key
   */
  rowKey?: TablePlusProps<T>['rowKey']
  multiple?: boolean
  /**
   * 默认选中的key
   */
  checkedRowKeys?: TablePlusProps<T>['checkedRowKeys']
}

export function useRowSelection<T extends Record<string, any> = object>({
  rowKey,
  multiple = true,
  checkedRowKeys = []
}: UseRowSelectionOptions<T>) {
  const selectedAll = ref(false)
  const selectedKeys = ref<Array<string | number>>(checkedRowKeys)
  const selectedRows = ref<T[]>([])

  // 取消选中的key集合
  const cancelSelectedKey = ref<Array<string | number>>([])
  const cancelSelectedRows = ref<T[]>([])

  const rowSelection: DataTableSelectionColumn = {
    type: 'selection',
    width: 60,
    multiple,
    fixed: 'left',
    options: [
      {
        label: '选择全部',
        key: SELECTED_ALL,
        onSelect: (pageData) => {
          if (typeof rowKey !== 'function') return
          selectedKeys.value = pageData.map(rowKey)
          selectedRows.value = pageData as T[]
        }
      },
      {
        label: '选择当前页',
        key: SELECTED_CURRENT_PAGE,
        onSelect: (pageData) => {
          if (typeof rowKey !== 'function') {
            return
          }
          selectedRows.value = pageData as T[]
        }
      },
      {
        label: '取消全部',
        key: CANCEL_ALL,
        onSelect: () => {
          selectedKeys.value = []
          selectedRows.value = []
        }
      },
      {
        label: '取消选中当前页',
        key: CANCEL_CURRENT_PAGE,
        onSelect: (pageData) => {}
      }
    ]
  }

  const handleCheck = (
    keys: Array<string | number>,
    rows: Record<string, any>[],
    meta: {
      row: Record<string, any> | undefined
      action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }
  ) => {
    console.log('Asdasd:', selectedKeys)
    switch (meta.action) {
      case 'checkAll':
        selectedAll.value = true
        selectedKeys.value = keys
        selectedRows.value = rows as T[]
        break
      case 'uncheckAll':
        selectedAll.value = false
        selectedKeys.value = keys
        selectedRows.value = rows as T[]
        break
      case 'check':
        selectedKeys.value = keys
        break
      case 'uncheck':
        selectedKeys.value = keys
        break
    }
  }

  return {
    rowSelection,
    selectedAll,
    selectedKeys,
    selectedRows,
    cancelSelectedKey,
    cancelSelectedRows,
    rowKey,
    handleCheck
  }
}
