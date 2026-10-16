<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <div class="flex flex-wrap items-center gap-8">
      <a-button type="primary" @click="openCreate">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新建明细
      </a-button>
      <a-button
        danger
        ghost
        type="primary"
        :disabled="selectedRowKeys.length === 0"
        @click="handleDeleteSelected"
      >
        <template #icon><Icon name="i-lucide:trash-2" /></template>
        批量删除
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 980, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    >
      <template #bodyCell="{ column, record }">
        <a-tag
          v-if="column.dataIndex === 'status'"
          bordered
          :color="record.status ? 'success' : 'default'"
        >
          {{ record.status ? '正常' : '停用' }}
        </a-tag>
        <a-button
          v-else-if="column.key === 'action'"
          size="small"
          type="link"
          @click="openEdit(record.id)"
        >
          编辑
        </a-button>
      </template>
    </a-table>

    <DictItemForm
      v-model:open="formOpen"
      :dict-id="dictId"
      :id="editingId"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Modal, message } from 'antdv-next'
import { watch } from 'vue'
import {
  deleteDictItemApi,
  getDictItemPageListApi,
  type DictItemQuery,
  type DictItemResp,
} from '@/apis'
import { useRequest } from '@/hooks'
import DictItemForm from './dict-item-form.vue'

import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'antdv-next'
import type { DictItemContentProps } from './types'

const props = defineProps<DictItemContentProps>()

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500]
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容(含上方字典列表头部)所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 340px)'

const formOpen = shallowRef(false)
const editingId = shallowRef<string>()
const selectedRowKeys = shallowRef<(string | number)[]>([])
const query = shallowRef<DictItemQuery>(
  createQuery(props.dictId, props.filters)
)

const columns: TableColumnsType<DictItemResp> = [
  { title: '标签', dataIndex: 'label', width: 160, ellipsis: true },
  { title: '值', dataIndex: 'value', width: 160, ellipsis: true },
  { title: '排序', dataIndex: 'sort', width: 90 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '备注', dataIndex: 'remark', width: 200, ellipsis: true },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', key: 'action', fixed: 'right', width: 90 },
]

const { data, loading, run } = useRequest(
  (params: DictItemQuery) => getDictItemPageListApi(params),
  { defaultParams: [query.value] }
)

const dataSource = computed(() => data.value?.data?.list ?? [])

const pagination = computed<TablePaginationConfig>(() => ({
  current: query.value.current,
  pageSize: query.value.pageSize,
  total: data.value?.data?.total ?? 0,
  showSizeChanger: true,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
  showTotal: (total: number) => `共 ${total} 条`,
}))

const rowSelection = computed<TableRowSelection<DictItemResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

watch(
  () => [
    props.dictId,
    props.filters.label,
    props.filters.value,
    props.filters.status,
  ],
  () => {
    query.value = createQuery(props.dictId, props.filters)
    selectedRowKeys.value = []
    run(query.value)
  }
)

function createQuery(dictId: string, filters: DictItemContentProps['filters']) {
  return {
    current: 1,
    pageSize: 10,
    dictId,
    label: filters.label,
    value: filters.value,
    status: filters.status,
  }
}

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? 10,
  }
  run(query.value)
}

function openCreate() {
  editingId.value = undefined
  formOpen.value = true
}

function openEdit(id: string) {
  editingId.value = id
  formOpen.value = true
}

function onSuccess() {
  query.value = { ...query.value, current: 1 }
  run(query.value)
}

function handleDeleteSelected() {
  if (selectedRowKeys.value.length === 0) return

  Modal.confirm({
    title: '删除字典明细',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 条字典明细吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteDictItemApi(selectedRowKeys.value)
        message.success('字典明细删除成功')
        selectedRowKeys.value = []
        run(query.value)
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>
