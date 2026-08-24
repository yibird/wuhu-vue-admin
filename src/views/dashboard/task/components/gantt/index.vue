<script lang="ts" setup>
import dayjs from 'dayjs'
import { message } from 'antdv-next'
import {
  Gantt,
  type GanttContextMenuEvent,
  type GanttTask,
  type GanttViewMode,
} from '@/components/gantt'
import type { FrappeGanttOptions } from 'frappe-gantt'
import { sortTasksByStatus, taskDateTimeFormat } from '../../constants'
import type { Task, TaskActionEmits } from '../types'
import ContextMenu from './ContextMenu.vue'
import List from './List.vue'
import GanttSkeleton from './Skeleton.vue'
import { useTaskGanttContextMenu } from './useTaskGanttContextMenu'
import {
  createTaskId,
  getGanttTaskId,
  getTaskDateRange,
  getTaskIdFromGanttId,
  normalizeProgress,
  shiftTaskDate,
  statusClassName,
  taskProgress,
} from './utils'

const emit = defineEmits<TaskActionEmits>()
const { loading = false } = defineProps<{ loading?: boolean }>()
const items = defineModel<Task[]>('items', { default: () => [] })

const viewMode = shallowRef<GanttViewMode>('Month')
const selectedTaskId = shallowRef<number | null>(null)
const ganttCommitIdleDelay = 240
let scheduleCommitTimer: number | null = null
let pendingDateChange: {
  readonly taskId: number
  readonly start: Date
  readonly end: Date
} | null = null
let pendingProgressChange: {
  readonly taskId: number
  readonly progress: number
} | null = null

const viewModeOptions = [
  { label: '周', value: 'Week' },
  { label: '月', value: 'Month' },
  { label: '年', value: 'Year' },
]

const ganttOptions: FrappeGanttOptions = {
  bar_height: 28,
  padding: 18,
  popup: false,
  scroll_to: 'start',
  view_modes: ['Week', 'Month', 'Year'],
}

const sortedItems = computed(() => {
  return sortTasksByStatus(items.value)
})

const {
  closeContextMenu,
  contextMenuOpen,
  contextMenuPosition,
  contextMenuTask,
  openContextMenu,
} = useTaskGanttContextMenu((task) => getTaskByGanttId(task.id))

const ganttTasks = computed<GanttTask[]>(() => {
  return sortedItems.value.map((item) => {
    const range = getTaskDateRange(item)
    return {
      id: getGanttTaskId(item),
      name: item.title,
      description: item.description,
      start: range.start,
      end: range.end,
      progress: taskProgress(item),
      dependencies: [],
      custom_class: `w-gantt-status-${statusClassName(item.status)}`,
      rawId: item.id,
    }
  })
})

watch(
  sortedItems,
  (items) => {
    if (items.length === 0) {
      selectedTaskId.value = null
      return
    }

    if (!items.some((item) => item.id === selectedTaskId.value)) {
      selectedTaskId.value = items[0].id
    }
  },
  { immediate: true }
)

function getTaskByGanttId(id: string) {
  const rawId = getTaskIdFromGanttId(id)
  return sortedItems.value.find((item) => item.id === rawId) ?? null
}

function updateTaskById(taskId: number, updater: (task: Task) => Task) {
  items.value = items.value.map((item) => {
    return item.id === taskId ? updater(item) : item
  })
}

function handleGanttClick(task: GanttTask) {
  const current = getTaskByGanttId(task.id)
  selectedTaskId.value = current?.id ?? null
}

function handleGanttDoubleClick(task: GanttTask) {
  const current = getTaskByGanttId(task.id)
  if (current) {
    emit('edit', current)
  }
}

function clearScheduleCommitTimer() {
  if (scheduleCommitTimer === null) return
  window.clearTimeout(scheduleCommitTimer)
  scheduleCommitTimer = null
}

function scheduleGanttCommit() {
  clearScheduleCommitTimer()
  scheduleCommitTimer = window.setTimeout(() => {
    flushPendingGanttChange()
  }, ganttCommitIdleDelay)
}

function flushPendingGanttChange() {
  clearScheduleCommitTimer()
  const dateChange = pendingDateChange
  const progressChange = pendingProgressChange
  pendingDateChange = null
  pendingProgressChange = null

  if (!dateChange && !progressChange) return

  // frappe-gantt 拖动时会高频触发变更事件，这里只在释放/空闲后合并写回，避免整图反复刷新。
  items.value = items.value.map((item) => {
    let nextItem = item

    if (dateChange?.taskId === item.id) {
      nextItem = {
        ...nextItem,
        startDate: dayjs(dateChange.start)
          .hour(9)
          .minute(0)
          .second(0)
          .format(taskDateTimeFormat),
        dueDate: dayjs(dateChange.end)
          .hour(18)
          .minute(0)
          .second(0)
          .format(taskDateTimeFormat),
      }
    }

    if (progressChange?.taskId === item.id) {
      nextItem = {
        ...nextItem,
        progress: progressChange.progress,
        status:
          progressChange.progress >= 100
            ? 2
            : nextItem.status === 2
              ? 1
              : nextItem.status,
      }
    }

    return nextItem
  })
}

