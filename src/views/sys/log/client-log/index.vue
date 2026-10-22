<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <FormPlus
      class="rounded-4 bg-container p-16"
      :label-width="80"
      :schemas="schemas"
      :grid="{
        cols: { sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 },
        xGap: 10,
        yGap: 10,
      }"
      label-placement="left"
      @reset="onReset"
      @submit="onSearch"
    />

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ x: 1290, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'level'">
          <a-tag
            :bordered="false"
            :color="resolveClientLevelMeta(record.level).color"
          >
            {{ resolveClientLevelMeta(record.level).label }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'message'">
          <span class="truncate" :title="record.message">
            {{ record.message }}
          </span>
        </template>
        <template v-else-if="column.key === 'url'">
          <span class="truncate" :title="record.url">{{ record.url }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button size="small" type="link" @click="openDetail(record)">
            详情
          </a-button>
        </template>
      </template>
    </a-table>

    <LogDetailDrawer
      v-model:open="detailOpen"
      :fields="detailFields"
      :groups="detailGroups"
      :loading="detailLoading"
      title="客户端日志详情"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getClientLogPageListApi,
  getClientLogRecordApi,
  type SysClientLogDetail,
  type SysClientLogQuery,
  type SysClientLog,
} from '@/apis'
import { FormPlus } from '@/components'
import { useRequest } from '@/hooks'
import { LogDetailDrawer } from '../components'
import { formatLogTime, resolveTimeRange } from '../data'
import {
  clientLevelOptions,
  createClientDetailFields,
  createClientDetailGroups,
  resolveClientLevelMeta,
} from './data'

import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const query = shallowRef<SysClientLogQuery>({ current: 1, pageSize: PAGE_SIZE })
const detailOpen = shallowRef(false)
const detailLoading = shallowRef(false)
const detail = shallowRef<SysClientLogDetail>()

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'message',
    label: '日志内容',
    componentProps: { allowClear: true, placeholder: '请输入日志内容' },
  },
  {
    component: 'input',
    field: 'source',
    label: '来源模块',
    componentProps: { allowClear: true, placeholder: '如 request、router' },
  },
  {
    component: 'select',
    field: 'level',
    label: '日志级别',
    componentProps: {
      allowClear: true,
      placeholder: '请选择日志级别',
      options: clientLevelOptions,
    },
  },
  {
    component: 'dateRangePicker',
    field: 'range',
    label: '上报时间',
    componentProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
  },
])

const columns: TableColumnsType<SysClientLog> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '日志级别', dataIndex: 'level', key: 'level', width: 100 },
  { title: '日志内容', dataIndex: 'message', key: 'message', width: 250 },
  { title: '来源模块', dataIndex: 'source', width: 140 },
  { title: '页面地址', dataIndex: 'url', key: 'url', width: 230 },
  { title: '登录账号', dataIndex: 'username', width: 120 },
  { title: '来源 IP', dataIndex: 'ip', width: 150 },
  {
    title: '上报时间',
    dataIndex: 'logAt',
    width: 170,
    render: (value) => formatLogTime(value),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 80,
  },
]

const { data, loading, run } = useRequest(
  (params: SysClientLogQuery) => getClientLogPageListApi(params),
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

const detailFields = computed(() => createClientDetailFields(detail.value))
const detailGroups = computed(() => createClientDetailGroups(detail.value))

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? PAGE_SIZE,
  }
  run(query.value)
}

function onSearch(values: FormPlusModel) {
  query.value = {
    ...query.value,
    current: 1,
    message: (values.message as string)?.trim() || undefined,
    source: (values.source as string)?.trim() || undefined,
    level: (values.level as SysClientLogQuery['level']) ?? undefined,
    ...resolveTimeRange(values.range),
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

async function openDetail(record: SysClientLog) {
  detail.value = undefined
  detailOpen.value = true
  detailLoading.value = true

  try {
    const response = await getClientLogRecordApi(record.id)
    detail.value = response.data
  } catch {
    // 业务错误已由请求层统一提示,这里只关掉空抽屉
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}
</script>
