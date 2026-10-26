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

    <div class="flex flex-wrap items-center justify-end gap-8">
      <a-button type="primary" @click="openCreate">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新增
      </a-button>
      <a-button type="primary" ghost @click="orgOpen = true">
        <template #icon><Icon name="i-lucide:network" /></template>
        组织架构图
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 1130, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <DeptForm
      v-model:open="formOpen"
      :id="editingDeptId"
      @success="onSuccess"
    />

    <OrgChart v-model:open="orgOpen" @edit="openEditFromChart" />
  </div>
</template>

<script lang="ts" setup>
import { Button, Tag } from 'antdv-next'
import { getDeptPageListApi, type SysDept } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { useRequest, useTabs } from '@/hooks'
import { DeptForm, OrgChart } from './components'

import type { FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

interface DeptSearchForm {
  name?: string
  type?: 1 | 2
}

interface DeptQuery extends DeptSearchForm {
  current: number
  pageSize: number
}

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const formOpen = shallowRef(false)
const orgOpen = shallowRef(false)
const editingDeptId = shallowRef<string>()
const { openRouteTab } = useTabs()
const query = shallowRef<DeptQuery>({ current: 1, pageSize: PAGE_SIZE })
const selectedRowKeys = shallowRef<(string | number)[]>([])

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'name',
    label: '部门名称',
    componentProps: { allowClear: true, placeholder: '请输入部门名称' },
  },
  {
    component: 'select',
    field: 'type',
    label: '部门类型',
    componentProps: {
      allowClear: true,
      options: [
        { label: '部门', value: 1 },
        { label: '岗位', value: 2 },
      ],
    },
  },
])
const columns: TableColumnsType<SysDept> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  { title: '部门名称', dataIndex: 'name', width: 160 },
  { title: '部门编码', dataIndex: 'code', width: 160 },
  {
    title: '类型',
    dataIndex: 'type',
    width: 110,
    render: (text) =>
      h(
        Tag,
        { bordered: false, color: text === 2 ? 'purple' : 'blue' },
        { default: () => (text === 2 ? '岗位' : '部门') }
      ),
  },
  { title: '负责人', dataIndex: 'leader', width: 140 },
  { title: '联系电话', dataIndex: 'phone', width: 140 },
  { title: '联系邮箱', dataIndex: 'email', width: 200 },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 140,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
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
  (params: DeptQuery) => getDeptPageListApi(params),
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

const rowSelection = computed<TableRowSelection<SysDept>>(() => ({
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

function onSearch(values: DeptSearchForm) {
  // 每个条件都显式给出,否则清空某个字段后旧条件会被 ...query 带回来
  query.value = {
    current: 1,
    pageSize: query.value.pageSize,
    name: values.name?.trim() || undefined,
    type: values.type || undefined,
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function openCreate() {
  editingDeptId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingDeptId.value = id
  formOpen.value = true
}

function openDetail(record: SysDept) {
  openRouteTab({
    path: '/sys/dept/detail',
    title: `部门详情-${record.name}`,
    icon: 'i-lucide:building-2',
    query: { id: record.id },
  })
}

function openEditFromChart(id: string) {
  orgOpen.value = false
  openEdit(id)
}

function onSuccess() {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}
</script>
