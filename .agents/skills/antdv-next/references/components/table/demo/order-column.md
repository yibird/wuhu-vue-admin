# Order Columns

## Description (en-US)

You can control the order of the expand and select columns by using `Table.EXPAND_COLUMN` and `Table.SELECTION_COLUMN`.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { Table } from 'antdv-next'

interface DataType {
  key: number
  name: string
  age: number
  address: string
  description: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  Table.EXPAND_COLUMN,
  { title: 'Age', dataIndex: 'age', key: 'age' },
  Table.SELECTION_COLUMN,
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const dataSource: DataType[] = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
]
</script>

<template>
  <a-table
    :columns="columns"
    :row-selection="{}"
    :expandable="{ expandedRowRender: record => record.description }"
    :data-source="dataSource"
  />
</template>
```
