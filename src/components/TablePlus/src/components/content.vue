<template>
  <div ref="tableRef" class="table-plus-body p-10 pt-0 flex-1 overflow-hidden box-border">
    <n-data-table
      v-bind="proxyRefs(restProps)"
      :remote="true"
      :size="size"
      :columns="getColumns"
      :row-key="rowKey"
      :row-props="getRowProps"
      :checked-row-keys="innerCheckedRowKeys"
      :max-height="height"
      :scroll-x="width"
      @update:checked-row-keys="onCheckedRowKeys"
    >
      <template v-for="slot in $slots">
        <slot :name="slot" />
      </template>
    </n-data-table>
    <ContextMenu ref="contextMenuRef" />
  </div>
</template>
<script lang="ts" setup generic="T extends Record<string, any>">
import { proxyRefs } from 'vue'
import { useRowProps, useSize } from '../composables'
import ContextMenu from './context-menu.vue'
import { useTablePlusInject } from '../context'

import type { TablePlusColumn, TablePlusContextMenuInstance } from '../types'

const context = useTablePlusInject<T>()
const {
  autoSize = true,
  size,
  columns = [],
  rowSelection,
  selectionCol = true,
  indexCol = true,
  rowKey,
  rowProps,
  contextMenu = [],
  checkedRowKeys,
  fullScreen,
  emits,
  ...restProps
} = context

const contextMenuRef = ref<TablePlusContextMenuInstance>()
const innerCheckedRowKeys = ref(checkedRowKeys?.value ?? [])

const indexColumn: TablePlusColumn = {
  title: '序号',
  key: 'index',
  fixed: 'left',
  minWidth: 80,
  width: 80,
  render(rowData, rowIndex) {
    return rowIndex + 1
  }
}
const tableRef = ref<HTMLDivElement>()
const { height, width, calculateSize } = useSize(tableRef, { autoSize })

const getColumns = computed(() => {
  const { selectionCol, indexCol, columns = [], rowSelection } = proxyRefs(context)
  const cols = columns.filter((item) => item.show)
  if (indexCol) {
    cols.unshift(indexColumn)
  }
  if (selectionCol && rowSelection) {
    cols.unshift(rowSelection as TablePlusColumn)
  }
  return cols
})

const getRowProps = useRowProps(rowProps, (row, rowIndex) => {
  const { contextMenu = [] } = proxyRefs(context)
  return {
    onContextmenu(e: MouseEvent) {
      const menuOptions =
        typeof contextMenu === 'function' ? contextMenu(row, rowIndex) : contextMenu
      if (menuOptions.length > 0) {
        contextMenuRef.value?.show(e, menuOptions)
      }
    }
  }
})

const onCheckedRowKeys = (
  keys: Array<string | number>,
  rows: Record<string, any>[],
  meta: {
    row: Record<string, any> | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }
) => {
  emits(
    'update:checked-row-keys',
    keys,
    rows as T[],
    meta as {
      row: T | undefined
      action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }
  )
}

watch(
  () => context.checkedRowKeys?.value,
  (val) => {
    innerCheckedRowKeys.value = val ?? []
  }
)

watch(size, () => {
  calculateSize()
})
</script>
