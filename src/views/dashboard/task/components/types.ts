export type TaskStatusValue = 1 | 2 | 3 | 4
export type TaskPriorityValue = 'urgent' | 'high' | 'medium' | 'low'
export type TaskDueTone = 'success' | 'warning' | 'error' | 'default'
export type TaskViewType = 'card' | 'table' | 'gantt'
export type TaskFilterStatus = TaskStatusValue | 'all'

export interface TaskViewOption {
  label: string
  value: TaskViewType
}

export interface Task {
  id: number
  title: string
  description: string
  assignee: string
  priority: TaskPriorityValue
  dueDate: string
  startDate?: string
  estimatedHours?: number
  module?: string
  tags?: string[]
  acceptanceCriteria?: string
  progress?: number
  // 1: 进行中 2: 已完成 3: 已暂停 4: 已过期
  status: TaskStatusValue
  createTime: string
}

export interface TaskFormState {
  title: string
  description: string
  assignee: string
  startDate: string | null
  dueDate: string | null
  estimatedHours: number | null
  module: string
  tags: string[]
  acceptanceCriteria: string
  priority: TaskPriorityValue
  status: TaskStatusValue
}

export interface TaskProps {
  items?: Task[]
  loading?: boolean
}

export interface CardTaskStatus {
  text: string
  status: TaskStatusValue
  color: string
  textColor?: string
}

export interface TaskPriorityMeta {
  label: string
  value: TaskPriorityValue
  color: string
  icon: string
  weight: number
}

export interface TaskAssigneeMeta {
  label: string
  value: string
  role: string
  department?: string
  email?: string
  avatarClass: string
}

export interface TaskDueMeta {
  text: string
  fullText: string
  class: string
  icon: string
  tone: TaskDueTone
}

export interface CardTaskGroupProps extends CardTaskStatus {
  items: Task[]
}

export interface CardTaskItemProps {
  item: Task
}

export type TaskActionEmits = {
  edit: [task: Task]
  delete: [task: Task]
}
