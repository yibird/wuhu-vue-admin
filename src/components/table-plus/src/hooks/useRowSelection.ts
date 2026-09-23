import { ref, computed } from 'vue'

export interface UseRowSelectionOptions<T> {
  rowKey?: (row: T) => string | number
}

export function useRowSelection<T extends Record<string, any>>(
  options: UseRowSelectionOptions<T>
) {
  const { rowKey } = options
  const selectedKeys = ref<Array<string | number>>([])
  const selectedRows = ref<T[]>([])

  const handleCheck = (
    keys: Array<string | number>,
    rows: T[],
    _meta: {
      row?: T | undefined
      action?: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }
  ) => {
    selectedKeys.value = keys
    selectedRows.value = rows
  }

  const rowSelection = computed<any>(() => {
    return {
      type: 'selection',
    }
  })

  const selectedAll = (pageData: T[]) => {
    if (!rowKey) return
    const allKeys = pageData.map(rowKey)
    selectedKeys.value = allKeys
    selectedRows.value = pageData
  }

  const unSelectedAll = () => {
    selectedKeys.value = []
    selectedRows.value = []
  }

  const toggleAll = (pageData: T[]) => {
    if (selectedKeys.value.length === pageData.length) {
      unSelectedAll()
    } else {
      selectedAll(pageData)
    }
  }

  return {
    selectedKeys,
    selectedRows,
    rowSelection,
    handleCheck,
    selectedAll,
    unSelectedAll,
    toggleAll,
  }
}
