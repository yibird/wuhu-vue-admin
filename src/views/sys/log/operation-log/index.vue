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
      :scroll="{ x: 1400, y: TABLE_SCROLL_Y }"
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
        <template v-else-if="column.key === 'method'">
          <a-tag :bordered="false">{{ record.method }}</a-tag>
        </template>
        <template v-else-if="column.key === 'uri'">
          <span class="truncate" :title="record.uri">{{ record.uri }}</span>
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
      title="操作日志详情"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getOperationLogPageListApi,
  getOperationLogRecordApi,
  type SysOperationLogDetail,
  type SysOperationLogQuery,
  type SysOperationLog,
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
import {
  createOperationDetailFields,
  createOperationDetailGroups,
  operationMethodOptions,
} from './data'

import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const query = shallowRef<SysOperationLogQuery>({
  current: 1,
  pageSize: PAGE_SIZE,
})
const detailOpen = shallowRef(false)
const detailLoading = shallowRef(false)
const detail = shallowRef<SysOperationLogDetail>()

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'username',
    label: '操作人',
    componentProps: { allowClear: true, placeholder: '请输入操作人' },
  },
  {
    component: 'input',
    field: 'message',
    label: '操作描述',
    componentProps: { allowClear: true, placeholder: '请输入操作描述' },
  },
  {
    component: 'select',
    field: 'method',
    label: '请求方法',
    componentProps: {
      allowClear: true,
      placeholder: '请选择请求方法',
      options: operationMethodOptions,
    },
  },
  {
    component: 'select',
    field: 'status',
    label: '执行结果',
    componentProps: {
      allowClear: true,
      placeholder: '请选择执行结果',
      options: logStatusOptions,
    },
  },
  {
    component: 'dateRangePicker',
    field: 'range',
    label: '操作时间',
    componentProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
  },
])

const columns: TableColumnsType<SysOperationLog> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '操作人', dataIndex: 'username', width: 120 },
  { title: '所属模块', dataIndex: 'module', width: 120 },
  { title: '操作描述', dataIndex: 'message', width: 160 },
  { title: '请求方法', dataIndex: 'method', key: 'method', width: 110 },
  { title: '请求 URI', dataIndex: 'uri', key: 'uri', width: 260 },
  { title: '来源 IP', dataIndex: 'ip', width: 150 },
  { title: '执行结果', dataIndex: 'status', key: 'status', width: 100 },
  { title: '耗时', dataIndex: 'costTime', width: 100 },
  {
    title: '操作时间',
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
  (params: SysOperationLogQuery) => getOperationLogPageListApi(params),
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

const detailFields = computed(() => createOperationDetailFields(detail.value))
const detailGroups = computed(() => createOperationDetailGroups(detail.value))

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
    message: (values.message as string)?.trim() || undefined,
    method: (values.method as string) ?? undefined,
    status: (values.status as SysOperationLogQuery['status']) ?? undefined,
    ...resolveTimeRange(values.range),
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

async function openDetail(record: SysOperationLog) {
  detail.value = undefined
  detailOpen.value = true
  detailLoading.value = true

  try {
    const response = await getOperationLogRecordApi(record.id)
    detail.value = response.data
  } catch {
    // 业务错误已由请求层统一提示,这里只关掉空抽屉
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}
</script>
