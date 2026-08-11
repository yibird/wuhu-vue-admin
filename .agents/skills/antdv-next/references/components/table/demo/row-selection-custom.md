# Custom Selection

## Description (en-US)

Use `rowSelection.selections` custom selections, default no select dropdown, show default selections via setting to `true`.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { Table } from 'antdv-next'
import { computed, ref } from 'vue'

type TableRowSelection = TableProps['rowSelection']
type Key = string | number

interface DataType {
  key: Key
  name: string
  age: number
  address: string
}

const dataSource = Array.from({ length: 46 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}))

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const selectedRowKeys = ref<Key[]>([])

function onSelectChange(newSelectedRowKeys: Key[]) {
  console.log('selectedRowKeys changed: ', newSelectedRowKeys)
  selectedRowKeys.value = newSelectedRowKeys
}

const rowSelection = computed<TableRowSelection>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange,
  selections: [
    Table.SELECTION_ALL,
    Table.SELECTION_INVERT,
    Table.SELECTION_NONE,
    {
      key: 'odd',
      text: 'Select Odd Row',
      onSelect: (changeableRowKeys) => {
        selectedRowKeys.value = (changeableRowKeys as Key[]).filter((_, index) => index % 2 === 0)
      },
    },
    {
      key: 'even',
      text: 'Select Even Row',
      onSelect: (changeableRowKeys) => {
        selectedRowKeys.value = (changeableRowKeys as Key[]).filter((_, index) => index % 2 === 1)
      },
    },
  ],
}))
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection" />
</template>
```
