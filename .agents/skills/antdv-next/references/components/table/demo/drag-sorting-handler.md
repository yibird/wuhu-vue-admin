# Drag Handle Sorting

## Description (en-US)

Implement a drag-and-drop operation column using native browser APIs.

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
  { title: '', key: 'sort', width: 48 },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const dragKey = ref<string | null>(null)

function onHandleDragStart(record: any, event: DragEvent) {
  dragKey.value = record.key
  event.dataTransfer?.setData('text/plain', record.key)
}

const onRow: TableProps['onRow'] = record => ({
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
  <a-table :columns="columns" :data-source="dataSource" :on-row="onRow">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'sort'">
        <span class="drag-handle color-text-tertiary" draggable="true" @dragstart="onHandleDragStart(record, $event)">::</span>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
```
