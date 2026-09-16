<template>
  <div class="h-full flex flex-col gap-10 p-10">
    <FormPlus :options="formOptions" @reset="onReset" @submit="onSearch" />
    <TablePlus
      v-model:checked-row-keys="selectedKeys"
      class="flex-1 overflow-hidden"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      :row-selection="rowSelection"
      @refresh="run(query)"
      @update:checked-row-keys="handleCheck"
    >
      <template #headerRight>
        <a-button type="primary" @click="openCreate">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新增岗位
        </a-button>
      </template>
    </TablePlus>
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
import { getDeptPageListApi, type DeptResp } from '@/apis'
import { FormPlus, Icon } from '@/components'
import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import { TablePlus, useTable } from '@/components/table-plus'
import type { TablePlusColumn } from '@/components/table-plus'
import type { DeptPickerOption } from '@/features'
import { PostForm } from './components'

interface PostQuery {
  pageNum: number
  pageSize: number
  type: 2
  name?: string
  code?: string
}

const formOpen = shallowRef(false)
const editingPostId = shallowRef<string>()
const optionsLoading = shallowRef(false)
const deptOptions = shallowRef<DeptPickerOption[]>([])
const deptNames = shallowRef(new Map<string, string>())
const query = shallowRef<PostQuery>({ pageNum: 1, pageSize: 10, type: 2 })

const formOptions = shallowRef<FormPlusProps['options']>({
  labelPlacement: 'left',
  labelWidth: 80,
  items: [
    {
      type: 'input',
      field: 'name',
      label: '岗位名称',
      props: { clearable: true, placeholder: '请输入岗位名称' },
    },
    {
      type: 'input',
      field: 'code',
      label: '岗位编码',
      props: { clearable: true, placeholder: '请输入岗位编码' },
    },
  ],
})

const columns: TablePlusColumn<DeptResp>[] = [
  { title: '岗位名称', dataIndex: 'name' },
  { title: '岗位编码', dataIndex: 'code' },
  {
    title: '所属部门',
    dataIndex: 'parentId',
    customRender: ({ text }) => deptNames.value.get(String(text)) ?? '-',
  },
  { title: '岗位负责人', dataIndex: 'leader' },
  { title: '联系电话', dataIndex: 'phone' },
  { title: '联系邮箱', dataIndex: 'email' },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 80,
    customRender: ({ record }) =>
      h(
        Button,
        { type: 'link', onClick: () => openEdit(record.id) },
        { default: () => '编辑' }
      ),
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
} = useTable<DeptResp, PostQuery>({
  api: () => getDeptPageListApi(query.value),
  rowKey: (row) => row.id,
  onPaginate: (pageNum, pageSize) => {
    query.value = { ...query.value, pageNum, pageSize }
    run(query.value)
  },
})

onMounted(loadDepartments)

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function toTreeOptions(items: DeptResp[]): DeptPickerOption[] {
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
      pageNum: 1,
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
    pageNum: 1,
    pageSize: query.value.pageSize,
    type: 2,
    ...(name ? { name } : {}),
    ...(code ? { code } : {}),
  }
  run(query.value)
}

function onReset() {
  query.value = { pageNum: 1, pageSize: query.value.pageSize, type: 2 }
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

function onSuccess() {
  query.value = { ...query.value, pageNum: 1 }
  run(query.value)
}
</script>
