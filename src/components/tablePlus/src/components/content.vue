<template>
  <div
    ref="tableRef"
    class="table-plus-body p-10 pt-0 flex-1 overflow-hidden box-border"
  >
    <SelectionArea
      :options="{
        selectables: '.ant-table-cell',
        behaviour: {
          overlap: 'drop',
          scrolling: {
            speedDivider: 10,
            manualSpeed: 750,
          },
        },
      }"
      class="selection-container"
      @start="onStart"
      @move="onMove"
      @stop="onStop"
    >
      <a-table
        v-bind="proxyRefs(restProps)"
        :size="size"
        :columns="getColumns"
        :rowKey="rowKey"
        :customRow="getRowProps"
        :rowSelection="
          rowSelection
            ? {
                selectedRowKeys: innerCheckedRowKeys,
                onChange: onCheckedRowKeys,
              }
            : undefined
        "
        :scroll="{ y: height, x: width }"
        :pagination="false"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="slotProps">
          <slot :name="slot" v-bind="slotProps || {}" />
        </template>
      </a-table>
    </SelectionArea>
    <ContextMenu ref="contextMenuRef" />
  </div>
</template>
<script lang="ts" setup generic="T extends Record<string, any>">
import { proxyRefs } from 'vue'
import { SelectionArea, type SelectionEvent } from '@viselect/vue'
import { useRowProps, useSize } from '../composables'
import ContextMenu from './ContextMenu.vue'
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
  customRow,
  contextMenu = [],
  checkedRowKeys,
  fullScreen,
  emits,
  ...restProps
} = context

const contextMenuRef = ref<TablePlusContextMenuInstance>()
const innerCheckedRowKeys = ref(checkedRowKeys?.value ?? [])

const indexColumn: TablePlusColumn<T> = {
  title: '序号',
  key: 'index',
  fixed: 'left',
  width: 80,
  customRender: ({ index }: any) => index + 1,
}
const tableRef = ref<HTMLDivElement>()
const { height, width, calculateSize } = useSize(tableRef, { autoSize })

const getColumns = computed(() => {
  const { indexCol, columns = [] } = proxyRefs(context)
  const cols = columns.filter((item) => item.show)
  if (indexCol) {
    cols.unshift(indexColumn)
  }
  return cols
})

const getRowProps = useRowProps(customRow, (row: any, rowIndex: number) => {
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

const onCheckedRowKeys = (keys: Array<string | number>, rows: any[]) => {
  emits('update:checked-row-keys', keys, rows as T[], {
    row: undefined,
    action: 'check',
  })
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
    const td = el.closest('.ant-table-cell') as HTMLTableCellElement
    if (!td) return
    const tr = td.parentElement as HTMLTableRowElement
    if (!tr) return

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
  if (!target.closest('.ant-table-cell')) return false
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
  height: 100%;
  user-select: none;

  --s-w: 1px;
  --s-color: #18a058;
}

/* 框选时的半透明矩形罩子 */
:deep(.selection-area) {
  z-index: 9999;
  background: rgb(24 160 88 / 15%);
  border: 1px solid #18a058;
}

/* 选中状态：背景与层级 */
:deep(.ant-table-cell.selected) {
  background-color: rgb(24 160 88 / 10%) !important;
}

/* 针对非固定列（普通列），可以使用 relative 提升层级而不影响布局 */
:deep(.ant-table-cell.selected:not([class*='--fixed'])) {
  position: relative;
  z-index: 5;
}

/* 针对固定列：保持其原有的 sticky，只强行提升 z-index */
:deep(.ant-table-cell[class*='--fixed'].selected) {
  z-index: 10 !important;
}

/* 核心：利用 after 伪元素绘制边框 */
:deep(.ant-table-cell.selected::after) {
  position: absolute;

  /* 对于 sticky 元素，absolute 也是相对于它定位的 */
  inset: 0;
  z-index: 15;
  width: 100%;
  pointer-events: none;
  content: '';
  border: 0 solid transparent;
}

/* 边框逻辑保持不变 */
:deep(.ant-table-cell.selected.b-t::after) {
  border-top: var(--s-w) solid var(--s-color);
}

:deep(.ant-table-cell.selected.b-b::after) {
  border-bottom: var(--s-w) solid var(--s-color);
}

:deep(.ant-table-cell.selected.b-l::after) {
  border-left: var(--s-w) solid var(--s-color);
}

:deep(.ant-table-cell.selected.b-r::after) {
  width: calc(100% - 1px);
  border-right: var(--s-w) solid var(--s-color);
}
</style>
