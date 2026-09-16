<script setup lang="ts">
import { Modal, message } from 'antdv-next'
import { watch } from 'vue'
import {
  deleteDictItemApi,
  getDictItemPageListApi,
  type DictItemQuery,
  type DictItemResp,
} from '@/apis'
import {
  TablePlus,
  useTable,
  type TablePlusColumn,
} from '@/components/table-plus'
import DictItemForm from './DictItemForm.vue'
import type { DictItemContentProps } from './types'

const props = defineProps<DictItemContentProps>()

const formOpen = shallowRef(false)
const editingId = shallowRef<string>()
const query = shallowRef<DictItemQuery>(
  createQuery(props.dictId, props.filters)
)

const columns: TablePlusColumn<DictItemResp>[] = [
  { title: '标签', dataIndex: 'label', ellipsis: true },
  { title: '值', dataIndex: 'value', ellipsis: true },
  { title: '排序', dataIndex: 'sort', width: 90 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', key: 'action', fixed: 'right', width: 80 },
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
  unSelectedAll,
} = useTable<DictItemResp, DictItemQuery>({
  api: () => getDictItemPageListApi(query.value),
  rowKey: (row) => row.id,
  initialPagination: {
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 200, 500],
  },
  onPaginate: (pageNum, pageSize) => {
    query.value = { ...query.value, pageNum, pageSize }
    run(query.value)
  },
})

watch(
  () => [
    props.dictId,
    props.filters.label,
    props.filters.value,
    props.filters.status,
  ],
  () => {
    query.value = createQuery(props.dictId, props.filters)
    unSelectedAll()
    run(query.value)
  }
)

function createQuery(dictId: string, filters: DictItemContentProps['filters']) {
  return {
    pageNum: 1,
    pageSize: 10,
    dictId,
    label: filters.label,
    value: filters.value,
    status: filters.status,
  }
}

function openCreate() {
  editingId.value = undefined
  formOpen.value = true
}

function getCellText(record: DictItemResp, dataIndex?: string | number) {
  if (typeof dataIndex !== 'string') return '-'
  const value = record[dataIndex as keyof DictItemResp]
  return typeof value === 'string' || typeof value === 'number' ? value : '-'
}

function openEdit(id: string) {
  editingId.value = id
  formOpen.value = true
}

function onSuccess() {
  query.value = { ...query.value, pageNum: 1 }
  run(query.value)
}

function handleDeleteSelected() {
  if (selectedKeys.value.length === 0) return

  Modal.confirm({
    title: '删除字典明细',
    content: `确定删除选中的 ${selectedKeys.value.length} 条字典明细吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteDictItemApi(selectedKeys.value)
        message.success('字典明细删除成功')
        unSelectedAll()
        run(query.value)
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>

<template>
  <TablePlus
    v-model:checked-row-keys="selectedKeys"
    class="full"
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-selection="rowSelection"
    :index-col="false"
    @refresh="run(query)"
    @update:checked-row-keys="handleCheck"
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
      <span v-else>{{ getCellText(record, column.dataIndex) }}</span>
    </template>
    <template #headerLeft>
      <a-button type="primary" @click="openCreate">
        <template #icon><Icon name="i-lucide:plus" /></template>
        新建明细
      </a-button>
      <a-button
        danger
        ghost
        type="primary"
        :disabled="selectedKeys.length === 0"
        @click="handleDeleteSelected"
      >
        <template #icon><Icon name="i-lucide:trash-2" /></template>
        批量删除
      </a-button>
    </template>
  </TablePlus>

  <DictItemForm
    v-model:open="formOpen"
    :dict-id="dictId"
    :id="editingId"
    @success="onSuccess"
  />
</template>
