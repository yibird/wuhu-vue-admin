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
      :scroll="{ x: 1200, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag
            :bordered="false"
            :color="resolveLogStatusMeta(record.status).color"
          >
            {{ resolveLogStatusMeta(record.status).label }}
          </a-tag>
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
      title="登录日志详情"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getLoginLogPageListApi,
  getLoginLogRecordApi,
  type SysLoginLogDetail,
  type SysLoginLogQuery,
  type SysLoginLog,
} from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { useRequest } from '@/hooks'
import { LogDetailDrawer } from '../components'
import {
  formatLogTime,
  logStatusOptions,
  resolveLogStatusMeta,
  resolveTimeRange,
} from '../data'
import { createLoginDetailFields, createLoginDetailGroups } from './data'

import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const query = shallowRef<SysLoginLogQuery>({ current: 1, pageSize: PAGE_SIZE })
const detailOpen = shallowRef(false)
const detailLoading = shallowRef(false)
const detail = shallowRef<SysLoginLogDetail>()

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'username',
    label: '登录账号',
    componentProps: { allowClear: true, placeholder: '请输入登录账号' },
  },
  {
    component: 'input',
    field: 'ip',
    label: '来源 IP',
    componentProps: { allowClear: true, placeholder: '请输入来源 IP' },
  },
  {
    component: 'select',
    field: 'status',
    label: '登录结果',
    componentProps: {
      allowClear: true,
      placeholder: '请选择登录结果',
      options: logStatusOptions,
    },
  },
  {
    component: 'dateRangePicker',
    field: 'range',
    label: '登录时间',
    componentProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
  },
])

const columns: TableColumnsType<SysLoginLog> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '登录账号', dataIndex: 'username', width: 130 },
  { title: '来源 IP', dataIndex: 'ip', width: 150 },
  { title: '归属地', dataIndex: 'location', width: 190 },
  { title: '浏览器', dataIndex: 'browser', width: 160 },
  { title: '登录结果', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作信息', dataIndex: 'message', width: 160 },
  {
    title: '登录时间',
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
  (params: SysLoginLogQuery) => getLoginLogPageListApi(params),
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

const detailFields = computed(() => createLoginDetailFields(detail.value))
const detailGroups = computed(() => createLoginDetailGroups(detail.value))

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
    username: (values.username as string)?.trim() || undefined,
    ip: (values.ip as string)?.trim() || undefined,
    status: (values.status as SysLoginLogQuery['status']) ?? undefined,
    ...resolveTimeRange(values.range),
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

async function openDetail(record: SysLoginLog) {
  detail.value = undefined
  detailOpen.value = true
  detailLoading.value = true

  try {
    const response = await getLoginLogRecordApi(record.id)
    detail.value = response.data
  } catch {
    // 业务错误已由请求层统一提示,这里只关掉空抽屉
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}
</script>
