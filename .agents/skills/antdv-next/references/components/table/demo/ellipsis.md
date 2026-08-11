# Ellipsis

## Description (en-US)

Ellipsis cell content via setting `column.ellipsis`.

> Cannot ellipsis table header with sorters and filters for now.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
  { title: 'Address', dataIndex: 'address', key: 'address 1', ellipsis: true },
  { title: 'Long Column Long Column Long Column', dataIndex: 'address', key: 'address 2', ellipsis: true },
  { title: 'Long Column Long Column', dataIndex: 'address', key: 'address 3', ellipsis: true },
  { title: 'Long Column', dataIndex: 'address', key: 'address 4', ellipsis: true },
]

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park, Sydney No. 1 Lake Park',
  },
]
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'name'">
        <a>{{ text }}</a>
      </template>
    </template>
  </a-table>
</template>
```
