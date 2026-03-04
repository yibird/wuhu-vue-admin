<template>
  <div class="full p-10 flex flex-col gap-10 overflow-hidden">
    <div class="bg-white p-10">
      <FormPlus ref="formRef" :options="formOptions" :items="formItems" />
      <n-button @click="onSetFiledValue">setFiledValue</n-button>
      <n-button @click="onGetFiledValue">getFiledValue</n-button>
      <n-button @click="onResetFiledValue">resetFiledValue</n-button>
    </div>
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
    />
  </div>
</template>
<script lang="ts" setup>
import { getRolePageListApi, type RoleResp } from '@/apis'
import {
  TablePlus,
  useTable,
  FormPlus,
  type NFormProps,
  type TablePlusColumn,
  type NFormInstance,
} from '@/components'
import { NTag, type TagProps } from 'naive-ui'

const dataScopeMapping: Record<
  number,
  { text: string; type: TagProps['type'] }
> = {
  0: {
    type: 'primary',
    text: '所有数据权限',
  },
  1: {
    type: 'success',
    text: '本部门及以下数据权限',
  },
  2: {
    type: 'warning',
    text: '本部门数据权限',
  },
  3: {
    type: 'error',
    text: '仅本人数据权限',
  },
}

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
    render({ dataScope }, rowIndex: number) {
      const item = dataScopeMapping[dataScope]
      if (!item) return
      const { type, text } = item
      return h(NTag, { type }, { default: () => text })
    },
  },
  {
    title: '描述',
    key: 'remark',
  },
]

const query = ref({ pageNum: 1, pageSize: 10 })

const {
  loading,
  data,
  dataSource,
  pagination,
  rowSelection,
  selectedAll,
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
console.log('asdASD:', dataSource)

const formRef = ref<NFormInstance>()
const formOptions = ref<NFormProps['options']>({
  inline: true,
  labelPlacement: 'left',
  grid: { xGap: 24 },
  model: {
    test1: '111',
    test2: '123',
  },
})
const formItems = ref<NFormProps['items']>([
  {
    label: '测试1',
    type: 'input',
    path: 'test1',
    componentProps: {
      clearable: true,
    },
    span: 12,
  },
  {
    label: '测试2',
    type: 'input',
    path: 'test2',
    span: 12,
  },
])
const onSetFiledValue = () => {
  formRef.value?.setFiledValue('test1', '222test1test1')
}
const onGetFiledValue = () => {
  console.log(formRef.value?.getFiledValue('test1'))
}
const onResetFiledValue = () => {
  formRef.value?.resetFiledValue('test1')
}
</script>
