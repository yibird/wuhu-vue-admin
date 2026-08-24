import { computed, ref, shallowRef, watch } from 'vue'
import { refDebounced, useClipboard, useIntervalFn } from '@vueuse/core'
import { message, Modal } from 'antdv-next'
import dayjs from 'dayjs'
import type { Ref } from 'vue'
import {
  finishedTaskStatuses,
  ownerOptions,
  taskStatusMeta,
  taskTypeMeta,
} from '../constants'
import { initialTaskCenterItems } from '../data'
import type {
  TaskCenterFormState,
  TaskCenterItem,
  TaskCenterStat,
  TaskCenterStatus,
  TaskCenterStatusFilter,
  TaskCenterTimeFilter,
  TaskCenterTypeFilter,
} from '../types'

const finishedStatusSet = new Set<TaskCenterStatus>(finishedTaskStatuses)

function createDefaultFormState(): TaskCenterFormState {
  return {
    title: '',
    description: '',
    type: 'export',
    owner: ownerOptions[0].value,
    source: '',
    target: '',
  }
}

function createTaskId() {
  return `task-${Date.now()}`
}

function toSearchText(task: TaskCenterItem) {
  return [
    task.title,
    task.description,
    task.owner,
    task.source,
    task.target,
    taskTypeMeta[task.type].label,
    taskStatusMeta[task.status].label,
  ]
    .join(' ')
    .toLowerCase()
}

function isCreatedInRange(task: TaskCenterItem, range: TaskCenterTimeFilter) {
  if (range === 'all') return true

  const createdAt = dayjs(task.createdAt)
  if (range === 'today') return createdAt.isSame(dayjs(), 'day')

  return createdAt.isAfter(dayjs().subtract(7, 'day'), 'day')
}

