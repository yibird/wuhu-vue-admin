<template>
  <div class="h-full overflow-hidden bg-container rounded-4">
    <a-table
      :columns="columns"
      :data-source="items"
      :pagination="false"
      :scroll="{ x: 1080, y: 'calc(100vh - 230px)' }"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <div class="min-w-0">
            <div class="truncate text-main font-600">{{ record.title }}</div>
            <div class="mt-3 max-w-360 truncate text-xs text-secondary">
              {{ record.description }}
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'priority'">
          <a-tag :bordered="false" :color="priorityMeta(record).color">
            <span class="inline-flex items-center gap-3">
              <Icon :name="priorityMeta(record).icon" :size="12" />
              {{ priorityMeta(record).label }}
            </span>
          </a-tag>
        </template>
        <template v-else-if="column.key === 'assignee'">
          <div class="min-w-0 flex items-center gap-8">
            <span
              class="size-26 shrink-0 flex items-center justify-center rounded-full text-xs font-600"
              :class="assigneeMeta(record).avatarClass"
            >
              {{ assigneeMeta(record).label.slice(0, 1) }}
            </span>
            <div class="min-w-0">
              <div class="truncate text-xs text-main">
                {{ assigneeMeta(record).label }}
              </div>
              <div class="truncate text-11px text-secondary">
                {{ assigneeMeta(record).role }}
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'dueDate'">
          <span
            class="inline-flex items-center gap-4 text-xs"
            :class="dueMeta(record).class"
            :title="dueMeta(record).fullText"
          >
            <Icon :name="dueMeta(record).icon" :size="13" />
            {{ dueMeta(record).fullText }}
          </span>
        </template>
        <template v-else-if="column.key === 'module'">
          <div class="min-w-0">
            <div class="truncate text-xs text-main">
              {{ record.module || '-' }}
            </div>
            <div class="mt-3 flex flex-wrap gap-4">
              <a-tag
                v-if="record.estimatedHours"
                :bordered="false"
                color="purple"
              >
                {{ record.estimatedHours }}h
              </a-tag>
              <a-tag
                v-for="tag in record.tags ?? []"
                :key="tag"
                :bordered="false"
                color="default"
              >
                {{ tag }}
              </a-tag>
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :bordered="false" :color="statusMeta(record.status).color">
            {{ statusMeta(record.status).text }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="emit('edit', record)">
            <template #icon>
              <Icon name="i-lucide:pencil" />
            </template>
            修改
          </a-button>
          <a-button
            type="link"
            size="small"
            danger
            @click="emit('delete', record)"
          >
            <template #icon>
              <Icon name="i-lucide:trash-2" />
            </template>
            删除
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'antdv-next'
import {
  getTaskAssigneeMeta,
  getTaskDueMeta,
  getTaskPriorityMeta,
  getTaskStatusMeta,
} from '../../constants'
import type { Task, TaskActionEmits, TaskStatusValue } from '../types'

const emit = defineEmits<TaskActionEmits>()
const items = defineModel<Task[]>('items', { default: () => [] })

const columns: TableColumnsType<Task> = [
  {
    title: '任务名称',
    dataIndex: 'title',
    key: 'title',
    width: 260,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
  },
  {
    title: '负责人',
    dataIndex: 'assignee',
    key: 'assignee',
    width: 150,
  },
  {
    title: '截止时间',
    dataIndex: 'dueDate',
    key: 'dueDate',
    width: 180,
  },
  {
    title: '模块/工时',
    dataIndex: 'module',
    key: 'module',
    width: 160,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center',
  },
]

function statusMeta(status: TaskStatusValue) {
  return getTaskStatusMeta(status)
}

function priorityMeta(task: Task) {
  return getTaskPriorityMeta(task.priority)
}

function assigneeMeta(task: Task) {
  return getTaskAssigneeMeta(task.assignee)
}

function dueMeta(task: Task) {
  return getTaskDueMeta(task.dueDate, task.status)
}
</script>
