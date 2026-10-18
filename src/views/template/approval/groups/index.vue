<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="page-enter page-enter--1 flex flex-none flex-wrap items-center gap-10 border-b-1 border-color-2 border-b-solid bg-container px-12 py-10 sm:px-16"
      >
        <span
          class="size-38 flex flex-none items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:folder-tree" :size="19" />
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="m-0 text-base text-main font-700">流程分组</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            按使用场景将审批流程归组，便于发起与检索
          </p>
        </div>
        <a-button type="primary" @click="openCreate">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建分组
        </a-button>
      </header>

      <main
        class="page-enter page-enter--2 min-h-0 flex-1 overflow-y-auto p-12 sm:p-16"
      >
        <div
          class="mb-12 flex flex-wrap items-center gap-8 rounded-8 border-1 border-color-2 border-solid bg-container p-12"
        >
          <a-input-search
            v-model:value="keyword"
            allow-clear
            class="w-full sm:w-260"
            placeholder="搜索分组名称或编码"
            @search="onSearch"
          />
          <a-select
            v-model:value="enabledFilter"
            class="w-130"
            :options="enabledOptions"
            @change="onSearch"
          />
          <a-button @click="onReset">重置</a-button>

          <div class="ml-auto flex flex-wrap items-center gap-8">
            <span class="text-xs text-secondary"> 共 {{ total }} 个分组 </span>
            <a-tag color="processing" :bordered="false">
              {{ enabledCount }} 个启用
            </a-tag>
            <a-tag color="blue" :bordered="false">
              {{ flowCount }} 个流程已归组
            </a-tag>
          </div>
        </div>

        <a-table
          :columns="columns"
          :data-source="list"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 980, y: TABLE_SCROLL_Y }"
          row-key="id"
          @change="onTableChange"
        >
          <template #emptyText>
            <a-empty description="暂无流程分组，点击右上角新建" />
          </template>
        </a-table>
      </main>

      <GroupForm v-model:open="formOpen" :id="editingId" @success="reload" />
      <GroupFlowsDrawer
        v-model:open="flowsOpen"
        :group="managingGroup"
        @success="reload"
      />
    </div>
  </WView>
</template>

<script setup lang="ts">
import { Button, Modal, Switch, Tag } from 'antdv-next'
import { WView, Icon } from '@/components'
import { formatDateTime } from '../shared'
import { GroupFlowsDrawer, GroupForm } from './components'
import { useApprovalGroups } from './hooks'
import type { ApprovalGroupQuery, ApprovalGroupResp } from '@/apis'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'

const TABLE_SCROLL_Y = 'calc(100vh - 330px)'

const {
  list,
  loading,
  current,
  pageSize,
  total,
  search,
  reload,
  onPageChange,
  toggleEnabled,
  removeGroup,
} = useApprovalGroups()

const keyword = shallowRef('')
const enabledFilter = shallowRef<'all' | 'enabled' | 'disabled'>('all')
const enabledOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '已停用', value: 'disabled' },
]

const formOpen = shallowRef(false)
const editingId = shallowRef<string>()
const flowsOpen = shallowRef(false)
const managingGroup = shallowRef<ApprovalGroupResp>()

const enabledCount = computed(
  () => list.value.filter((item) => item.enabled).length
)
const flowCount = computed(() =>
  list.value.reduce((sum, item) => sum + item.definitionCount, 0)
)

const pagination = computed<TablePaginationConfig>(() => ({
  current: current.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (value: number) => `共 ${value} 条`,
}))

const columns: TableColumnsType<ApprovalGroupResp> = [
  {
    title: '分组',
    dataIndex: 'name',
    width: 240,
    render: (_value, record) =>
      h('div', { class: 'min-w-0 flex items-center gap-10' }, [
        h(
          'span',
          {
            class:
              'size-32 flex-none flex-center rounded-7 bg-primary/10 text-primary',
          },
          [h(Icon, { name: 'i-lucide:folder', size: 16 })]
        ),
        h('div', { class: 'min-w-0' }, [
          h(
            'div',
            { class: 'truncate text-sm text-main font-600' },
            record.name
          ),
          h(
            'div',
            { class: 'mt-2 truncate text-11px text-secondary' },
            record.code
          ),
        ]),
      ]),
  },
  {
    title: '说明',
    dataIndex: 'description',
    ellipsis: true,
    render: (value?: string) => value || '-',
  },
  {
    title: '包含流程',
    dataIndex: 'definitionCount',
    width: 110,
    render: (value: number) =>
      h(
        Tag,
        { color: value ? 'blue' : 'default', bordered: false },
        { default: () => `${value} 个` }
      ),
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 80,
    render: (value: boolean, record) =>
      h(Switch, {
        checked: value,
        onChange: (checked: boolean) => void toggleEnabled(record, checked),
      }),
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80,
    render: (value: number) => value ?? 0,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 160,
    render: (value: string) => formatDateTime(value),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 176,
    render: (_value, record) =>
      h('div', { class: 'flex items-center gap-0' }, [
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            class: 'px-4!',
            onClick: () => openFlows(record),
          },
          { default: () => '管理流程' }
        ),
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            class: 'px-4!',
            onClick: () => openEdit(record),
          },
          { default: () => '编辑' }
        ),
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            class: 'px-4!',
            danger: true,
            onClick: () => onDelete(record),
          },
          { default: () => '删除' }
        ),
      ]),
  },
]

function buildQuery(): ApprovalGroupQuery {
  return {
    keyword: keyword.value.trim() || undefined,
    enabled:
      enabledFilter.value === 'all'
        ? undefined
        : enabledFilter.value === 'enabled',
  }
}

function onSearch() {
  search(buildQuery())
}

function onReset() {
  keyword.value = ''
  enabledFilter.value = 'all'
  search({})
}

function onTableChange(page: TablePaginationConfig) {
  onPageChange(page.current ?? 1, page.pageSize ?? 10)
}

function openCreate() {
  editingId.value = undefined
  formOpen.value = true
}

function openEdit(group: ApprovalGroupResp) {
  editingId.value = group.id
  formOpen.value = true
}

function openFlows(group: ApprovalGroupResp) {
  managingGroup.value = group
  flowsOpen.value = true
}

function onDelete(group: ApprovalGroupResp) {
  Modal.confirm({
    title: '删除分组',
    content: `确定删除「${group.name}」吗？分组内的审批流程不会被删除。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => removeGroup(group),
  })
}
</script>
