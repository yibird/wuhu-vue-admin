<template>
  <div class="full flex flex-col gap-10 overflow-hidden">
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
          :items="formItems"
          :show-feedback="false"
          @search="onSearch"
        />
      </template>
      <template #headerRight>
        <n-button type="primary">新增</n-button>
      </template>
    </TablePlus>
  </div>
</template>
<script lang="ts" setup>
import { getRolePageListApi, type RoleResp } from '@/apis'
import { FormPlus, TablePlus, useTable } from '@/components'
import type { FormPlusProps, TablePlusColumn } from '@/components'
import { createDiscreteApi } from 'naive-ui'

interface FormState {
  roleName?: string
}

const formOptions = ref<FormPlusProps['options']>({
  inline: true,
  labelPlacement: 'left',
  labelWidth: 80,
  grid: { xGap: 0, yGap: 10 },
  model: {
    roleName: '123123',
    test2: '',
  },
})
const formItems = ref<FormPlusProps['items']>([
  {
    label: '角色名称',
    type: 'input',
    path: 'roleName',
    componentProps: {
      clearable: true,
      placeholder: '请输入角色名称',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:6 xxl:6',
  },
  {
    label: '是否启用',
    type: 'input',
    path: 'test2',
    span: '24 xs:24 s:24 m:12 l:8 xl:6 xxl:6',
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