function handleGanttDateChange(task: GanttTask, start: Date, end: Date) {
  const taskId = getTaskIdFromGanttId(task.id)
  if (taskId === null) return

  selectedTaskId.value = taskId
  pendingDateChange = { taskId, start, end }
  scheduleGanttCommit()
}

function handleGanttProgressChange(task: GanttTask, progress: number) {
  const taskId = getTaskIdFromGanttId(task.id)
  if (taskId === null) return

  const nextProgress = normalizeProgress(progress)
  selectedTaskId.value = taskId
  pendingProgressChange = { taskId, progress: nextProgress }
  scheduleGanttCommit()
}

function handleGanttContextMenu(payload: GanttContextMenuEvent) {
  const current = openContextMenu(payload)
  if (!current) return

  selectedTaskId.value = current.id
}

function duplicateContextTask() {
  const task = contextMenuTask.value
  if (!task) return

  const duplicated: Task = {
    ...task,
    id: createTaskId(items.value),
    title: `${task.title} 副本`,
    dueDate: shiftTaskDate(task.dueDate, 1),
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  if (task.startDate) {
    duplicated.startDate = shiftTaskDate(task.startDate, 1)
  }

  items.value = [duplicated, ...items.value]
  selectedTaskId.value = duplicated.id
  closeContextMenu()
  message.success('任务已复制')
}

function editContextTask() {
  const task = contextMenuTask.value
  closeContextMenu()
  if (task) {
    emit('edit', task)
  }
}

function markContextTaskDone() {
  const task = contextMenuTask.value
  if (!task) return

  updateTaskById(task.id, (item) => ({
    ...item,
    progress: 100,
    status: 2,
  }))
  closeContextMenu()
  message.success('任务已标记完成')
}

function deleteContextTask() {
  const task = contextMenuTask.value
  closeContextMenu()
  if (task) {
    emit('delete', task)
  }
}

onMounted(() => {
  window.addEventListener('mouseup', flushPendingGanttChange)
  window.addEventListener('touchend', flushPendingGanttChange, {
    passive: true,
  })
  window.addEventListener('touchcancel', flushPendingGanttChange, {
    passive: true,
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', flushPendingGanttChange)
  window.removeEventListener('touchend', flushPendingGanttChange)
  window.removeEventListener('touchcancel', flushPendingGanttChange)
  clearScheduleCommitTimer()
  pendingDateChange = null
  pendingProgressChange = null
})
</script>

<template>
  <GanttSkeleton v-if="loading" />
  <div v-else class="h-full min-h-0 min-w-0 flex flex-col gap-12">
    <div
      class="flex flex-wrap items-center justify-between gap-10 rounded-4 bg-container p-12"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-8 font-600 text-main">
          <Icon name="i-lucide:chart-no-axes-gantt" />
          甘特图
        </div>
        <div class="mt-3 text-xs text-secondary">
          共
          {{ ganttTasks.length }} 个任务，拖拽任务条可调整排期，右键查看更多操作
        </div>
      </div>

      <a-radio-group v-model:value="viewMode" size="small">
        <a-radio-button
          v-for="item in viewModeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </div>

    <div class="min-h-320 min-w-0 flex-1 overflow-hidden">
      <Gantt
        class="h-full min-h-0"
        :tasks="ganttTasks"
        :view-mode="viewMode"
        :options="ganttOptions"
        empty-text="暂无任务甘特图"
        @click="handleGanttClick"
        @context-menu="handleGanttContextMenu"
        @date-change="handleGanttDateChange"
        @double-click="handleGanttDoubleClick"
        @progress-change="handleGanttProgressChange"
      />
    </div>

    <List
      :items="sortedItems"
      :selected-task-id="selectedTaskId"
      @delete="emit('delete', $event)"
      @edit="emit('edit', $event)"
      @select="selectedTaskId = $event"
    />

    <ContextMenu
      :open="contextMenuOpen"
      :position="contextMenuPosition"
      :task="contextMenuTask"
      @delete="deleteContextTask"
      @duplicate="duplicateContextTask"
      @edit="editContextTask"
      @mark-done="markContextTaskDone"
    />
  </div>
</template>
