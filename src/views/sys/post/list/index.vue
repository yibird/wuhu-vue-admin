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
      <a-button type="primary" @click="openCreate">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新增岗位
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 1180, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    />

    <PostForm
      v-model:open="formOpen"
      :dept-options="deptOptions"
      :id="editingPostId"
      :options-loading="optionsLoading"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from 'antdv-next'
import { getDeptPageListApi, type SysDept } from '@/apis'
import { FormPlus } from '@/components/form-plus'
import { Icon } from '@/components/icon'
import { useRequest, useTabs } from '@/hooks'
import type { DeptPickerOption } from '@/features'
import { PostForm } from './components'

import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'

interface PostQuery {
  current: number
  pageSize: number
  type: 2
  name?: string
  code?: string
}

const PAGE_SIZE = 10
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const formOpen = shallowRef(false)
const editingPostId = shallowRef<string>()
const { openRouteTab } = useTabs()
const optionsLoading = shallowRef(false)
const deptOptions = shallowRef<DeptPickerOption[]>([])
const deptNames = shallowRef(new Map<string, string>())
const query = shallowRef<PostQuery>({
  current: 1,
  pageSize: PAGE_SIZE,
  type: 2,
})
const selectedRowKeys = shallowRef<(string | number)[]>([])

const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'name',
    label: '岗位名称',
    componentProps: { allowClear: true, placeholder: '请输入岗位名称' },
  },
  {
    component: 'input',
    field: 'code',
    label: '岗位编码',
    componentProps: { allowClear: true, placeholder: '请输入岗位编码' },
  },
])
const columns: TableColumnsType<SysDept> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  { title: '岗位名称', dataIndex: 'name', width: 160 },
  { title: '岗位编码', dataIndex: 'code', width: 160 },
  {
    title: '所属部门',
    dataIndex: 'parentId',
    width: 160,
    render: (text) => deptNames.value.get(String(text)) ?? '-',
  },
  { title: '岗位负责人', dataIndex: 'leader', width: 140 },
  { title: '联系电话', dataIndex: 'phone', width: 140 },
  { title: '联系邮箱', dataIndex: 'email', width: 200 },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 140,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          Button,
          { type: 'link', onClick: () => openDetail(record) },
          { default: () => '详情' }
        ),
        h(
          Button,
          { type: 'link', onClick: () => openEdit(record.id) },
          { default: () => '编辑' }
        ),
      ]),
  },
]

const { data, loading, run } = useRequest(
  (params: PostQuery) => getDeptPageListApi(params),
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

const rowSelection = computed<TableRowSelection<SysDept>>(() => ({
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

onMounted(loadDepartments)

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function toTreeOptions(items: SysDept[]): DeptPickerOption[] {
  const options = new Map<string, DeptPickerOption>()
  const roots: DeptPickerOption[] = []

  items.forEach((item) => {
    options.set(item.id, {
      title: item.name,
      value: item.id,
      code: item.code,
      children: [],
    })
  })

  items.forEach((item) => {
    const option = options.get(item.id)
    if (!option) return
    const parent = options.get(item.parentId)
    if (parent) parent.children?.push(option)
    else roots.push(option)
  })

  return roots
}

async function loadDepartments() {
  optionsLoading.value = true
  try {
    const response = await getDeptPageListApi({
      current: 1,
      pageSize: 1000,
      type: 1,
    })

    const departments = response.data?.list ?? []
    deptOptions.value = toTreeOptions(departments)
    deptNames.value = new Map(
      departments.map((department) => [department.id, department.name])
    )
  } catch {
    // 业务错误已由请求层统一提示，这里仅停止填充
  } finally {
    optionsLoading.value = false
  }
}

function onSearch(values: FormPlusModel) {
  const name = getText(values.name)
  const code = getText(values.code)
  query.value = {
    current: 1,
    pageSize: query.value.pageSize,
    type: 2,
    ...(name ? { name } : {}),
    ...(code ? { code } : {}),
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize, type: 2 }
  run(query.value)
}

function openCreate() {
  editingPostId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingPostId.value = id
  formOpen.value = true
}

function openDetail(record: SysDept) {
  openRouteTab({
    path: '/sys/post/detail',
    title: `岗位详情-${record.name}`,
    icon: 'i-lucide:briefcase-business',
    query: { id: record.id },
  })
}

function onSuccess() {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}
</script>
