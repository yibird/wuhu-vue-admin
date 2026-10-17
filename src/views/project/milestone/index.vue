<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <FormPlus
      ref="filterFormRef"
      class="rounded-4 bg-container p-16"
      :grid="{
        cols: { sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 },
        xGap: 10,
        yGap: 10,
      }"
      :schemas="querySchemas"
      label-placement="left"
      :label-width="76"
      @reset="onReset"
      @submit="onSearch"
    />

    <div class="flex flex-wrap items-center gap-8">
      <a-button
        v-permission="'project:milestone:create'"
        type="primary"
        @click="openCreate"
      >
        <template #icon><Icon name="i-lucide:plus" /></template>
        新增里程碑
      </a-button>
      <a-button
        v-permission="'project:milestone:delete'"
        danger
        :disabled="!selectedRowKeys.length"
        @click="onBatchDelete"
      >
        <template #icon><Icon name="i-lucide:trash-2" /></template>
        批量删除
      </a-button>
      <span class="ml-auto text-xs text-secondary">
        已选 {{ selectedRowKeys.length }} 项
      </span>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 1100, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <MilestoneForm
      v-model:open="formOpen"
      :id="editingMilestoneId"
      @success="onFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, Tag, message } from 'antdv-next'
import { deleteMilestoneApi, getMilestonePageListApi } from '@/apis'
import { FormPlus, Icon } from '@/components'
import { usePermission, useRequest } from '@/hooks'
import { MilestoneForm } from './components'
import {
  formatDate,
  milestoneStatusMeta,
  milestoneStatusOptions,
} from '../data'
import { useProjectOptions } from '../hooks'

import type { MilestoneQuery, MilestoneResp, MilestoneStatus } from '@/apis'
import type {
  FormPlusInstance,
  FormPlusModel,
  FormPlusProps,
} from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

const PAGE_SIZE = 10
const TABLE_SCROLL_Y = 'calc(100vh - 340px)'

const { hasPermission } = usePermission()
const { projectOptions } = useProjectOptions()

const formOpen = shallowRef(false)
const filterFormRef = useTemplateRef<FormPlusInstance>('filterFormRef')
const editingMilestoneId = shallowRef<string>()
const selectedRowKeys = shallowRef<(string | number)[]>([])
const query = shallowRef<MilestoneQuery>({
  current: 1,
  pageSize: PAGE_SIZE,
})

const querySchemas: FormPlusProps['schemas'] = [
  {
    field: 'projectId',
    label: '所属项目',
    component: 'select',
    cacheKey: 'project-select-options',
    getOptions: () =>
      projectOptions.value.map((option) => ({
        label: `${option.label} (${option.code})`,
        value: option.value,
      })),
    componentProps: {
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: '请选择项目',
    },
  },
  {
    field: 'keyword',
    label: '里程碑名称',
    component: 'input',
    componentProps: { allowClear: true, placeholder: '请输入里程碑名称' },
  },
  {
    field: 'status',
    label: '里程碑状态',
    component: 'select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择状态',
      options: [...milestoneStatusOptions],
    },
  },
]

const columns: TableColumnsType<MilestoneResp> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '里程碑名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '所属项目', dataIndex: 'projectName', width: 200, ellipsis: true },
  {
    title: '负责人',
    dataIndex: 'ownerName',
    width: 110,
    render: (value?: string) => value || '-',
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 130,
    render: (value: string) => formatDate(value),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value: MilestoneStatus) =>
      h(
        Tag,
        { color: milestoneStatusMeta[value].color },
        { default: () => milestoneStatusMeta[value].label }
      ),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        hasPermission('project:milestone:update')
          ? h(
              Button,
              { type: 'link', onClick: () => openEdit(record.id) },
              { default: () => '编辑' }
            )
          : null,
        hasPermission('project:milestone:delete')
          ? h(
              Button,
              {
                type: 'link',
                danger: true,
                onClick: () => onDelete(record),
              },
              { default: () => '删除' }
            )
          : null,
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: MilestoneQuery) => getMilestonePageListApi(params),
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

const rowSelection = computed<TableRowSelection<MilestoneResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function buildQuery(values: FormPlusModel): MilestoneQuery {
  const keyword =
    typeof values.keyword === 'string' ? values.keyword.trim() : ''

  return {
    current: 1,
    pageSize: query.value.pageSize,
    ...(values.projectId ? { projectId: String(values.projectId) } : {}),
    ...(keyword ? { keyword } : {}),
    ...(values.status !== undefined
      ? { status: values.status as MilestoneStatus }
      : {}),
  }
}

function onSearch(values: FormPlusModel) {
  query.value = buildQuery(values)
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? PAGE_SIZE,
  }
  run(query.value)
}

function refresh() {
  run(query.value)
}

onActivated(() => {
  void filterFormRef.value?.reloadOptions('projectId')
})

function openCreate() {
  editingMilestoneId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingMilestoneId.value = id
  formOpen.value = true
}

function onFormSuccess() {
  query.value = { ...query.value, current: 1 }
  refresh()
}

function onDelete(record: MilestoneResp) {
  Modal.confirm({
    title: '删除里程碑',
    content: `确定删除「${record.name}」吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteMilestoneApi([record.id])
      message.success('删除成功')
      selectedRowKeys.value = selectedRowKeys.value.filter(
        (key) => key !== record.id
      )
      refresh()
    },
  })
}

function onBatchDelete() {
  Modal.confirm({
    title: '批量删除里程碑',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 个里程碑吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteMilestoneApi(selectedRowKeys.value)
      message.success('删除成功')
      selectedRowKeys.value = []
      refresh()
    },
  })
}
</script>
