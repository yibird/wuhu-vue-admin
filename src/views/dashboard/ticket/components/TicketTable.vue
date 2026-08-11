<script setup lang="ts">
import type { TableColumnsType } from 'antdv-next'
import {
  getTicketCategoryMeta,
  getTicketPriorityMeta,
  getTicketStatusMeta,
} from '../data'
import type { TicketRecord } from '../types'

defineProps<{
  items: TicketRecord[]
  loading: boolean
}>()

const emit = defineEmits<{
  open: [ticket: TicketRecord]
}>()

const columns: TableColumnsType<TicketRecord> = [
  {
    title: '工单',
    dataIndex: 'subject',
    key: 'subject',
    width: 320,
  },
  {
    title: '问题类型',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 110,
  },
  {
    title: '提交人',
    dataIndex: 'reporter',
    key: 'reporter',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'assignee',
    key: 'assignee',
    width: 130,
  },
  {
    title: '最后更新',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
  },
]

const pagination = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50],
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条工单`,
}
</script>

<template>
  <div
    class="min-h-0 overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-container"
  >
    <a-table
      :columns="columns"
      :data-source="items"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ x: 1130 }"
      row-key="id"
      size="middle"
    >
      <template #emptyText>
        <a-empty description="没有符合条件的工单" />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'subject'">
          <button
            type="button"
            class="max-w-full bg-transparent text-left"
            @click="emit('open', record)"
          >
            <span class="block truncate text-sm text-main font-600">
              {{ record.subject }}
            </span>
            <span class="mt-3 block truncate text-xs text-secondary">
              {{ record.id }} · {{ record.description }}
            </span>
          </button>
        </template>

        <template v-else-if="column.key === 'category'">
          <span class="inline-flex items-center gap-5 text-xs text-regular">
            <Icon
              :name="getTicketCategoryMeta(record.category).icon"
              :size="13"
            />
            {{ getTicketCategoryMeta(record.category).label }}
          </span>
        </template>

        <template v-else-if="column.key === 'priority'">
          <a-tag
            :bordered="false"
            :color="getTicketPriorityMeta(record.priority).color"
          >
            {{ getTicketPriorityMeta(record.priority).label }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'status'">
          <a-tag
            :bordered="false"
            :color="getTicketStatusMeta(record.status).color"
          >
            <span class="inline-flex items-center gap-4">
              <Icon
                :name="getTicketStatusMeta(record.status).icon"
                :size="12"
              />
              {{ getTicketStatusMeta(record.status).label }}
            </span>
          </a-tag>
        </template>

        <template v-else-if="column.key === 'reporter'">
          <div class="min-w-0">
            <div class="truncate text-xs text-main">{{ record.reporter }}</div>
            <div class="mt-2 truncate text-11px text-secondary">
              {{ record.contact }}
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'assignee'">
          <span
            :class="record.assignee === '待分配' ? 'text-warning' : 'text-main'"
            class="text-xs"
          >
            {{ record.assignee }}
          </span>
        </template>

        <template v-else-if="column.key === 'updatedAt'">
          <span class="text-xs text-secondary">{{ record.updatedAt }}</span>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="emit('open', record)">
            查看
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
