<template>
  <div class="h-full flex flex-col gap-10 p-10">
    <FormPlus :options="formOptions" @submit="onSearch" />
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
      <template #headerRight>
        <a-button type="primary" @click="openCreate">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新增
        </a-button>
        <a-button type="primary" ghost>
          <template #icon><Icon name="i-lucide:network" /></template>
          组织架构图
        </a-button>
      </template>
    </TablePlus>
    <DeptForm
      v-model:open="formOpen"
      :id="editingDeptId"
      @success="onSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import { Button, Tag } from 'antdv-next'
import { getDeptPageListApi, type DeptResp } from '@/apis'
import { FormPlus, Icon } from '@/components'
import type { FormPlusProps } from '@/components/form-plus'
import { TablePlus, useTable } from '@/components/table-plus'
import type { TablePlusColumn } from '@/components/table-plus'
import { DeptForm } from './components'

interface DeptSearchForm {
  name?: string
  type?: 1 | 2
}

const formOpen = shallowRef(false)
const editingDeptId = shallowRef<string>()
const query = shallowRef({ pageNum: 1, pageSize: 10 })

const formOptions = shallowRef<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'name',
      label: '部门名称',
      props: { clearable: true, placeholder: '请输入部门名称' },
    },
    {
      type: 'select',
      field: 'type',
      label: '部门类型',
      props: {
        clearable: true,
        options: [
          { label: '部门', value: 1 },
          { label: '岗位', value: 2 },
        ],
      },
    },
  ],
})

const columns: TablePlusColumn<DeptResp>[] = [
  { title: '部门名称', dataIndex: 'name' },
  { title: '部门编码', dataIndex: 'code' },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: ({ text }) =>
      h(
        Tag,
        { bordered: false, color: text === 2 ? 'purple' : 'blue' },
        { default: () => (text === 2 ? '岗位' : '部门') }
      ),
  },
  { title: '负责人', dataIndex: 'leader' },
  { title: '联系电话', dataIndex: 'phone' },
  { title: '联系邮箱', dataIndex: 'email' },
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
} = useTable<DeptResp, typeof query.value>({
  api: () => getDeptPageListApi(query.value),
  rowKey: (row) => row.id,
  onPaginate: (pageNum, pageSize) => {
    query.value = { ...query.value, pageNum, pageSize }
    run(query.value)
  },
})

function onSearch(values: DeptSearchForm) {
  query.value = {
    ...query.value,
    pageNum: 1,
    ...(values.name?.trim() ? { name: values.name.trim() } : {}),
    ...(values.type ? { type: values.type } : {}),
  }
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

function onSuccess() {
  query.value = { ...query.value, pageNum: 1 }
  run(query.value)
}
</script>
