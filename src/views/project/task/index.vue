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
        v-permission="'project:task:create'"
        type="primary"
        @click="openCreate"
      >
        <template #icon><Icon name="i-lucide:plus" /></template>
        新增任务
      </a-button>
      <a-button
        v-permission="'project:task:delete'"
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
      :scroll="{ x: 1180, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <TaskForm
      v-model:open="formOpen"
      :id="editingTaskId"
      @success="onFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, Tag, message } from 'antdv-next'
import { deleteProjectTaskApi, getProjectTaskPageListApi } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { usePermission, useRequest } from '@/hooks'
import { TaskForm } from './components'
import {
  formatDate,
  formatDateTime,
  priorityMeta,
  priorityOptions,
  taskStatusMeta,
  taskStatusOptions,
} from '../data'
import { useProjectOptions, useUserOptions } from '../hooks'

import type {
  ProjectPriority,
  ProjectTaskQuery,
  ProjectTaskResp,
  ProjectTaskStatus,
} from '@/apis'
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
const { userOptions } = useUserOptions()

const formOpen = shallowRef(false)
const filterFormRef = useTemplateRef<FormPlusInstance>('filterFormRef')
const editingTaskId = shallowRef<string>()
const selectedRowKeys = shallowRef<(string | number)[]>([])
const query = shallowRef<ProjectTaskQuery>({
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
    label: '任务标题',
    component: 'input',
    componentProps: { allowClear: true, placeholder: '请输入任务标题' },
  },
  {
    field: 'status',
    label: '任务状态',
    component: 'select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择状态',
      options: [...taskStatusOptions],
    },
  },
  {
    field: 'priority',
    label: '优先级',
    component: 'select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择优先级',
      options: [...priorityOptions],
    },
  },
  {
    field: 'assigneeId',
    label: '负责人',
    component: 'select',
    cacheKey: 'project-user-options',
    getOptions: () =>
      userOptions.value.map((option) => ({
        label: option.label,
        value: option.value,
        disabled: option.disabled,
      })),
    componentProps: {
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: '请选择负责人',
    },
  },
]

const columns: TableColumnsType<ProjectTaskResp> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '任务标题', dataIndex: 'title', width: 220, ellipsis: true },
  { title: '所属项目', dataIndex: 'projectName', width: 180, ellipsis: true },
  {
    title: '状态',
    dataIndex: 'status',
    width: 96,
    render: (value: ProjectTaskStatus) =>
      h(
        Tag,
        { color: taskStatusMeta[value].color },
        { default: () => taskStatusMeta[value].label }
      ),
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    width: 86,
    render: (value: ProjectPriority) =>
      h(
        Tag,
        { color: priorityMeta[value].color },
        { default: () => priorityMeta[value].label }
      ),
  },
  {
    title: '负责人',
    dataIndex: 'assigneeName',
    width: 110,
    render: (value?: string) => value || '-',
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
    render: (value?: string) => formatDate(value),
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 150,
    render: (value: string) => formatDateTime(value),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        hasPermission('project:task:update')
          ? h(
              Button,
              { type: 'link', onClick: () => openEdit(record.id) },
              { default: () => '编辑' }
            )
          : null,
        hasPermission('project:task:delete')
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
  (params: ProjectTaskQuery) => getProjectTaskPageListApi(params),
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

const rowSelection = computed<TableRowSelection<ProjectTaskResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function buildQuery(values: FormPlusModel): ProjectTaskQuery {
  const keyword =
    typeof values.keyword === 'string' ? values.keyword.trim() : ''

  return {
    current: 1,
    pageSize: query.value.pageSize,
    ...(values.projectId ? { projectId: String(values.projectId) } : {}),
    ...(keyword ? { keyword } : {}),
    ...(values.status !== undefined
      ? { status: values.status as ProjectTaskStatus }
      : {}),
    ...(values.priority !== undefined
      ? { priority: values.priority as ProjectPriority }
      : {}),
    ...(values.assigneeId ? { assigneeId: String(values.assigneeId) } : {}),
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
  editingTaskId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingTaskId.value = id
  formOpen.value = true
}

function onFormSuccess() {
  query.value = { ...query.value, current: 1 }
  refresh()
}

function onDelete(record: ProjectTaskResp) {
  Modal.confirm({
    title: '删除任务',
    content: `确定删除「${record.title}」吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectTaskApi([record.id])
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
    title: '批量删除任务',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 个任务吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectTaskApi(selectedRowKeys.value)
      message.success('删除成功')
      selectedRowKeys.value = []
      refresh()
    },
  })
}
</script>
