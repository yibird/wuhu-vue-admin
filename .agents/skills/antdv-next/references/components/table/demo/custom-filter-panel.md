# Custom Filter Panel

## Description (en-US)

Implement a customized column search example via `filterDropdown`.

Add the `boolean` type parameter `closeDropdown` to the function `clearFilters`. Whether to close the filter menu is `true` by default. Add the `boolean` type parameter `confirm` to clear whether to submit the option during filtering. The default is `true`.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { SearchOutlined } from '@antdv-next/icons'
import { h, nextTick, ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

type DataIndex = keyof DataType

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Joe Black', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Jim Green', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
]

const searchText = ref('')
const searchedColumn = ref<DataIndex | ''>('')
const searchInput = ref<any>(null)

function handleSearch(selectedKeys: string[], confirm: any, dataIndex: DataIndex) {
  confirm()
  searchText.value = selectedKeys[0] || ''
  searchedColumn.value = dataIndex
}

function handleReset(clearFilters?: () => void) {
  clearFilters?.()
  searchText.value = ''
}

function highlightText(text: string, keyword: string) {
  if (!keyword) {
    return text
  }
  const lowerText = text.toLowerCase()
  const lowerKey = keyword.toLowerCase()
  const index = lowerText.indexOf(lowerKey)
  if (index === -1) {
    return text
  }
  const before = text.slice(0, index)
  const match = text.slice(index, index + keyword.length)
  const after = text.slice(index + keyword.length)
  return [before, h('mark', { class: 'table-highlight' }, match), after]
}

function getColumnSearchProps(dataIndex: DataIndex): NonNullable<TableProps['columns']>[number] {
  return {
    filterDropdown: () => null,
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          nextTick(() => {
            searchInput.value?.focus?.()
            searchInput.value?.select?.()
          })
        }
      },
    },
    onFilter: (value, record) => String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
    render: (text) => {
      const raw = text ? String(text) : ''
      if (searchedColumn.value === dataIndex) {
        return highlightText(raw, searchText.value)
      }
      return raw
    },
  }
}

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    ...getColumnSearchProps('name'),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '20%',
    ...getColumnSearchProps('age'),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    ...getColumnSearchProps('address'),
    sorter: (a, b) => a.address.length - b.address.length,
    sortDirections: ['descend', 'ascend'],
  },
]

function getDataIndex(column: any): DataIndex | null {
  const dataIndex = column?.dataIndex
  if (typeof dataIndex === 'string') {
    return dataIndex as DataIndex
  }
  return null
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #filterIcon="{ filtered }">
      <SearchOutlined :style="{ color: filtered ? '#1677ff' : undefined }" />
    </template>
    <template #filterDropdown="{ column, setSelectedKeys, selectedKeys, confirm, clearFilters, close }">
      <template v-if="getDataIndex(column)">
        <div class="p-8px" @keydown.stop>
          <a-input
            ref="searchInput"
            class="mb-8px block"
            :placeholder="`Search111 ${getDataIndex(column)}`"
            :value="String(selectedKeys[0] || '')"
            @update:value="value => setSelectedKeys(value ? [String(value)] : [])"
            @keydown.enter="handleSearch(selectedKeys as string[], confirm, getDataIndex(column)!)"
          />
          <a-space>
            <a-button
              type="primary"
              size="small"
              style="width: 90px"
              @click="handleSearch(selectedKeys as string[], confirm, getDataIndex(column)!)"
            >
              Search
            </a-button>
            <a-button
              size="small"
              style="width: 90px"
              @click="handleReset(clearFilters)"
            >
              Reset
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="() => { confirm({ closeDropdown: false }); searchText = String(selectedKeys[0] || ''); searchedColumn = getDataIndex(column)! }"
            >
              Filter
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="close?.()"
            >
              Close
            </a-button>
          </a-space>
        </div>
      </template>
    </template>
  </a-table>
</template>

<style>
.table-highlight {
  background: #ffc069;
  padding: 0;
}
</style>
```
