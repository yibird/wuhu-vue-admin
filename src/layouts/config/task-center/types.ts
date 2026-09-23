export type TaskCenterStatus =
  | 'running'
  | 'waiting'
  | 'paused'
  | 'success'
  | 'failed'
  | 'canceled'

export type TaskCenterType =
  | 'download'
  | 'export'
  | 'import'
  | 'sync'
  | 'backup'

export type TaskCenterStatusFilter = TaskCenterStatus | 'all'
export type TaskCenterTypeFilter = TaskCenterType | 'all'
export type TaskCenterTimeFilter = 'all' | 'today' | 'week'

export interface TaskCenterItem {
  id: string
  title: string
  description: string
  type: TaskCenterType
  status: TaskCenterStatus
  progress: number
  owner: string
  source: string
  target: string
  size: string
  speed: string
  createdAt: string
  updatedAt: string
  logs: string[]
}

export interface TaskCenterFormState {
  title: string
  description: string
  type: TaskCenterType
  owner: string
  source: string
  target: string
}

export interface TaskCenterOption<T extends string = string> {
  label: string
  value: T
}

export interface TaskCenterStat {
  key: string
  label: string
  value: number
  icon: string
  class: string
}
