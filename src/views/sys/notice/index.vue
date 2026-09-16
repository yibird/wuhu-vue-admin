<script setup lang="ts">
import { Tag } from 'antdv-next'
import { getNoticePageListApi, type NoticeResp, type NoticeType } from '@/apis'
import {
  FormPlus,
  Icon,
  TablePlus,
  useTable,
  type FormPlusProps,
  type TablePlusColumn,
} from '@/components'
import { FormModal } from './components'

interface NoticeQuery {
  pageNum: number
  pageSize: number
  title?: string
  type?: NoticeType
  status?: boolean
}

interface NoticeSearchForm {
  title?: string
  type?: NoticeType
  status?: boolean
}

const formOpen = shallowRef(false)
const query = shallowRef<NoticeQuery>({ pageNum: 1, pageSize: 10 })

const formOptions = shallowRef<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'title',
      label: '通知标题',
      props: {
        clearable: true,
        placeholder: '请输入通知标题',
      },
    },
    {
      type: 'select',
      field: 'type',
      label: '通知类型',
      props: {
        clearable: true,
        options: [
          { label: '通知', value: 1 },
          { label: '公告', value: 2 },
        ],
      },
    },
    {
      type: 'select',
      field: 'status',
      label: '状态',
      props: {
        clearable: true,
        options: [
          { label: '正常', value: true },
          { label: '停用', value: false },
        ],
      },
    },
  ],
})

const columns: TablePlusColumn<NoticeResp>[] = [
  {
    title: '通知标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '通知类型',
    dataIndex: 'type',
    width: 110,
    customRender: ({ text }) =>
      h(
        Tag,
        { bordered: false, color: text === 2 ? 'blue' : 'cyan' },
        { default: () => (text === 2 ? '公告' : '通知') }
      ),
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 90,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) =>
      h(
        Tag,
        { bordered: false, color: text ? 'success' : 'default' },
        { default: () => (text ? '正常' : '停用') }
      ),
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
  },
]

const {
  loading,
  dataSource,
  pagination,
  rowSelection,
  selectedKeys,
  rowKey,
  handleCheck,
  run,
} = useTable<NoticeResp, NoticeQuery>({
  api: () => getNoticePageListApi(query.value),
  rowKey: (row) => row.id,
  onPaginate: (pageNum, pageSize) => {
    query.value = { ...query.value, pageNum, pageSize }
    run(query.value)
  },
})

function onSearch(values: NoticeSearchForm) {
  query.value = {
    pageNum: 1,
    pageSize: query.value.pageSize,
    title: values.title?.trim() || undefined,
    type: values.type,
    status: values.status,
  }
  run(query.value)
}

function onReset() {
  query.value = { pageNum: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function onSuccess() {
  query.value = { ...query.value, pageNum: 1 }
  run(query.value)
}
</script>

<template>
  <div class="h-full flex flex-col gap-10">
    <FormPlus :options="formOptions" @reset="onReset" @submit="onSearch" />

    <TablePlus
      v-model:checked-row-keys="selectedKeys"
      class="flex-1 overflow-hidden"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      :row-selection="rowSelection"
      @update:checked-row-keys="handleCheck"
    >
      <template #headerLeft>
        <a-button type="primary" @click="formOpen = true">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建
        </a-button>
        <a-button
          :disabled="selectedKeys.length === 0"
          danger
          ghost
          type="primary"
        >
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </template>
    </TablePlus>

    <FormModal v-model:open="formOpen" @success="onSuccess" />
  </div>
</template>
