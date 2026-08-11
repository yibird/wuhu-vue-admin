# Ajax

## Description (en-US)

This example shows how to fetch and present data from a remote server, and how to implement filtering and sorting in server side by sending related parameters to server.

Setting `rowSelection.preserveSelectedRowKeys` to keep the `key` when enable selection.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { reactive, ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const columns: TableProps<DataType>['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const loading = ref(false)
const dataSource = ref<DataType[]>([])

const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  showSizeChanger: true,
})

function makeData(page: number, pageSize: number) {
  const data: DataType[] = []
  for (let i = 0; i < pageSize; i++) {
    const index = (page - 1) * pageSize + i + 1
    data.push({
      key: `${index}`,
      name: `Edward ${index}`,
      age: 20 + (index % 10),
      address: `London, Park Lane no. ${index}`,
    })
  }
  return data
}

function fetchData() {
  loading.value = true
  const { current, pageSize } = pagination
  setTimeout(() => {
    dataSource.value = makeData(current, pageSize)
    pagination.total = 46
    loading.value = false
  }, 500)
}

function handleTableChange(pager: any) {
  console.log(pager)
  pagination.current = pager.current
  pagination.pageSize = pager.pageSize
  fetchData()
}

fetchData()
</script>

<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  />
</template>
```
