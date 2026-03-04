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
          :items="formItems"
          :show-feedback="false"
          @search="onSearch"
        />
      </template>
    </TablePlus>
    <Detail v-model:show="show" />
  </div>
</template>
<script lang="ts" setup>
import { createDiscreteApi, NA } from 'naive-ui'
import { getRolePageListApi, type RoleResp } from '@/apis'
import { FormPlus, TablePlus, useTable } from '@/components'
import { Detail } from './components'
import type { FormPlusProps, TablePlusColumn } from '@/components'

interface FormState {
  roleName?: string
  ip?: string
  loginTime?: number[][]
}
const show = ref(false)
const formOptions = ref<FormPlusProps['options']>({
  inline: true,
  labelPlacement: 'left',
  grid: { xGap: 20, yGap: 10 },
  model: {
    username: '123123',
    ip: '',
    loginTime: [1183135260000, Date.now()],
  },
})
const formItems = ref<FormPlusProps['items']>([
  {
    label: '登录用户',
    type: 'input',
    path: 'username',
    componentProps: {
      clearable: true,
      placeholder: '请输入标题登录用户',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:5 xxl:4',
  },
  {
    label: 'IP',
    type: 'input',
    path: 'ip',
    componentProps: {
      clearable: true,
      placeholder: '请输入IP或地址',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:5 xxl:4',
  },
  {
    label: '登录时间',
    type: 'datePicker',
    componentProps: {
      type: 'datetimerange',
      clearable: true,
      placeholder: '请输入登录时间',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:5 xxl:4',
  },
])

const query = ref({ pageNum: 1, pageSize: 10 })

const columns: TablePlusColumn<RoleResp>[] = [
  {
    title: '角色名称',
    key: 'roleName',
    render: (row) =>
      h(
        'span',
        { class: 'text-theme cursor-pointer', onClick: () => onClick(row) },
        row.roleName
      ),
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
  message.success('请求成功')
}
const onClick = (row: RoleResp) => {
  console.log('row:', row)
  show.value = true
}
</script>
