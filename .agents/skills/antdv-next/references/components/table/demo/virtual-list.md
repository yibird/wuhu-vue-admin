# Virtual List

## Description (en-US)

Set `virtual` to enable virtual scroll, and `scroll.x` and `scroll.y` must be set at the same time with `number` type.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { computed, ref } from 'vue'

interface RecordType {
  id: number
  firstName: string
  lastName: string
  age: number
  address1: string
  address2: string
  address3: string
}

const fixedColumns: TableProps['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'start',
  },
  {
    title: 'FistName',
    dataIndex: 'firstName',
    width: 120,
    fixed: 'start',
  },
  {
    title: 'LastName',
    dataIndex: 'lastName',
    width: 120,
    fixed: 'start',
  },
  {
    title: 'Group',
    key: 'group',
    width: 120,
    render: (_text, record) => `Group ${Math.floor(record.id / 4)}`,
    onCell: record => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 100,
    onCell: record => ({
      colSpan: record.id % 4 === 0 ? 2 : 1,
    }),
  },
  {
    title: 'Address 1',
    dataIndex: 'address1',
    onCell: record => ({
      colSpan: record.id % 4 === 0 ? 0 : 1,
    }),
  },
  {
    title: 'Address 2',
    dataIndex: 'address2',
  },
  {
    title: 'Address 3',
    dataIndex: 'address3',
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
    fixed: 'end',
  },
]

const columns: TableProps['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: 'FistName',
    dataIndex: 'firstName',
    width: 120,
  },
  {
    title: 'LastName',
    dataIndex: 'lastName',
  },
]

const fixed = ref(true)
const bordered = ref(true)
const expanded = ref(false)
const empty = ref(false)
const count = ref(10000)
const tableRef = ref<any>(null)

const countOptions = [
  { label: 'None', value: 0 },
  { label: 'Less', value: 4 },
  { label: 'Lot', value: 10000 },
]

function getData(length: number) {
  return Array.from({ length }).map<RecordType>((_, index) => ({
    id: index,
    firstName: `First_${index.toString(16)}`,
    lastName: `Last_${index.toString(16)}`,
    age: 25 + (index % 10),
    address1: `New York No. ${index} Lake Park`,
    address2: `London No. ${index} Lake Park`,
    address3: `Sydney No. ${index} Lake Park`,
  }))
}

const data = computed(() => getData(count.value))

const mergedColumns = computed<TableProps['columns']>(() => {
  if (!fixed.value) {
    return columns
  }

  if (!expanded.value) {
    return fixedColumns
  }

  return fixedColumns.map(column => ({ ...column, onCell: undefined }))
})

const expandableProps = computed<TableProps['expandable']>(() => {
  if (!expanded.value) {
    return undefined
  }
  return {
    columnWidth: 48,
    rowExpandable: record => record.id % 2 === 0,
  }
})

const tableData = computed(() => (empty.value ? [] : data.value))

function scrollToIndex() {
  tableRef.value?.scrollTo?.({ index: 999 })
}
</script>

<template>
  <div style="padding: 64px">
    <a-space direction="vertical" style="width: 100%">
      <a-space wrap>
        <a-switch
          v-model:checked="bordered"
          checked-children="Bordered"
          un-checked-children="Bordered"
        />
        <a-switch
          v-model:checked="fixed"
          checked-children="Fixed"
          un-checked-children="Fixed"
        />
        <a-switch
          v-model:checked="expanded"
          checked-children="Expandable"
          un-checked-children="Expandable"
        />
        <a-switch
          v-model:checked="empty"
          checked-children="Empty"
          un-checked-children="Empty"
        />
        <a-segmented v-model:value="count" :options="countOptions" />
        <a-button v-if="data.length >= 999" @click="scrollToIndex">
          Scroll To index 999
        </a-button>
      </a-space>
      <a-table
        ref="tableRef"
        virtual
        :bordered="bordered"
        :columns="mergedColumns"
        :scroll="{ x: 2000, y: 400 }"
        :row-key="record => record.id"
        :data-source="tableData"
        :pagination="false"
        :row-selection="expanded ? undefined : { type: 'radio', columnWidth: 48 }"
        :expandable="expandableProps"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-typography-link>Action1</a-typography-link>
              <a-typography-link>Action2</a-typography-link>
            </a-space>
          </template>
        </template>
        <template v-if="expanded" #expandedRowRender="{ record }">
          <p style="margin: 0">
            🎉 Expanded {{ record.address1 }}
          </p>
        </template>
      </a-table>
    </a-space>
  </div>
</template>
```
