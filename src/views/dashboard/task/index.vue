<template>
  <WView>
    <Scrollbar
      class="h-full overflow-hidden"
      content-class="full min-h-0 min-w-0 flex flex-col gap-10"
    >
      <div v-if="isLoading" class="min-h-0 min-w-0 flex-1 overflow-hidden">
        <Skeleton />
      </div>
      <div
        v-else
        class="page-enter page-enter--1 flex flex-wrap items-center justify-between gap-12 rounded-4 bg-container p-12"
      >
        <div class="flex flex-wrap items-center gap-8">
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            添加任务
          </a-button>
          <a-tag color="blue">共 {{ tasks.length }} 个任务</a-tag>
          <a-tag color="green">当前 {{ filteredTasks.length }} 个</a-tag>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-10">
          <a-input
            v-model:value="keyword"
            allow-clear
            class="w-220 max-sm:w-full"
            placeholder="搜索任务、负责人、优先级"
          />
          <a-select
            v-model:value="statusFilter"
            class="w-130 max-sm:w-full"
            :options="filterStatusOptions"
          />
          <a-radio-group v-model:value="type" class="whitespace-nowrap">
            <a-radio-button
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div
        v-if="!isLoading"
        class="page-enter page-enter--2 min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <Component
          :is="component"
          v-model:items="visibleTasks"
          @delete="confirmDeleteTask"
          @edit="openEditModal"
        />
      </div>
    </Scrollbar>

    <a-modal
      v-model:open="modalOpen"
      :title="editingTask ? '编辑任务' : '添加任务'"
      destroy-on-hidden
      ok-text="保存"
      cancel-text="取消"
      :width="720"
      @ok="handleSubmit"
    >
      <Form ref="formRef" v-model="formState" />
    </a-modal>
  </WView>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import message from 'antdv-next/dist/message/index'
import Modal from 'antdv-next/dist/modal/index'
import { shallowReactive, shallowRef } from 'vue'
import { useLoading } from '@/composables'
import type { Component } from 'vue'
import type { Task, TaskFormState, TaskStatusValue } from './components'
import Form from './components/Form.vue'
import Skeleton from './components/Skeleton.vue'
import CardTask from './components/card/index.vue'
import GanttTask from './components/gantt/index.vue'
import TableTask from './components/table/index.vue'
import { tasks as initialTasks } from './dataSource'
import {
  getTaskAssigneeMeta,
  getTaskPriorityMeta,
  taskDateTimeFormat,
  taskAssigneeList,
  taskStatusSelectOptions,
} from './constants'

type TaskViewType = 'card' | 'table' | 'gantt'
type TaskFilterStatus = TaskStatusValue | 'all'

interface TaskViewOption {
  label: string
  value: TaskViewType
  component: Component
}

const tasks = shallowRef<Task[]>(initialTasks.map((item) => ({ ...item })))
const keyword = shallowRef('')
const statusFilter = shallowRef<TaskFilterStatus>('all')
const type = shallowRef<TaskViewType>('card')
const modalOpen = shallowRef(false)
const editingTask = shallowRef<Task | null>(null)
const { isLoading } = useLoading()
const formRef = shallowRef<InstanceType<typeof Form>>()
const formState = shallowReactive<TaskFormState>({
  title: '',
  description: '',
  assignee: taskAssigneeList[0].value,
  startDate: getDefaultStartDate(),
  dueDate: getDefaultDueDate(),
  estimatedHours: null,
  module: '',
  tags: [],
  acceptanceCriteria: '',
  priority: 'medium',
  status: 1,
})

const filterStatusOptions = [
  { label: '全部状态', value: 'all' },
  ...taskStatusSelectOptions,
]

const typeOptions: TaskViewOption[] = [
  {
    label: '卡片',
    value: 'card',
    component: CardTask,
  },
  {
    label: '表格',
    value: 'table',
    component: TableTask,
  },
  {
    label: '甘特图',
    value: 'gantt',
    component: GanttTask,
  },
]

