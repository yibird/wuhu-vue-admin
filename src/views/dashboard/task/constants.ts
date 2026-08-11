import dayjs from 'dayjs'
import type {
  CardTaskStatus,
  Task,
  TaskAssigneeMeta,
  TaskDueMeta,
  TaskPriorityMeta,
  TaskPriorityValue,
  TaskStatusValue,
} from './components'

export const taskDateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

export const taskStatusList: CardTaskStatus[] = [
  {
    text: '进行中',
    status: 1,
    color: '#1677ff',
    textColor: '#fff',
  },
  {
    text: '已完成',
    status: 2,
    color: '#52c41a',
    textColor: '#fff',
  },
  {
    text: '已暂停',
    status: 3,
    color: '#faad14',
    textColor: '#fff',
  },
  {
    text: '已过期',
    status: 4,
    color: '#ff4d4f',
    textColor: '#fff',
  },
]

export const taskStatusSelectOptions = taskStatusList.map((item) => ({
  label: item.text,
  value: item.status,
}))

export const taskPriorityList: TaskPriorityMeta[] = [
  {
    label: '紧急',
    value: 'urgent',
    color: 'red',
    icon: 'i-lucide:flame',
    weight: 4,
  },
  {
    label: '高',
    value: 'high',
    color: 'orange',
    icon: 'i-lucide:arrow-up',
    weight: 3,
  },
  {
    label: '中',
    value: 'medium',
    color: 'blue',
    icon: 'i-lucide:minus',
    weight: 2,
  },
  {
    label: '低',
    value: 'low',
    color: 'green',
    icon: 'i-lucide:arrow-down',
    weight: 1,
  },
]

export const taskPrioritySelectOptions = taskPriorityList.map((item) => ({
  label: item.label,
  value: item.value,
}))

export const taskAssigneeList: TaskAssigneeMeta[] = [
  {
    label: '吴彦祖',
    value: 'wuyanzu',
    role: '产品负责人',
    department: '产品体验部',
    email: 'wuyanzu@example.com',
    avatarClass: 'icon-primary-soft',
  },
  {
    label: '林更新',
    value: 'lingengxin',
    role: '前端开发',
    department: '研发中心',
    email: 'lingengxin@example.com',
    avatarClass: 'bg-success-tint text-success',
  },
  {
    label: '高圆圆',
    value: 'gaoyuanyuan',
    role: '体验设计',
    department: '设计中心',
    email: 'gaoyuanyuan@example.com',
    avatarClass: 'bg-warning-tint text-warning',
  },
  {
    label: '周星驰',
    value: 'zhouxingchi',
    role: '测试负责人',
    department: '质量保障部',
    email: 'zhouxingchi@example.com',
    avatarClass: 'bg-info-tint text-info',
  },
]

export const taskAssigneeSelectOptions = taskAssigneeList.map((item) => ({
  label: item.label,
  role: item.role,
  department: item.department,
  email: item.email,
  value: item.value,
  avatarClass: item.avatarClass,
}))

export function getTaskStatusMeta(status: TaskStatusValue) {
  return (
    taskStatusList.find((item) => item.status === status) ?? taskStatusList[0]
  )
}

export function getTaskPriorityMeta(priority: TaskPriorityValue) {
  return (
    taskPriorityList.find((item) => item.value === priority) ??
    taskPriorityList[2]
  )
}

export function getTaskAssigneeMeta(assignee: string) {
  return (
    taskAssigneeList.find((item) => item.value === assignee) ??
    taskAssigneeList[0]
  )
}

export function getTaskDueMeta(
  dueDate: string,
  status: TaskStatusValue = 1
): TaskDueMeta {
  const date = dayjs(dueDate)
  if (!date.isValid()) {
    return {
      text: dueDate || '-',
      fullText: dueDate || '-',
      class: 'text-secondary',
      icon: 'i-lucide:calendar',
      tone: 'default',
    }
  }

  if (status === 2) {
    return {
      text: date.format('MM-DD HH:mm'),
      fullText: date.format(taskDateTimeFormat),
      class: 'text-success',
      icon: 'i-lucide:calendar-check',
      tone: 'success',
    }
  }

  const diffDays = date.startOf('day').diff(dayjs().startOf('day'), 'day')
  if (diffDays < 0) {
    return {
      text: date.format('MM-DD HH:mm'),
      fullText: date.format(taskDateTimeFormat),
      class: 'text-error',
      icon: 'i-lucide:calendar-x',
      tone: 'error',
    }
  }

  if (diffDays <= 2) {
    return {
      text: date.format('MM-DD HH:mm'),
      fullText: date.format(taskDateTimeFormat),
      class: 'text-warning',
      icon: 'i-lucide:calendar-clock',
      tone: 'warning',
    }
  }

  return {
    text: date.format('MM-DD HH:mm'),
    fullText: date.format(taskDateTimeFormat),
    class: 'text-secondary',
    icon: 'i-lucide:calendar-days',
    tone: 'default',
  }
}

export function sortTasksByStatus(items: Task[]) {
  return taskStatusList.flatMap((status) => {
    return items
      .filter((item) => item.status === status.status)
      .sort((a, b) => {
        return (
          getTaskPriorityMeta(b.priority).weight -
            getTaskPriorityMeta(a.priority).weight ||
          dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf()
        )
      })
  })
}
