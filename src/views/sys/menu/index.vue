<template>
  <div class="full p-10 flex flex-col gap-10 overflow-hidden">
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
        <n-button type="primary" @click="show = true">新建菜单</n-button>
      </template>
    </TablePlus>
    <MenuModal v-model:show="show" />
  </div>
</template>
<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui'
import { MenuModal } from './components'
import { getRolePageListApi, type RoleResp } from '@/apis'
import { FormPlus, TablePlus, useTable } from '@/components'
import type { FormPlusProps, TablePlusColumn } from '@/components'

interface FormState {
  roleName?: string
}

const show = ref(false)
const formOptions = ref<FormPlusProps['options']>({
  inline: true,
  labelPlacement: 'left',
  grid: { xGap: 20, yGap: 10 },
  model: {
    menuTitle: '123123',
    routePath: '',
    permission: '',
  },
})
const formItems = ref<FormPlusProps['items']>([
  {
    label: '菜单标题',
    type: 'input',
    path: 'menuTitle',
    componentProps: {
      clearable: true,
      placeholder: '请输入菜单标题',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:4 xxl:4',
  },
  {
    label: '路由地址',
    type: 'input',
    path: 'routePath',
    componentProps: {
      clearable: true,
      placeholder: '请输入路由地址',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:4 xxl:4',
  },
  {
    label: '权限标识',
    type: 'input',
    path: 'permission',
    componentProps: {
      clearable: true,
      placeholder: '请输入权限标识',
    },
    span: '24 xs:24 s:24 m:12 l:8 xl:4 xxl:4',
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
  message.success('请求成功')
}
</script>
