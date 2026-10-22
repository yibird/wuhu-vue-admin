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
        @click="onBatchDelete"
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
      :scroll="{ x: 1070, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <UserForm
      v-model:open="formOpen"
      :id="editingUserId"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, message } from 'antdv-next'
import { deleteUserApi, getUserPageListApi, type SysUser } from '@/apis'
import { FormPlus, Icon } from '@/components'
import { useRequest, useTabs } from '@/hooks'
import { UserForm } from './components'

import type { FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

interface UserSearchForm {
  username?: string
  nickname?: string
  phone?: string
}

interface UserQuery extends UserSearchForm {
  current: number
  pageSize: number
}

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const formOpen = shallowRef(false)
const editingUserId = shallowRef<string>()
const { openRouteTab } = useTabs()
const query = shallowRef<UserQuery>({ current: 1, pageSize: PAGE_SIZE })
const selectedRowKeys = shallowRef<(string | number)[]>([])

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'username',
    label: '登录账号',
    componentProps: { allowClear: true, placeholder: '请输入登录账号' },
  },
  {
    component: 'input',
    field: 'nickname',
    label: '用户昵称',
    componentProps: { allowClear: true, placeholder: '请输入用户昵称' },
  },
  {
    component: 'input',
    field: 'phone',
    label: '手机号',
    componentProps: { allowClear: true, placeholder: '请输入手机号' },
  },
])
const columns: TableColumnsType<SysUser> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  { title: '登录账号', dataIndex: 'username', width: 120 },
  { title: '用户昵称', dataIndex: 'nickname', width: 120 },
  { title: '真实姓名', dataIndex: 'realname', width: 100 },
  { title: '手机号', dataIndex: 'phone', width: 140 },
  { title: '邮箱', dataIndex: 'email', width: 200, ellipsis: true },
  { title: '创建时间', dataIndex: 'createdAt', width: 170 },
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
  (params: UserQuery) => getUserPageListApi(params),
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

const rowSelection = computed<TableRowSelection<SysUser>>(() => ({
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

function onSearch(values: UserSearchForm) {
  query.value = {
    current: 1,
    pageSize: query.value.pageSize,
    username: values.username?.trim() || undefined,
    nickname: values.nickname?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

function openCreate() {
  editingUserId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingUserId.value = id
  formOpen.value = true
}

function openDetail(record: SysUser) {
  openRouteTab({
    path: '/sys/user/detail',
    title: `用户详情-${record.nickname || record.username}`,
    icon: 'i-lucide:user',
    query: { id: record.id },
  })
}

function onSuccess() {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}

function onBatchDelete() {
  if (selectedRowKeys.value.length === 0) return

  Modal.confirm({
    title: '删除用户',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 个用户吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteUserApi(selectedRowKeys.value)
        message.success('用户删除成功')
        selectedRowKeys.value = []
        run(query.value)
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>
