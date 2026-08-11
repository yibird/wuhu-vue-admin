# Expand Sticky

## Description (en-US)

Use `expandedRowOffset` to customize the offset of the expanded sub-table columns index

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { Table } from 'antdv-next'

interface DataType {
  key: number
  team: string
  name: string
  age: number
  address: string
  description: string
}

const columns: TableProps['columns'] = [
  {
    title: 'Team',
    dataIndex: 'team',
    key: 'team',
    onCell: (_record, index = 0) => (index % 2 === 0 ? { rowSpan: 2 } : { rowSpan: 0 }),
    width: 100,
  },
  Table.EXPAND_COLUMN,
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', dataIndex: '', key: 'x' },
]

const dataSource: DataType[] = [
  {
    key: 1,
    team: 'Team A',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    team: 'Team A',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    team: 'Team B',
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    team: 'Team B',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
]
</script>

<template>
  <a-table
    bordered
    :columns="columns"
    :data-source="dataSource"
    :expandable="{ expandedRowOffset: 3 }"
  >
    <template #expandedRowRender="{ record }">
      <div>{{ record.description }}</div>
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'x'">
        <a>Delete</a>
      </template>
    </template>
  </a-table>
</template>
```
