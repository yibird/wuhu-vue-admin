<template>
  <div
    ref="tableRef"
    class="table-plus-body p-10 pt-0 flex-1 overflow-hidden box-border"
  >
    <SelectionArea
      :options="{
        selectables: '.n-data-table-td',
        behaviour: {
          overlap: 'drop',
          scrolling: {
            speedDivider: 10,
            manualSpeed: 750,
          },
        },
      }"
      class="selection-container"
      style="border: 1px solid red"
      @start="onStart"
      @move="onMove"
      @stop="onStop"
    >
      <!-- <div class="flex gap-10">
        <div v-for="item in 10" class="size-40 bg-red ttt">{{ item }}</div>
      </div> -->

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
    </SelectionArea>
    <ContextMenu ref="contextMenuRef" />
  </div>
</template>
<script lang="ts" setup generic="T extends Record<string, any>">
import { proxyRefs } from 'vue'
import {
  SelectionArea,
  type SelectionEvent,
  type SelectionEvents,
} from '@viselect/vue'
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
  },
}
const tableRef = ref<HTMLDivElement>()
const { height, width, calculateSize } = useSize(tableRef, { autoSize })

const getColumns = computed(() => {
  const {
    selectionCol,
    indexCol,
    columns = [],
    rowSelection,
  } = proxyRefs(context)
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
        typeof contextMenu === 'function'
          ? contextMenu(row, rowIndex)
          : contextMenu
      if (menuOptions.length > 0) {
        contextMenuRef.value?.show(e, menuOptions)
      }
    },
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

let lastSelectedElements: Set<HTMLElement> = new Set()
const updateSelectionStyles = (selectedElements: Element[]) => {
  // 1. 仅清理上次选中的元素，提升性能
  lastSelectedElements.forEach((el) => {
    el.classList.remove('selected', 'b-t', 'b-b', 'b-l', 'b-r')
  })
  lastSelectedElements.clear()

  if (selectedElements.length === 0) return

  let minR = Infinity,
    maxR = -Infinity
  let minC = Infinity,
    maxC = -Infinity
  const validCells = new Map<HTMLElement, { r: number; c: number }>()

  // 2. 识别坐标
  selectedElements.forEach((el) => {
    const td = el.closest('.n-data-table-td') as HTMLTableCellElement
    if (!td) return
    const tr = td.parentElement as HTMLTableRowElement
    if (!tr) return

    // 注意：这里的 rowIndex 在有表头的情况下可能需要 -1，根据实际情况调整
    const r = tr.rowIndex
    const c = td.cellIndex

    validCells.set(td, { r, c })
    if (r < minR) minR = r
    if (r > maxR) maxR = r
    if (c < minC) minC = c
    if (c > maxC) maxC = c
  })

  // 3. 应用样式并记录
  validCells.forEach((pos, td) => {
    td.classList.add('selected')
    if (pos.r === minR) td.classList.add('b-t')
    if (pos.r === maxR) td.classList.add('b-b')
    if (pos.c === minC) td.classList.add('b-l')
    if (pos.c === maxC) td.classList.add('b-r')
    lastSelectedElements.add(td)
  })
}

const onStart = (v: SelectionEvent) => {
  const target = v.event?.target as HTMLElement
  if (!target.closest('.n-data-table-td')) return false
  updateSelectionStyles([])
}

const onMove = ({ store }: SelectionEvent) => {
  updateSelectionStyles(store.selected)
}

const onStop = ({ store }: SelectionEvent) => {
  updateSelectionStyles(store.selected)
}
</script>
<style scoped>
.selection-container {
  user-select: none;
  height: 100%;
  --s-w: 1px;
  --s-color: #18a058;
}

/* 框选时的半透明矩形罩子 */
:deep(.selection-area) {
  background: rgba(24, 160, 88, 0.15);
  border: 1px solid #18a058;
  z-index: 9999;
}

/* 选中状态：背景与层级 */
:deep(.n-data-table-td.selected) {
  background-color: rgba(24, 160, 88, 0.1) !important;
  /* 移除 position: relative !important; */
  /* 普通列提升 z-index 仍需要相对定位，但我们要避开固定列 */
}

/* 针对非固定列（普通列），可以使用 relative 提升层级而不影响布局 */
:deep(.n-data-table-td.selected:not([class*='--fixed'])) {
  position: relative;
  z-index: 5;
}

/* 针对固定列：保持其原有的 sticky，只强行提升 z-index */
:deep(.n-data-table-td[class*='--fixed'].selected) {
  /* 不要写 position: relative !important */
  z-index: 10 !important;
}

/* 核心：利用 after 伪元素绘制边框 */
:deep(.n-data-table-td.selected::after) {
  content: '';
  position: absolute;
  /* 对于 sticky 元素，absolute 也是相对于它定位的 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 15;
  border: 0 solid transparent;
}

/* 边框逻辑保持不变 */
:deep(.n-data-table-td.selected.b-t::after) {
  border-top: var(--s-w) solid var(--s-color);
}
:deep(.n-data-table-td.selected.b-b::after) {
  border-bottom: var(--s-w) solid var(--s-color);
}
:deep(.n-data-table-td.selected.b-l::after) {
  border-left: var(--s-w) solid var(--s-color);
}
:deep(.n-data-table-td.selected.b-r::after) {
  border-right: var(--s-w) solid var(--s-color);
}
</style>
