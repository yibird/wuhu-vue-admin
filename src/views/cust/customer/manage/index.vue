<template>
  <div class="full-flex p-10 flex flex-col gap-10 overflow-hidden">
    <div class="bg-white p-10">
      <FormPlus ref="formRef" :options="formOptions" />
      <div class="mt-10 flex flex-wrap gap-8">
        <a-button @click="onSetFiledValue">设置字段值</a-button>
        <a-button @click="onGetFiledValue">读取字段值</a-button>
        <a-button @click="onResetFiledValue">重置字段值</a-button>
      </div>
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
  type FormPlusProps,
  type TablePlusColumn,
  type FormPlusInstance,
} from '@/components'
import { Tag, message } from 'antdv-next'

const dataScopeMapping: Record<number, { text: string; color: string }> = {
  0: {
    color: 'processing',
    text: '所有数据权限',
  },
  1: {
    color: 'success',
    text: '本部门及以下数据权限',
  },
  2: {
    color: 'warning',
    text: '本部门数据权限',
  },
  3: {
    color: 'error',
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
    render({ dataScope }: any) {
      const item = dataScopeMapping[dataScope]
      if (!item) return
      const { color, text } = item
      return h(Tag, { color }, { default: () => text })
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

const formRef = ref<FormPlusInstance>()
const formOptions = ref<FormPlusProps['options']>({
  labelPlacement: 'left',
  grid: { xGap: 24 },
  items: [
    {
      label: '测试1',
      type: 'input',
      field: 'test1',
      props: {
        clearable: true,
        span: 12,
      },
    },
    {
      label: '测试2',
      type: 'input',
      field: 'test2',
      props: {
        span: 12,
      },
    },
  ],
})
const onSetFiledValue = () => {
  formRef.value?.setFieldsValue({
    test1: '示例客户',
    test2: '已启用',
  })
  message.success('已设置表单字段值')
}
const onGetFiledValue = () => {
  const values = formRef.value?.getFieldsValue() ?? {}
  message.info(`当前字段值：${JSON.stringify(values)}`)
}
const onResetFiledValue = () => {
  formRef.value?.reset()
  message.success('已重置表单字段值')
}
</script>
