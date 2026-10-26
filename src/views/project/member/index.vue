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
        v-permission="'project:member:create'"
        type="primary"
        @click="openCreate"
      >
        <template #icon><Icon name="i-lucide:user-plus" /></template>
        添加成员
      </a-button>
      <a-button
        v-permission="'project:member:delete'"
        danger
        :disabled="!selectedRowKeys.length"
        @click="onBatchRemove"
      >
        <template #icon><Icon name="i-lucide:user-minus" /></template>
        批量移除
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

    <MemberForm
      v-model:open="formOpen"
      :id="editingMemberId"
      @success="onFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, Tag, message } from 'antdv-next'
import { deleteProjectMemberApi, getProjectMemberPageListApi } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { usePermission, useRequest } from '@/hooks'
import { MemberForm } from './components'
import { formatDate, memberRoleMeta, memberRoleOptions } from '../data'
import { useProjectOptions } from '../hooks'

import type {
  ProjectMemberQuery,
  ProjectMemberResp,
  ProjectMemberRole,
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

const formOpen = shallowRef(false)
const filterFormRef = useTemplateRef<FormPlusInstance>('filterFormRef')
const editingMemberId = shallowRef<string>()
const selectedRowKeys = shallowRef<(string | number)[]>([])
const query = shallowRef<ProjectMemberQuery>({
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
    label: '成员',
    component: 'input',
    componentProps: {
      allowClear: true,
      placeholder: '请输入姓名或邮箱',
    },
  },
  {
    field: 'role',
    label: '项目角色',
    component: 'select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择角色',
      options: [...memberRoleOptions],
    },
  },
]

const columns: TableColumnsType<ProjectMemberResp> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  { title: '成员', dataIndex: 'userName', width: 140 },
  { title: '所属项目', dataIndex: 'projectName', width: 200, ellipsis: true },
  {
    title: '部门',
    dataIndex: 'department',
    width: 150,
    ellipsis: true,
    render: (value?: string) => value || '-',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
    ellipsis: true,
    render: (value?: string) => value || '-',
  },
  {
    title: '项目角色',
    dataIndex: 'role',
    width: 100,
    render: (value: ProjectMemberRole) =>
      h(
        Tag,
        { color: memberRoleMeta[value].color },
        { default: () => memberRoleMeta[value].label }
      ),
  },
  {
    title: '加入时间',
    dataIndex: 'joinedAt',
    width: 130,
    render: (value: string) => formatDate(value),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        hasPermission('project:member:create')
          ? h(
              Button,
              { type: 'link', onClick: () => openEdit(record.id) },
              { default: () => '编辑角色' }
            )
          : null,
        hasPermission('project:member:delete')
          ? h(
              Button,
              {
                type: 'link',
                danger: true,
                onClick: () => onRemove(record),
              },
              { default: () => '移除' }
            )
          : null,
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: ProjectMemberQuery) => getProjectMemberPageListApi(params),
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

const rowSelection = computed<TableRowSelection<ProjectMemberResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function buildQuery(values: FormPlusModel): ProjectMemberQuery {
  const keyword =
    typeof values.keyword === 'string' ? values.keyword.trim() : ''

  return {
    current: 1,
    pageSize: query.value.pageSize,
    ...(values.projectId ? { projectId: String(values.projectId) } : {}),
    ...(keyword ? { keyword } : {}),
    ...(values.role ? { role: values.role as ProjectMemberRole } : {}),
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
  editingMemberId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingMemberId.value = id
  formOpen.value = true
}

function onFormSuccess() {
  query.value = { ...query.value, current: 1 }
  refresh()
}

function onRemove(record: ProjectMemberResp) {
  Modal.confirm({
    title: '移除成员',
    content: `确定将「${record.userName}」移出项目「${record.projectName}」吗?`,
    okText: '移除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectMemberApi([record.id])
      message.success('已移除')
      selectedRowKeys.value = selectedRowKeys.value.filter(
        (key) => key !== record.id
      )
      refresh()
    },
  })
}

function onBatchRemove() {
  Modal.confirm({
    title: '批量移除成员',
    content: `确定移除选中的 ${selectedRowKeys.value.length} 位成员吗?`,
    okText: '移除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectMemberApi(selectedRowKeys.value)
      message.success('已移除')
      selectedRowKeys.value = []
      refresh()
    },
  })
}
</script>
