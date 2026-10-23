<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <FormPlus
      class="rounded-4 bg-container p-16"
      :grid="{
        cols: { sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 },
        xGap: 10,
        yGap: 10,
      }"
      :schemas="schemas"
      label-placement="left"
      :label-width="80"
      @reset="onReset"
      @submit="onSearch"
    />

    <div class="flex flex-wrap items-center gap-8">
      <a-button type="primary" @click="formOpen = true">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新建
      </a-button>
      <a-button
        :disabled="selectedRowKeys.length === 0"
        danger
        ghost
        type="primary"
      >
        <template #icon><Icon name="i-lucide:trash-2" /></template>
        删除
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 950, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <FormModal v-model:open="formOpen" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { Tag } from 'antdv-next'
import { getNoticePageListApi, type SysNotice, type NoticeType } from '@/apis'
import { FormPlus, Icon } from '@/components'
import { useRequest, useTabs } from '@/hooks'
import { FormModal } from './components'

import type { FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

interface NoticeQuery {
  current: number
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

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const { openRouteTab } = useTabs()
const formOpen = shallowRef(false)
const query = shallowRef<NoticeQuery>({ current: 1, pageSize: PAGE_SIZE })
const selectedRowKeys = shallowRef<(string | number)[]>([])

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'title',
    label: '通知标题',
    componentProps: {
      allowClear: true,
      placeholder: '请输入通知标题',
    },
  },
  {
    component: 'select',
    field: 'type',
    label: '通知类型',
    componentProps: {
      allowClear: true,
      options: [
        { label: '通知', value: 1 },
        { label: '公告', value: 2 },
      ],
    },
  },
  {
    component: 'select',
    field: 'status',
    label: '状态',
    componentProps: {
      allowClear: true,
      options: [
        { label: '正常', value: true },
        { label: '停用', value: false },
      ],
    },
  },
])
const columns: TableColumnsType<SysNotice> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  {
    title: '通知标题',
    dataIndex: 'title',
    width: 240,
    ellipsis: true,
  },
  {
    title: '通知类型',
    dataIndex: 'type',
    width: 110,
    render: (text) =>
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
    render: (text) =>
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
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (_value, record) =>
      h('div', { class: 'flex gap-12' }, [
        h(
          'a',
          { class: 'text-primary', onClick: () => onDetail(record) },
          '详情'
        ),
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: NoticeQuery) => getNoticePageListApi(params),
  { defaultParams: [query.value] }
)

const dataSource = computed(() => data.value?.data?.list ?? [])

const pagination = computed<TablePaginationConfig>(() => ({
  current: query.value.current,
  pageSize: query.value.pageSize,
  total: data.value?.data?.total ?? 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

const rowSelection = computed<TableRowSelection<SysNotice>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? PAGE_SIZE,
  }
  run(query.value)
}

function onSearch(values: NoticeSearchForm) {
  query.value = {
    current: 1,
    pageSize: query.value.pageSize,
    title: values.title?.trim() || undefined,
    type: values.type,
    status: values.status,
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function onDetail(record: SysNotice) {
  openRouteTab({
    path: '/sys/notice/detail',
    title: `公告详情-${record.title}`,
    icon: 'i-lucide:bell',
    query: { id: record.id },
  })
}

function onSuccess() {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}
</script>
