<template>
  <div class="h-full flex flex-col gap-10">
    <FormPlus @reset="onReset" @submit="onSearch" :options="formOptions" />
    <TablePlus
      ref="tableRef"
      :api="getRolePageListApi"
      :columns="columns"
      @update:checked-row-keys="onCheckedRowKeys"
      :context-menu="contextMenu"
    >
      <template #headerLeft>
        <a-button type="primary">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建
        </a-button>
        <a-button
          :disabled="selectedKeys.length === 0"
          type="primary"
          danger
          ghost
        >
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </template>
    </TablePlus>
  </div>
</template>

<script setup lang="ts">
import { getRolePageListApi } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import type { FormPlusProps } from '@/components/form-plus'
import { TablePlus, useTable } from '@/components/table-plus'
import type { TablePlusColumn } from '@/components/table-plus'

const tableRef = ref()

const formOptions = ref<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'roleName',
      label: '角色名称',
    },
    {
      type: 'input',
      field: 'roleKey',
      label: '角色标识',
    },
    {
      type: 'select',
      field: 'status',
      label: '状态',
      props: {
        options: [
          { label: '正常', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
    },
  ],
})

const columns = ref<TablePlusColumn[]>([
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '角色标识',
    dataIndex: 'roleKey',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
])

const { selectedKeys, onCheckedRowKeys } = useTable()

const contextMenu = () => [
  {
    label: '编辑',
    key: 'edit',
    icon: () => h('span', { class: 'i-lucide:edit' }),
  },
  {
    label: '删除',
    key: 'delete',
    icon: () => h('span', { class: 'i-lucide:trash-2' }),
  },
]

const onSearch = (values: any) => {
  tableRef.value?.run(values)
}
const onReset = () => {
  tableRef.value?.run()
}
</script>
