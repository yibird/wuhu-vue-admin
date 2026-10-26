<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <a-form
      class="rounded-8 b-1-regular bg-container p-16"
      :label-col="{ style: { width: '80px' } }"
      :wrapper-col="{ flex: '1' }"
    >
      <a-row :gutter="[16, 12]">
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-form-item class="!mb-0" label="供应商">
            <a-input
              v-model:value="keyword"
              allow-clear
              class="w-full"
              placeholder="请输入名称 / Endpoint / 描述"
            />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-form-item class="!mb-0" label="调用协议">
            <a-select
              v-model:value="protocol"
              allow-clear
              class="w-full"
              :options="protocolOptions"
              placeholder="请选择调用协议"
            />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="8" :lg="12">
          <div class="flex items-center justify-end gap-8">
            <a-button type="primary" @click="onSearch">
              <template #icon>
                <Icon name="i-lucide:search" />
              </template>
              查询
            </a-button>
            <a-button @click="onReset">
              <template #icon>
                <Icon name="i-lucide:rotate-ccw" />
              </template>
              重置
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>

    <a-table
      class="flex-1 min-h-0 overflow-hidden"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ x: 1100 }"
      row-key="id"
      @change="onTableChange"
    >
      <template #title>
        <div class="flex flex-wrap items-center justify-between gap-10">
          <span class="text-sm text-main font-600">模型供应商</span>
          <a-button type="primary" @click="openCreate">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            新增供应商
          </a-button>
        </div>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'protocol'">
          {{ getProtocolLabel(record.protocol) }}
        </template>
      </template>
    </a-table>

    <ProviderForm v-model:open="formOpen" @success="onSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/components/icon'
import { useRequest } from '@/hooks'
import { ProviderForm } from './components'
import {
  getProtocolLabel,
  getProviderPageListApi,
  protocolOptions,
} from './data'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'
import type { ProviderItem, ProviderProtocol, ProviderQuery } from './types'

const PAGE_SIZE = 10

const formOpen = shallowRef(false)
const keyword = shallowRef('')
const protocol = shallowRef<ProviderProtocol>()
const query = shallowRef<ProviderQuery>({ current: 1, pageSize: PAGE_SIZE })

const columns: TableColumnsType<ProviderItem> = [
  { title: '供应商名称', dataIndex: 'name', key: 'name', width: 180 },
  {
    title: '调用协议',
    dataIndex: 'protocol',
    key: 'protocol',
    width: 200,
  },
  { title: 'API Endpoint', dataIndex: 'endpoint', key: 'endpoint' },
  {
    title: 'API Key',
    dataIndex: 'apiKeyMasked',
    key: 'apiKeyMasked',
    width: 150,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
]

const { data, loading, run } = useRequest(
  (params: ProviderQuery) => getProviderPageListApi(params),
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

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? PAGE_SIZE,
  }
  run(query.value)
}

function onSearch() {
  query.value = {
    ...query.value,
    current: 1,
    keyword: keyword.value.trim() || undefined,
    protocol: protocol.value || undefined,
  }
  run(query.value)
}

function onReset() {
  keyword.value = ''
  protocol.value = undefined
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function openCreate() {
  formOpen.value = true
}

function onSuccess() {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}
</script>
