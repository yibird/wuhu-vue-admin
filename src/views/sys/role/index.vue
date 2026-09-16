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
        >
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </template>
    </TablePlus>
    <RoleForm
      v-model:open="formOpen"
      :id="editingRoleId"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Tag } from 'antdv-next'
import { getRolePageListApi, type RoleResp } from '@/apis'
import { FormPlus, Icon } from '@/components'
import type { FormPlusProps } from '@/components/form-plus'
import { TablePlus, useTable } from '@/components/table-plus'
import type { TablePlusColumn } from '@/components/table-plus'
import { RoleForm } from './components'

interface RoleSearchForm {
  roleName?: string
  dataScope?: number
}

interface RoleQuery extends RoleSearchForm {
  pageNum: number
  pageSize: number
}

const formOpen = shallowRef(false)
const editingRoleId = shallowRef<string>()
const query = shallowRef<RoleQuery>({ pageNum: 1, pageSize: 10 })

const formOptions = shallowRef<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'roleName',
      label: '角色名称',
      props: { clearable: true, placeholder: '请输入角色名称' },
    },
    {
      type: 'select',
      field: 'dataScope',
      label: '数据权限',
      props: {
        clearable: true,
        options: [
          { label: '全部数据权限', value: 0 },
          { label: '本部门及以下', value: 1 },
          { label: '本部门', value: 2 },
          { label: '仅本人', value: 3 },
        ],
      },
    },
  ],
})

const dataScopeMap: Record<number, { label: string; color: string }> = {
  0: { label: '全部数据权限', color: 'processing' },
  1: { label: '本部门及以下', color: 'success' },
  2: { label: '本部门', color: 'warning' },
  3: { label: '仅本人', color: 'default' },
}

const columns: TablePlusColumn<RoleResp>[] = [
  { title: '角色名称', dataIndex: 'roleName' },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
  {
    title: '数据权限',
    dataIndex: 'dataScope',
    customRender: ({ text }) => {
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
  run,
} = useTable<RoleResp, RoleQuery>({
  api: () => getRolePageListApi(query.value),
  rowKey: (row) => row.id,
  onPaginate: (pageNum, pageSize) => {
    query.value = { ...query.value, pageNum, pageSize }
    run(query.value)
  },
})

function onSearch(values: RoleSearchForm) {
  query.value = {
    pageNum: 1,
    pageSize: query.value.pageSize,
    roleName: values.roleName?.trim() || undefined,
    dataScope: values.dataScope,
  }
  run(query.value)
}

function onReset() {
  query.value = { pageNum: 1, pageSize: query.value.pageSize }
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

function onSuccess() {
  query.value = { ...query.value, pageNum: 1 }
  run(query.value)
}
</script>
