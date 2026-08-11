# Edit Cell

## Description (en-US)

Table with editable cells.

## Source

```vue
<script setup lang="ts">
import type { TableDataIndex, TableProps } from 'antdv-next'
import { computed, ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: string
  address: string
}

const dataSource = ref<DataType[]>([
  { key: '0', name: 'Edward King 0', age: '32', address: 'London, Park Lane no. 0' },
  { key: '1', name: 'Edward King 1', age: '32', address: 'London, Park Lane no. 1' },
])
const count = ref(2)

const editing = ref<{ key: string, dataIndex: keyof DataType } | null>(null)
const inputValue = ref('')

const editableColumns = new Set(['name'])

function startEdit(record: Record<string, any>, dataIndex: TableDataIndex) {
  editing.value = { key: record.key, dataIndex }
  inputValue.value = String(record[dataIndex])
}

const columns = computed<TableProps['columns']>(() => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    onCell: (record) => {
      return {
        onClick() {
          startEdit(record, 'name')
        },
      }
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',

  },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Operation', key: 'operation' },
])
function saveEdit(record: Record<string, any>) {
  if (!editing.value) {
    return
  }
  const { dataIndex } = editing.value
  dataSource.value = dataSource.value.map((item) => {
    if (item.key === record.key) {
      return { ...item, [dataIndex]: inputValue.value }
    }
    return item
  })
  editing.value = null
}

function handleAdd() {
  const nextKey = String(count.value)
  dataSource.value = [
    ...dataSource.value,
    {
      key: nextKey,
      name: `Edward King ${nextKey}`,
      age: '32',
      address: `London, Park Lane no. ${nextKey}`,
    },
  ]
  count.value += 1
}

function handleDelete(key: string) {
  dataSource.value = dataSource.value.filter(item => item.key !== key)
  if (editing.value?.key === key) {
    editing.value = null
  }
}
</script>

<template>
  <div style="margin-bottom: 16px">
    <a-button type="primary" @click="handleAdd">
      Add a row
    </a-button>
  </div>
  <a-table :columns="columns" :data-source="dataSource" bordered>
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'operation'">
        <a-popconfirm title="Sure to delete?" @confirm="handleDelete(record.key)">
          <a>Delete</a>
        </a-popconfirm>
      </template>
      <template v-else-if="editableColumns.has(String(column.dataIndex))">
        <template v-if="editing && editing.key === record.key && editing.dataIndex === column.dataIndex">
          <a-input
            v-model:value="inputValue"
            @keyup.enter="saveEdit(record)"
            @blur="saveEdit(record)"
          />
        </template>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </template>
  </a-table>
</template>

<style>
.editable-cell {
  cursor: pointer;
  padding-inline-end: 24px;
}
</style>
```