const filteredTasks = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return tasks.value.filter((item) => {
    const assigneeMeta = getTaskAssigneeMeta(item.assignee)
    const priorityMeta = getTaskPriorityMeta(item.priority)
    const matchKeyword =
      !text ||
      item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      assigneeMeta.label.toLowerCase().includes(text) ||
      priorityMeta.label.toLowerCase().includes(text) ||
      item.module?.toLowerCase().includes(text) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(text))
    const matchStatus =
      statusFilter.value === 'all' || item.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const visibleTasks = computed({
  get() {
    return filteredTasks.value
  },
  set(value: Task[]) {
    const visibleIds = new Set(filteredTasks.value.map((item) => item.id))
    if (visibleIds.size === tasks.value.length) {
      tasks.value = [...value]
      return
    }

    let visibleInserted = false
    const nextTasks: Task[] = []
    for (const item of tasks.value) {
      if (!visibleIds.has(item.id)) {
        nextTasks.push(item)
        continue
      }

      if (!visibleInserted) {
        nextTasks.push(...value)
        visibleInserted = true
      }
    }

    if (!visibleInserted) {
      nextTasks.push(...value)
    }

    tasks.value = nextTasks
  },
})

const component = computed(() => {
  return (
    typeOptions.find((item) => item.value === type.value)?.component ?? CardTask
  )
})

function getDefaultStartDate() {
  return dayjs().format(taskDateTimeFormat)
}

function getDefaultDueDate() {
  return dayjs()
    .add(3, 'day')
    .hour(18)
    .minute(0)
    .second(0)
    .format(taskDateTimeFormat)
}

function normalizeTags(tags: string[]) {
  return [...new Set(tags.map((item) => item.trim()).filter(Boolean))]
}

function resetForm(status: TaskStatusValue = 1) {
  formState.title = ''
  formState.description = ''
  formState.assignee = taskAssigneeList[0].value
  formState.startDate = getDefaultStartDate()
  formState.dueDate = getDefaultDueDate()
  formState.estimatedHours = null
  formState.module = ''
  formState.tags = []
  formState.acceptanceCriteria = ''
  formState.priority = 'medium'
  formState.status = status
  formRef.value?.clearValidate()
}

function openCreateModal() {
  editingTask.value = null
  resetForm(statusFilter.value === 'all' ? 1 : statusFilter.value)
  modalOpen.value = true
}

function openEditModal(task: Task) {
  editingTask.value = task
  formState.title = task.title
  formState.description = task.description
  formState.assignee = task.assignee
  formState.startDate = task.startDate ?? null
  formState.dueDate = task.dueDate
  formState.estimatedHours = task.estimatedHours ?? null
  formState.module = task.module ?? ''
  formState.tags = [...(task.tags ?? [])]
  formState.acceptanceCriteria = task.acceptanceCriteria ?? ''
  formState.priority = task.priority
  formState.status = task.status
  formRef.value?.clearValidate()
  modalOpen.value = true
}

function createTaskId() {
  return Math.max(0, ...tasks.value.map((item) => item.id)) + 1
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  const task: Task = {
    id: editingTask.value?.id ?? createTaskId(),
    title: formState.title.trim(),
    description: formState.description.trim(),
    assignee: formState.assignee,
    priority: formState.priority,
    startDate: formState.startDate ?? undefined,
    dueDate: formState.dueDate ?? '',
    estimatedHours: formState.estimatedHours ?? undefined,
    module: formState.module.trim() || undefined,
    tags: normalizeTags(formState.tags),
    acceptanceCriteria: formState.acceptanceCriteria.trim() || undefined,
    status: formState.status,
    createTime:
      editingTask.value?.createTime ?? dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  if (editingTask.value) {
    tasks.value = tasks.value.map((item) => {
      return item.id === task.id ? task : item
    })
    message.success('任务已更新')
  } else {
    tasks.value = [task, ...tasks.value]
    message.success('任务已添加')
  }

  modalOpen.value = false
}

function confirmDeleteTask(task: Task) {
  Modal.confirm({
    title: '删除任务',
    content: `确定删除「${task.title}」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      tasks.value = tasks.value.filter((item) => item.id !== task.id)
      message.success('任务已删除')
    },
  })
}
</script>
