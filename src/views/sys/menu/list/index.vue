<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <FormPlus
      class="rounded-4 bg-container p-16"
      :grid="{
        cols: { sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 },
        xGap: 10,
        yGap: 10,
      }"
      :schemas="schemas"
      label-placement="left"
      :label-width="80"
      @reset="onReset"
      @submit="onSearch"
    />

    <div class="flex flex-wrap items-center gap-8">
      <a-button type="primary" @click="onAdd">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新建
      </a-button>
      <a-button
        :disabled="selectedRowKeys.length === 0"
        type="primary"
        danger
        ghost
      >
        <template #icon><Icon name="i-lucide:trash-2" /></template>
        删除
      </a-button>
      <a-button :disabled="selectedRowKeys.length === 0" type="primary" ghost>
        <template #icon><Icon name="i-lucide:chevron-down" /></template>
        展开/折叠
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 1330, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <FormModal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { Tag } from 'antdv-next'
import { getMenuPageListApi, type MenuResp } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { useRequest, useTabs } from '@/hooks'
import FormModal from './components/form-modal.vue'

import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

interface MenuQuery {
  current: number
  pageSize: number
  name?: string
  status?: boolean
}

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const { openRouteTab } = useTabs()
const modalRef = ref<InstanceType<typeof FormModal>>()
const query = shallowRef<MenuQuery>({ current: 1, pageSize: PAGE_SIZE })
const selectedRowKeys = shallowRef<(string | number)[]>([])

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'name',
    label: '菜单名称',
  },
  {
    component: 'select',
    field: 'status',
    label: '状态',
    componentProps: {
      options: [
        { label: '正常', value: true },
        { label: '停用', value: false },
      ],
    },
  },
])

const columns: TableColumnsType<MenuResp> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  { title: '菜单名称', dataIndex: 'name', width: 200 },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 80,
    render: (value) =>
      value ? h(Icon, { name: String(value), size: 16 }) : null,
  },
  { title: '排序', dataIndex: 'sort', width: 90 },
  { title: '权限标识', dataIndex: 'perms', width: 160 },
  { title: '组件路径', dataIndex: 'component', width: 200, ellipsis: true },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value) =>
      h(
        Tag,
        { bordered: false, color: value ? 'success' : 'default' },
        { default: () => (value ? '正常' : '停用') }
      ),
  },
  { title: '创建时间', dataIndex: 'createdAt', width: 170 },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    render: (_value, record) =>
      h('div', { class: 'flex gap-12' }, [
        h(
          'a',
          { class: 'text-primary', onClick: () => onDetail(record) },
          '详情'
        ),
        h(
          'a',
          { class: 'text-primary', onClick: () => onEdit(record) },
          '编辑'
        ),
        h('a', { class: 'text-error' }, '删除'),
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: MenuQuery) => getMenuPageListApi(params),
  { defaultParams: [query.value] }
)

const dataSource = computed(() => data.value?.data?.list ?? [])

const pagination = computed<TablePaginationConfig>(() => ({
  current: query.value.current,
  pageSize: query.value.pageSize,
  total: data.value?.data?.total ?? 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

const rowSelection = computed<TableRowSelection<MenuResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? PAGE_SIZE,
  }
  run(query.value)
}

const onSearch = (values: FormPlusModel) => {
  query.value = {
    ...query.value,
    current: 1,
    name: (values.name as string)?.trim() || undefined,
    status: values.status as boolean | undefined,
  }
  run(query.value)
}

const onReset = () => {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

const onAdd = () => {
  modalRef.value?.show()
}

function onDetail(record: MenuResp) {
  openRouteTab({
    path: '/sys/menu/detail',
    title: `菜单详情-${record.name}`,
    icon: record.icon || 'i-lucide:menu',
    query: { id: record.id },
  })
}

const onEdit = (record: MenuResp) => {
  modalRef.value?.show(record)
}

const onSuccess = () => {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}
</script>
