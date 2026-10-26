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
      <a-button type="primary" @click="openCreate">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新建
      </a-button>
      <a-button
        danger
        ghost
        type="primary"
        :disabled="selectedRowKeys.length === 0"
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
      :scroll="{ x: 780, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Tag } from 'antdv-next'
import { getRolePageListApi, type SysRole } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { useRequest, useTabs } from '@/hooks'

import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'
import { dataScopeMap, schemas } from './config'

interface RoleQuery {
  current: number
  pageSize: number
  roleName?: string
  dataScope?: number
}

const { openRouteTab } = useTabs()

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const formOpen = shallowRef(false)
const editingRoleId = shallowRef<string>()
const query = shallowRef<RoleQuery>({ current: 1, pageSize: PAGE_SIZE })
const selectedRowKeys = shallowRef<(string | number)[]>([])

const columns: TableColumnsType<SysRole> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  { title: '角色名称', dataIndex: 'roleName', width: 160 },
  { title: '备注', dataIndex: 'remark', width: 240, ellipsis: true },
  {
    title: '数据权限',
    dataIndex: 'dataScope',
    width: 160,
    render: (text) => {
      const scope = dataScopeMap[text as number]
      return scope
        ? h(
            Tag,
            { bordered: false, color: scope.color },
            { default: () => scope.label }
          )
        : '-'
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 140,
    render: (_value, record) =>
      h('div', { class: 'flex items-center gap-4' }, [
        h(
          Button,
          { type: 'link', onClick: () => openDetail(record) },
          { default: () => '详情' }
        ),
        h(
          Button,
          { type: 'link', onClick: () => openEdit(record.id) },
          { default: () => '编辑' }
        ),
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: RoleQuery) => getRolePageListApi(params),
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

const rowSelection = computed<TableRowSelection<SysRole>>(() => ({
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

function onSearch(values: Omit<RoleQuery, 'current' | 'pageSize'>) {
  query.value = {
    current: 1,
    pageSize: query.value.pageSize,
    roleName: values.roleName?.trim() || undefined,
    dataScope: values.dataScope,
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function openCreate() {
  editingRoleId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingRoleId.value = id
  formOpen.value = true
}

/** 跳转角色详情页,详情页按 query.id 拉取角色数据 */
function openDetail(record: SysRole) {
  openRouteTab({
    path: '/sys/role/detail',
    title: `角色详情-${record.roleName}`,
    icon: 'i-lucide:shield-check',
    query: { id: record.id },
  })
}
</script>
