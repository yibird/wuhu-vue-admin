<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <div class="grid grid-cols-2 gap-10 xl:grid-cols-4">
      <div
        v-for="item in summaryCards"
        :key="item.key"
        class="relative overflow-hidden rounded-4 bg-container px-16 py-12"
      >
        <div class="text-xs text-secondary">{{ item.label }}</div>
        <div class="mt-4 text-2xl text-main font-700">
          {{ item.value }}
        </div>
        <Icon
          :name="item.icon"
          :size="34"
          class="absolute right-12 top-1/2 -translate-y-1/2 opacity-20"
          :class="item.tone"
        />
      </div>
    </div>

    <FormPlus
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
        v-permission="'project:project:create'"
        type="primary"
        @click="openCreate"
      >
        <template #icon><Icon name="i-lucide:plus" /></template>
        新增项目
      </a-button>
      <a-button
        v-permission="'project:project:delete'"
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
      :scroll="{ x: 1520, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <ProjectForm
      v-model:open="formOpen"
      :id="editingProjectId"
      @success="onFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, Progress, Tag, message } from 'antdv-next'
import {
  deleteProjectApi,
  getProjectPageListApi,
  getProjectSummaryApi,
} from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { usePermission, useRequest, useTabs } from '@/hooks'
import { ProjectForm } from './components'
import {
  formatDateTime,
  priorityMeta,
  priorityOptions,
  projectStatusMeta,
  projectStatusOptions,
  resolveDateRange,
} from '../data'
import { useProjectOptions, useUserOptions } from '../hooks'

import type {
  ProjectPriority,
  ProjectQuery,
  ProjectResp,
  ProjectStatus,
} from '@/apis'
import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页、统计卡与筛选区 */
const TABLE_SCROLL_Y = 'calc(100vh - 430px)'

const { hasPermission } = usePermission()
const { openRouteTab } = useTabs()
const { refreshProjectOptions } = useProjectOptions()
const { userOptions } = useUserOptions()

const formOpen = shallowRef(false)
const editingProjectId = shallowRef<string>()
const selectedRowKeys = shallowRef<(string | number)[]>([])
const query = shallowRef<ProjectQuery>({
  current: 1,
  pageSize: PAGE_SIZE,
})

const querySchemas: FormPlusProps['schemas'] = [
  {
    field: 'name',
    label: '项目名称',
    component: 'input',
    componentProps: { allowClear: true, placeholder: '请输入项目名称' },
  },
  {
    field: 'code',
    label: '项目编码',
    component: 'input',
    componentProps: { allowClear: true, placeholder: '请输入项目编码' },
  },
  {
    field: 'status',
    label: '项目状态',
    component: 'select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择状态',
      options: [...projectStatusOptions],
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
    field: 'ownerId',
    label: '负责人',
    component: 'select',
    cacheKey: 'project-owner-options',
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
  {
    field: 'range',
    label: '开始日期',
    component: 'dateRangePicker',
    componentProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
  },
]

const columns: TableColumnsType<ProjectResp> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '项目编码', dataIndex: 'code', width: 140 },
  { title: '项目名称', dataIndex: 'name', width: 200, ellipsis: true },
  {
    title: '状态',
    dataIndex: 'status',
    width: 96,
    render: (value: ProjectStatus) =>
      h(
        Tag,
        { color: projectStatusMeta[value].color },
        { default: () => projectStatusMeta[value].label }
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
  { title: '负责人', dataIndex: 'ownerName', width: 110 },
  {
    title: '进度',
    dataIndex: 'progress',
    width: 170,
    render: (value: number) =>
      h('div', { class: 'flex items-center gap-8' }, [
        h(Progress, {
          percent: value,
          size: 'small',
          showInfo: false,
          class: 'min-w-80 flex-1',
        }),
        h('span', { class: 'text-xs text-secondary' }, `${value}%`),
      ]),
  },
  {
    title: '成员 / 任务',
    key: 'counts',
    width: 110,
    render: (_value, record) => `${record.memberCount} / ${record.taskCount}`,
  },
  {
    title: '计划周期',
    key: 'period',
    width: 290,
    render: (_value, record) =>
      `${formatDateTime(record.startDate)} ~ ${formatDateTime(record.endDate)}`,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 150,
    render: (value: string) => formatDateTime(value),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 190,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          Button,
          { type: 'link', onClick: () => openDetail(record) },
          { default: () => '详情' }
        ),
        hasPermission('project:project:update')
          ? h(
              Button,
              { type: 'link', onClick: () => openEdit(record.id) },
              { default: () => '编辑' }
            )
          : null,
        hasPermission('project:project:delete')
          ? h(
              Button,
              { type: 'link', danger: true, onClick: () => onDelete(record) },
              { default: () => '删除' }
            )
          : null,
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: ProjectQuery) => getProjectPageListApi(params),
  { defaultParams: [query.value] }
)
const { data: summaryData, run: runSummary } = useRequest(() =>
  getProjectSummaryApi()
)

