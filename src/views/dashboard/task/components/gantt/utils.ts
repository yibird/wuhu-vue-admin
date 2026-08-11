import dayjs from 'dayjs'
import { taskDateTimeFormat } from '../../constants'
import type { Task, TaskStatusValue } from '../types'

export interface TaskGanttMenuPosition {
  readonly x: number
  readonly y: number
}

export function getGanttTaskId(task: Task) {
  return `task-${task.id}`
}

export function getTaskIdFromGanttId(id: string) {
  const rawId = Number(id.replace(/^task-/, ''))
  return Number.isFinite(rawId) ? rawId : null
}

export function getTaskDateRange(task: Task) {
  const dueDate = dayjs(task.dueDate)
  const fallbackEnd = dayjs().add(7, 'day')
  const end = (dueDate.isValid() ? dueDate : fallbackEnd).startOf('day')
  const createDate = dayjs(task.startDate ?? task.createTime)
  const fallbackDays = getFallbackDurationDays(task.status)
  const start = (
    createDate.isValid() && createDate.isBefore(end)
      ? createDate
      : end.subtract(fallbackDays, 'day')
  ).startOf('day')

  return {
    start: start.format('YYYY-MM-DD'),
    end: end.isAfter(start)
      ? end.format('YYYY-MM-DD')
      : start.add(1, 'day').format('YYYY-MM-DD'),
  }
}

export function statusProgress(status: TaskStatusValue) {
  const progressMap: Record<TaskStatusValue, number> = {
    1: 55,
    2: 100,
    3: 35,
    4: 18,
  }
  return progressMap[status]
}

export function taskProgress(task: Task) {
  return typeof task.progress === 'number'
    ? normalizeProgress(task.progress)
    : statusProgress(task.status)
}

export function normalizeProgress(progress: number) {
  return Math.min(100, Math.max(0, Math.round(progress)))
}

export function statusClassName(status: TaskStatusValue) {
  const classMap: Record<TaskStatusValue, string> = {
    1: 'doing',
    2: 'done',
    3: 'paused',
    4: 'overdue',
  }
  return classMap[status]
}

export function statusBarClass(status: TaskStatusValue) {
  const classMap: Record<TaskStatusValue, string> = {
    1: 'bg-primary',
    2: 'bg-success',
    3: 'bg-warning',
    4: 'bg-error',
  }
  return classMap[status]
}

export function getContextMenuPosition(
  x: number,
  y: number
): TaskGanttMenuPosition {
  if (typeof window === 'undefined') return { x, y }

  const padding = 8
  const menuWidth = 188
  const menuHeight = 220
  const maxX = Math.max(padding, window.innerWidth - menuWidth - padding)
  const maxY = Math.max(padding, window.innerHeight - menuHeight - padding)

  return {
    x: Math.min(Math.max(padding, x), maxX),
    y: Math.min(Math.max(padding, y), maxY),
  }
}

export function createTaskId(items: Task[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}

export function shiftTaskDate(value: string, days: number) {
  const date = dayjs(value)
  return date.isValid()
    ? date.add(days, 'day').format(taskDateTimeFormat)
    : value
}

function getFallbackDurationDays(status: TaskStatusValue) {
  const durationMap: Record<TaskStatusValue, number> = {
    1: 8,
    2: 5,
    3: 10,
    4: 12,
  }
  return durationMap[status]
}
