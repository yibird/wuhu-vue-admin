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
      :scroll="{ x: 1270, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag
            :bordered="false"
            :color="resolveCaptchaTypeMeta(record.type).color"
          >
            {{ resolveCaptchaTypeMeta(record.type).label }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'scene'">
          {{ resolveCaptchaSceneLabel(record.scene) }}
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag
            :bordered="false"
            :color="resolveCaptchaStatusMeta(record.status).color"
          >
            {{ resolveCaptchaStatusMeta(record.status).label }}
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
      title="验证码日志详情"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getCaptchaLogPageListApi,
  getCaptchaLogRecordApi,
  type SysCaptchaLogDetail,
  type SysCaptchaLogQuery,
  type SysCaptchaLog,
} from '@/apis'
import { FormPlus } from '@/components'
import { useRequest } from '@/hooks'
import { LogDetailDrawer } from '../components'
import { formatLogTime, resolveTimeRange } from '../data'
import {
  captchaSceneOptions,
  captchaStatusOptions,
  captchaTypeOptions,
  createCaptchaDetailFields,
  createCaptchaDetailGroups,
  resolveCaptchaSceneLabel,
  resolveCaptchaStatusMeta,
  resolveCaptchaTypeMeta,
} from './data'

import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const query = shallowRef<SysCaptchaLogQuery>({
  current: 1,
  pageSize: PAGE_SIZE,
})
const detailOpen = shallowRef(false)
const detailLoading = shallowRef(false)
const detail = shallowRef<SysCaptchaLogDetail>()

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'select',
    field: 'type',
    label: '验证码类型',
    componentProps: {
      allowClear: true,
      placeholder: '请选择验证码类型',
      options: captchaTypeOptions,
    },
  },
  {
    component: 'select',
    field: 'scene',
    label: '使用场景',
    componentProps: {
      allowClear: true,
      placeholder: '请选择使用场景',
      options: captchaSceneOptions,
    },
  },
  {
    component: 'select',
    field: 'status',
    label: '校验结果',
    componentProps: {
      allowClear: true,
      placeholder: '请选择校验结果',
      options: captchaStatusOptions,
    },
  },
  {
    component: 'dateRangePicker',
    field: 'range',
    label: '发送时间',
    componentProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
  },
])

const columns: TableColumnsType<SysCaptchaLog> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '验证码类型', dataIndex: 'type', key: 'type', width: 130 },
  { title: '使用场景', dataIndex: 'scene', key: 'scene', width: 110 },
  { title: '接收方', dataIndex: 'receiver', width: 200 },
  { title: '验证码', dataIndex: 'code', width: 100 },
  { title: '校验结果', dataIndex: 'status', key: 'status', width: 110 },
  { title: '获取 IP', dataIndex: 'ip', width: 150 },
  { title: '归属地', dataIndex: 'location', width: 190 },
  {
    title: '发送时间',
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
  (params: SysCaptchaLogQuery) => getCaptchaLogPageListApi(params),
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

const detailFields = computed(() => createCaptchaDetailFields(detail.value))
const detailGroups = computed(() => createCaptchaDetailGroups(detail.value))

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
    type: (values.type as SysCaptchaLogQuery['type']) ?? undefined,
    scene: (values.scene as SysCaptchaLogQuery['scene']) ?? undefined,
    status: (values.status as SysCaptchaLogQuery['status']) ?? undefined,
    ...resolveTimeRange(values.range),
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

async function openDetail(record: SysCaptchaLog) {
  detail.value = undefined
  detailOpen.value = true
  detailLoading.value = true

  try {
    const response = await getCaptchaLogRecordApi(record.id)
    detail.value = response.data
  } catch {
    // 业务错误已由请求层统一提示,这里只关掉空抽屉
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}
</script>