export function useTaskCenter(open: Readonly<Ref<boolean>>) {
  const tasks = shallowRef<TaskCenterItem[]>(
    initialTaskCenterItems.map((item) => ({ ...item, logs: [...item.logs] }))
  )
  const keyword = shallowRef('')
  const debouncedKeyword = refDebounced(keyword, 160)
  const statusFilter = shallowRef<TaskCenterStatusFilter>('all')
  const typeFilter = shallowRef<TaskCenterTypeFilter>('all')
  const timeFilter = shallowRef<TaskCenterTimeFilter>('all')
  const activeTaskId = shallowRef(tasks.value[0]?.id ?? '')
  const createModalOpen = shallowRef(false)
  const formState = ref<TaskCenterFormState>(createDefaultFormState())
  const { copy, isSupported: isClipboardSupported } = useClipboard({
    legacy: true,
  })

  const filteredTasks = computed(() => {
    const text = debouncedKeyword.value.trim().toLowerCase()

    return tasks.value.filter((task) => {
      const matchKeyword = !text || toSearchText(task).includes(text)
      const matchStatus =
        statusFilter.value === 'all' || task.status === statusFilter.value
      const matchType =
        typeFilter.value === 'all' || task.type === typeFilter.value
      const matchTime = isCreatedInRange(task, timeFilter.value)

      return matchKeyword && matchStatus && matchType && matchTime
    })
  })

  const activeTask = computed(() => {
    return (
      tasks.value.find((task) => task.id === activeTaskId.value) ??
      filteredTasks.value[0] ??
      null
    )
  })

  const runningCount = computed(
    () => tasks.value.filter((task) => task.status === 'running').length
  )
  const waitingCount = computed(
    () => tasks.value.filter((task) => task.status === 'waiting').length
  )
  const failedCount = computed(
    () => tasks.value.filter((task) => task.status === 'failed').length
  )
  const finishedCount = computed(
    () =>
      tasks.value.filter((task) => finishedStatusSet.has(task.status)).length
  )

  const stats = computed<TaskCenterStat[]>(() => [
    {
      key: 'total',
      label: '全部任务',
      value: tasks.value.length,
      icon: 'i-lucide:list-checks',
      class: 'text-primary bg-primary-tint',
    },
    {
      key: 'running',
      label: '进行中',
      value: runningCount.value,
      icon: 'i-lucide:loader-circle',
      class: 'text-primary bg-primary-tint',
    },
    {
      key: 'waiting',
      label: '等待中',
      value: waitingCount.value,
      icon: 'i-lucide:clock-3',
      class: 'text-warning bg-warning-tint',
    },
    {
      key: 'failed',
      label: '异常任务',
      value: failedCount.value,
      icon: 'i-lucide:circle-alert',
      class: 'text-error bg-error-tint',
    },
  ])

  const hasFinishedTasks = computed(() => finishedCount.value > 0)

  const progressTimer = useIntervalFn(
    () => {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      let changed = false

      const nextTasks = tasks.value.map((task): TaskCenterItem => {
        if (task.status !== 'running') return task

        const progress = Math.min(
          100,
          task.progress + 4 + Math.round(Math.random() * 7)
        )
        changed = true

        if (progress >= 100) {
          return {
            ...task,
            progress,
            status: 'success',
            speed: '已完成',
            updatedAt: now,
            logs: [...task.logs, '任务执行完成，结果已生成。'],
          }
        }

        return {
          ...task,
          progress,
          speed: `${(3.6 + Math.random() * 2.4).toFixed(1)} MB/s`,
          updatedAt: now,
        }
      })

      if (changed) {
        tasks.value = nextTasks
      }
    },
    1800,
    { immediate: false }
  )

  watch(
    open,
    (isOpen) => {
      if (isOpen) {
        progressTimer.resume()
      } else {
        progressTimer.pause()
      }
    },
    { immediate: true }
  )

  watch(filteredTasks, (items) => {
    if (!items.length) {
      activeTaskId.value = ''
      return
    }

    if (!items.some((item) => item.id === activeTaskId.value)) {
      activeTaskId.value = items[0].id
    }
  })

  function patchTask(
    taskId: string,
    updater: (task: TaskCenterItem) => TaskCenterItem
  ) {
    tasks.value = tasks.value.map((task) => {
      return task.id === taskId ? updater(task) : task
    })
  }

  function appendLog(task: TaskCenterItem, log: string) {
    return {
      ...task,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      logs: [...task.logs, log],
    }
  }

  function selectTask(taskId: string) {
    activeTaskId.value = taskId
  }

  function resetFilters() {
    keyword.value = ''
    statusFilter.value = 'all'
    typeFilter.value = 'all'
    timeFilter.value = 'all'
  }

  function openCreateModal() {
    formState.value = createDefaultFormState()
    createModalOpen.value = true
  }

  function createTask() {
    const title = formState.value.title.trim()
    const description = formState.value.description.trim()
    const source = formState.value.source.trim()
    const target = formState.value.target.trim()

    if (!title || !description || !source || !target) {
      message.warning('请完整填写任务名称、描述、来源和目标')
      return false
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const task: TaskCenterItem = {
      id: createTaskId(),
      title,
      description,
      type: formState.value.type,
      status: 'waiting',
      progress: 0,
      owner: formState.value.owner,
      source,
      target,
      size: '待计算',
      speed: '等待资源',
      createdAt: now,
      updatedAt: now,
      logs: ['任务已创建，等待调度。'],
    }

    resetFilters()
    tasks.value = [task, ...tasks.value]
    activeTaskId.value = task.id
    createModalOpen.value = false
    message.success('任务已创建')
    return true
  }

  function pauseTask(task: TaskCenterItem) {
    if (task.status !== 'running') return

    patchTask(task.id, (item) => ({
      ...appendLog(item, '用户暂停了任务。'),
      status: 'paused',
      speed: '已暂停',
    }))
    message.success('任务已暂停')
  }

  function resumeTask(task: TaskCenterItem) {
    if (task.status !== 'paused' && task.status !== 'waiting') return

    patchTask(task.id, (item) => ({
      ...appendLog(item, '任务已恢复执行。'),
      status: 'running',
      speed: '准备中',
    }))
    message.success('任务已恢复')
  }

  function retryTask(task: TaskCenterItem) {
    if (task.status !== 'failed' && task.status !== 'canceled') return

    patchTask(task.id, (item) => ({
      ...appendLog(item, '用户重新提交任务。'),
      status: 'running',
      progress: Math.min(item.progress, 18),
      speed: '准备中',
    }))
    message.success('任务已重新提交')
  }

  function cancelTask(task: TaskCenterItem) {
    if (finishedStatusSet.has(task.status)) return

    Modal.confirm({
      title: '取消任务',
      content: `确定取消「${task.title}」吗？`,
      okText: '取消任务',
      okType: 'danger',
      cancelText: '返回',
      onOk: () => {
        patchTask(task.id, (item) => ({
          ...appendLog(item, '用户取消了任务。'),
          status: 'canceled',
          speed: '已取消',
        }))
        message.success('任务已取消')
      },
    })
  }

  function deleteTask(task: TaskCenterItem) {
    Modal.confirm({
      title: '删除任务',
      content: `确定删除「${task.title}」的记录吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        tasks.value = tasks.value.filter((item) => item.id !== task.id)
        message.success('任务记录已删除')
      },
    })
  }

  function clearFinishedTasks() {
    if (!hasFinishedTasks.value) return

    Modal.confirm({
      title: '清空已结束任务',
      content: '会删除已完成、失败和已取消的任务记录，进行中的任务不会受影响。',
      okText: '清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        tasks.value = tasks.value.filter(
          (task) => !finishedStatusSet.has(task.status)
        )
        message.success('已清空已结束任务')
      },
    })
  }

  async function copyTaskInfo(task: TaskCenterItem) {
    if (!isClipboardSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }

    await copy(
      [
        `任务：${task.title}`,
        `状态：${taskStatusMeta[task.status].label}`,
        `类型：${taskTypeMeta[task.type].label}`,
        `进度：${task.progress}%`,
        `来源：${task.source}`,
        `目标：${task.target}`,
      ].join('\n')
    )
    message.success('任务信息已复制')
  }

  return {
    activeTask,
    activeTaskId,
    clearFinishedTasks,
    copyTaskInfo,
    createModalOpen,
    createTask,
    deleteTask,
    filteredTasks,
    formState,
    hasFinishedTasks,
    keyword,
    openCreateModal,
    pauseTask,
    resetFilters,
    resumeTask,
    retryTask,
    selectTask,
    statusFilter,
    stats,
    tasks,
    timeFilter,
    typeFilter,
    cancelTask,
  }
}
