# Header & Body Cell Slots

## Description (en-US)

Customize header and body cells via the headerCell and bodyCell slots.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataItem {
  key: string
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const dataSource: DataItem[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
]

function handleAction(record: Record<string, any>) {
  console.log('Action:', record.name)
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span class="table-header-strong">{{ column.title }}</span>
      </template>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.key === 'name'">
        <a class="table-name" @click.prevent="handleAction(record)">{{ text }}</a>
      </template>
      <template v-else-if="column.key === 'action'">
        <a @click.prevent="handleAction(record)">Action</a>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.table-header-strong {
  font-weight: 600;
}

.table-name {
  color: var(--ant-color-link);
}
</style>
```
