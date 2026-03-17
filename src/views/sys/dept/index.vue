<template>
  <div class="full p-10">
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
        <FormPlus
          ref="formRef"
          :options="formOptions"
          :items="formItems as FormPlusItem[]"
          :show-feedback="false"
          @search="onSearch"
        />
      </template>
      <template #headerRight>
        <n-button type="primary">新增</n-button>
        <n-button type="primary">组织架构图</n-button>
      </template>
    </TablePlus>
  </div>
</template>
<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui'
import { getRolePageListApi, type RoleResp } from '@/apis'
import { FormPlus, TablePlus, useTable } from '@/components'
import type { FormPlusItem, FormPlusProps, TablePlusColumn } from '@/components'

interface FormState {
  roleName?: string
}

const formOptions = ref<FormPlusProps['options']>({
  inline: true,
  labelPlacement: 'left',
  labelWidth: 80,
  grid: { xGap: 10, yGap: 10 },
  model: {
    roleName: '123123',
    test2: '',
  },
})
const formItems = ref<FormPlusProps['items']>([
  {
    label: '部门名称',
    type: 'input',
    path: 'roleName',
    componentProps: {
      clearable: true,
      placeholder: '请输入部门名称',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:6 xxl:5',
  },
  {
    label: '是否启用',
    type: 'input',
    path: 'test2',
    span: '24 xs:24 s:24 m:12 l:8 xl:6 xxl:5',
  },
])

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
  rowKey: (row) => row.id,
  onPaginate: (page, size) => {
    query.value.pageNum = page
    query.value.pageSize = size
    run(query.value)
  },
})

const { message } = createDiscreteApi(['message'])
const onSearch = (values: FormState) => {
  console.log('asdasd', values)
  message.success('请求成功')
}
</script>
