<template>
  <div class="h-full flex flex-col gap-10">
    <FormPlus @reset="onReset" @submit="onSearch" :options="formOptions" />
    <TablePlus
      ref="tableRef"
      :api="getMenuPageListApi"
      :columns="columns"
      @update:checked-row-keys="onCheckedRowKeys"
      :context-menu="contextMenu"
      :auto-size="false"
      :pagination="false"
    >
      <template #headerLeft>
        <a-button type="primary" @click="onAdd">
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
        <a-button :disabled="selectedKeys.length === 0" type="primary" ghost>
          <template #icon><Icon name="i-lucide:chevron-down" /></template>
          展开/折叠
        </a-button>
      </template>
    </TablePlus>
    <FormModal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { getMenuPageListApi } from '@/apis'
import { FormPlus, TablePlus, useTable } from '@/components'
import { Icon } from '@/components'
import FormModal from './components/FormModal.vue'
import { h } from 'vue'

import type { TablePlusColumn, FormPlusProps } from '@/components'

const tableRef = ref()
const modalRef = ref<InstanceType<typeof FormModal>>()

const formOptions = ref<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'title',
      label: '菜单名称',
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
    title: '菜单名称',
    dataIndex: 'title',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    customRender: ({ record }) => {
      return record.icon
        ? h(Icon, { name: record.icon as string, size: 16 })
        : null
    },
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    customRender: ({ record }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          'a',
          {
            onClick: () => {
              onEdit(record)
            },
          },
          '编辑'
        ),
        h(
          'a',
          {
            class: 'text-red-500',
          },
          '删除'
        ),
      ])
    },
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

const onAdd = () => {
  modalRef.value?.show()
}

const onEdit = (record: any) => {
  modalRef.value?.show(record)
}

const onSuccess = () => {
  tableRef.value?.run()
}
</script>
