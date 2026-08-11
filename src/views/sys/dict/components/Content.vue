<template>
  <div class="full-flex flex flex-col gap-10 overflow-hidden">
    <TablePlus
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :rowSelection="rowSelection"
      :row-key="rowKey"
      v-model:checked-row-keys="selectedKeys"
      :pagination="pagination"
      class="flex-1 overflow-hidden"
      @update:checked-row-keys="handleCheck"
    >
      <template #headerLeft>
        <FormPlus ref="formRef" :options="formOptions" @submit="onSearch" />
      </template>
      <template #headerRight>
        <a-button type="primary">新增</a-button>
      </template>
    </TablePlus>
  </div>
</template>
<script lang="ts" setup>
import { getRolePageListApi, type RoleResp } from '@/apis'
import { FormPlus, TablePlus, useTable } from '@/components'
import type { FormPlusProps, TablePlusColumn } from '@/components'
import { App } from 'antdv-next'

interface FormState {
  roleName?: string
}

const formOptions = ref<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  grid: { xGap: 10, yGap: 10 },
  items: [
    {
      label: '角色名称',
      type: 'input',
      field: 'roleName',
      props: {
        clearable: true,
        placeholder: '请输入角色名称',
        span: 6,
      },
    },
    {
      label: '是否启用',
      type: 'input',
      field: 'test2',
      props: {
        span: 6,
      },
    },
  ],
})

const query = ref({ pageNum: 1, pageSize: 10 })

const columns: TablePlusColumn<RoleResp>[] = [
  {
    title: '角色名称',
    key: 'roleName',
  },
  {
    title: '作用域',
    key: 'roleCode',
    minWidth: 100,
    resizable: true,
  },
  {
    title: '描述',
    key: 'remark',
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
} = useTable<RoleResp, { pageNum: number; pageSize: number }>({
  api: () => getRolePageListApi(query.value),
  rowKey: (row) => String(row.id),
  onPaginate: (page, size) => {
    query.value.pageNum = page
    query.value.pageSize = size
    run(query.value)
  },
})

const { message } = App.useApp()
const onSearch = (values: FormState) => {
  query.value.pageNum = 1
  run(query.value)
  const keyword = values.roleName?.trim()
  message.success(keyword ? `已按「${keyword}」查询字典` : '已刷新字典列表')
}
</script>
