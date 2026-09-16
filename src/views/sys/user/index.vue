<template>
  <div class="h-full flex flex-col gap-10">
    <FormPlus :options="formOptions" @reset="onReset" @submit="onSearch" />
    <TablePlus
      v-model:checked-row-keys="selectedKeys"
      class="flex-1 overflow-hidden"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      :row-selection="rowSelection"
      @update:checked-row-keys="handleCheck"
    >
      <template #headerLeft>
        <a-button type="primary" @click="openCreate">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建
        </a-button>
        <a-button
          danger
          ghost
          type="primary"
          :disabled="selectedKeys.length === 0"
          @click="onBatchDelete"
        >
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </template>
    </TablePlus>
    <UserForm
      v-model:open="formOpen"
      :id="editingUserId"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, message } from 'antdv-next'
import { deleteUserApi, getUserPageListApi, type UserResp } from '@/apis'
import { FormPlus, Icon } from '@/components'
import type { FormPlusProps } from '@/components/form-plus'
import { TablePlus, useTable } from '@/components/table-plus'
import type { TablePlusColumn } from '@/components/table-plus'
import { UserForm } from './components'

interface UserSearchForm {
  username?: string
  nickname?: string
  phone?: string
}

interface UserQuery extends UserSearchForm {
  pageNum: number
  pageSize: number
}

const formOpen = shallowRef(false)
const editingUserId = shallowRef<string>()
const query = shallowRef<UserQuery>({ pageNum: 1, pageSize: 10 })

const formOptions = shallowRef<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'username',
      label: '登录账号',
      props: { clearable: true, placeholder: '请输入登录账号' },
    },
    {
      type: 'input',
      field: 'nickname',
      label: '用户昵称',
      props: { clearable: true, placeholder: '请输入用户昵称' },
    },
    {
      type: 'input',
      field: 'phone',
      label: '手机号',
      props: { clearable: true, placeholder: '请输入手机号' },
    },
  ],
})

const columns: TablePlusColumn<UserResp>[] = [
  { title: '登录账号', dataIndex: 'username' },
  { title: '用户昵称', dataIndex: 'nickname' },
  { title: '真实姓名', dataIndex: 'realname' },
  { title: '手机号', dataIndex: 'phone' },
  { title: '邮箱', dataIndex: 'email', ellipsis: true },
  { title: '创建时间', dataIndex: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 80,
    customRender: ({ record }) =>
      h(
        Button,
        { type: 'link', onClick: () => openEdit(record.id) },
        { default: () => '编辑' }
      ),
  },
]

const {
  loading,
  dataSource,
  pagination,
  rowSelection,
  selectedKeys,
  rowKey,
  handleCheck,
  unSelectedAll,
  run,
} = useTable<UserResp, UserQuery>({
  api: () => getUserPageListApi(query.value),
  rowKey: (row) => row.id,
  onPaginate: (pageNum, pageSize) => {
    query.value = { ...query.value, pageNum, pageSize }
    run(query.value)
  },
})

function onSearch(values: UserSearchForm) {
  query.value = {
    pageNum: 1,
    pageSize: query.value.pageSize,
    username: values.username?.trim() || undefined,
    nickname: values.nickname?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
  }
  run(query.value)
}

function onReset() {
  query.value = { pageNum: 1, pageSize: query.value.pageSize }
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

function onSuccess() {
  query.value = { ...query.value, pageNum: 1 }
  run(query.value)
}

function onBatchDelete() {
  if (selectedKeys.value.length === 0) return

  Modal.confirm({
    title: '删除用户',
    content: `确定删除选中的 ${selectedKeys.value.length} 个用户吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteUserApi(selectedKeys.value)
        message.success('用户删除成功')
        unSelectedAll()
        run(query.value)
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>