const dataSource = computed(() => data.value?.data?.list ?? [])

const summaryCards = computed(() => {
  const summary = summaryData.value?.data
  return [
    {
      key: 'total',
      label: '项目总数',
      value: summary?.total ?? 0,
      icon: 'i-lucide:folder-kanban',
      tone: 'text-primary',
    },
    {
      key: 'inProgress',
      label: '进行中',
      value: summary?.inProgress ?? 0,
      icon: 'i-lucide:loader-circle',
      tone: 'text-info',
    },
    {
      key: 'completed',
      label: '已完成',
      value: summary?.completed ?? 0,
      icon: 'i-lucide:check-circle-2',
      tone: 'text-success',
    },
    {
      key: 'delayed',
      label: '已延期',
      value: summary?.delayed ?? 0,
      icon: 'i-lucide:alarm-clock',
      tone: 'text-warning',
    },
  ]
})

const pagination = computed<TablePaginationConfig>(() => ({
  current: query.value.current,
  pageSize: query.value.pageSize,
  total: data.value?.data?.total ?? 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

const rowSelection = computed<TableRowSelection<ProjectResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function buildQuery(values: FormPlusModel): ProjectQuery {
  const text = (value: unknown) =>
    typeof value === 'string' ? value.trim() : ''
  const name = text(values.name)
  const code = text(values.code)

  return {
    current: 1,
    pageSize: query.value.pageSize,
    ...(name ? { name } : {}),
    ...(code ? { code } : {}),
    ...(values.status !== undefined
      ? { status: values.status as ProjectStatus }
      : {}),
    ...(values.priority !== undefined
      ? { priority: values.priority as ProjectPriority }
      : {}),
    ...(values.ownerId ? { ownerId: String(values.ownerId) } : {}),
    ...resolveDateRange(values.range),
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
  runSummary()
}

function openCreate() {
  editingProjectId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingProjectId.value = id
  formOpen.value = true
}

function openDetail(record: ProjectResp) {
  openRouteTab({
    path: '/project/detail',
    title: `项目详情-${record.name}`,
    icon: 'i-lucide:folder-open',
    query: { id: record.id, from: '/project/list' },
  })
}

function onFormSuccess() {
  query.value = { ...query.value, current: 1 }
  refresh()
  void refreshProjectOptions()
}

function onDelete(record: ProjectResp) {
  Modal.confirm({
    title: '删除项目',
    content: `确定删除「${record.name}」吗?项目下的任务、里程碑与成员会一并删除。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectApi([record.id])
      message.success('删除成功')
      selectedRowKeys.value = selectedRowKeys.value.filter(
        (key) => key !== record.id
      )
      refresh()
      void refreshProjectOptions()
    },
  })
}

function onBatchDelete() {
  Modal.confirm({
    title: '批量删除项目',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 个项目吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectApi(selectedRowKeys.value)
      message.success('删除成功')
      selectedRowKeys.value = []
      refresh()
      void refreshProjectOptions()
    },
  })
}
</script>
