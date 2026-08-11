# Drag Row Sorting

## Description (en-US)

With custom elements, we can achieve drag-and-drop sorting using native browser APIs.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const dataSource = ref<DataType[]>([
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
])

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const dragKey = ref<string | null>(null)

const onRow: TableProps['onRow'] = record => ({
  draggable: true,
  onDragstart: () => {
    dragKey.value = record.key
  },
  onDragover: (event: DragEvent) => {
    event.preventDefault()
  },
  onDrop: () => {
    if (!dragKey.value || dragKey.value === record.key) {
      return
    }
    const current = [...dataSource.value]
    const fromIndex = current.findIndex(item => item.key === dragKey.value)
    const toIndex = current.findIndex(item => item.key === record.key)
    if (fromIndex === -1 || toIndex === -1) {
      return
    }
    const [moved] = current.splice(fromIndex, 1)
    current.splice(toIndex, 0, moved!)
    dataSource.value = current
    dragKey.value = null
  },
})
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource" :on-row="onRow" />
</template>
```
