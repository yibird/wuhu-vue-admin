import type {
  TaskCenterOption,
  TaskCenterStatus,
  TaskCenterStatusFilter,
  TaskCenterTimeFilter,
  TaskCenterType,
  TaskCenterTypeFilter,
} from './types'

interface TaskCenterMeta {
  label: string
  icon: string
  color: string
  class: string
}

export const taskTypeOptions: TaskCenterOption<TaskCenterType>[] = [
  { label: '文件下载', value: 'download' },
  { label: '数据导出', value: 'export' },
  { label: '批量导入', value: 'import' },
  { label: '数据同步', value: 'sync' },
  { label: '系统备份', value: 'backup' },
]

export const taskTypeFilterOptions: TaskCenterOption<TaskCenterTypeFilter>[] = [
  { label: '全部类型', value: 'all' },
  ...taskTypeOptions,
]

export const taskStatusFilterOptions: TaskCenterOption<TaskCenterStatusFilter>[] =
  [
    { label: '全部状态', value: 'all' },
    { label: '进行中', value: 'running' },
    { label: '等待中', value: 'waiting' },
    { label: '已暂停', value: 'paused' },
    { label: '已完成', value: 'success' },
    { label: '失败', value: 'failed' },
    { label: '已取消', value: 'canceled' },
  ]

export const taskTimeFilterOptions: TaskCenterOption<TaskCenterTimeFilter>[] = [
  { label: '全部时间', value: 'all' },
  { label: '今天创建', value: 'today' },
  { label: '本周创建', value: 'week' },
]

export const ownerOptions: TaskCenterOption[] = [
  { label: '系统服务', value: '系统服务' },
  { label: '运营组', value: '运营组' },
  { label: '财务组', value: '财务组' },
  { label: '研发组', value: '研发组' },
]

export const taskStatusMeta: Record<TaskCenterStatus, TaskCenterMeta> = {
  running: {
    label: '进行中',
    icon: 'i-lucide:loader-circle',
    color: 'processing',
    class: 'text-primary bg-primary-tint border-color-primary',
  },
  waiting: {
    label: '等待中',
    icon: 'i-lucide:clock-3',
    color: 'default',
    class: 'text-secondary bg-secondary border-color-2',
  },
  paused: {
    label: '已暂停',
    icon: 'i-lucide:pause',
    color: 'warning',
    class: 'text-warning bg-warning-tint border-color-warning',
  },
  success: {
    label: '已完成',
    icon: 'i-lucide:circle-check',
    color: 'success',
    class: 'text-success bg-success-tint border-color-success',
  },
  failed: {
    label: '失败',
    icon: 'i-lucide:circle-alert',
    color: 'error',
    class: 'text-error bg-error-tint border-color-error',
  },
  canceled: {
    label: '已取消',
    icon: 'i-lucide:circle-slash',
    color: 'default',
    class: 'text-secondary bg-fill-quaternary border-color-2',
  },
}

export const taskTypeMeta: Record<TaskCenterType, TaskCenterMeta> = {
  download: {
    label: '文件下载',
    icon: 'i-lucide:download',
    color: 'blue',
    class: 'text-primary bg-primary-tint border-color-primary',
  },
  export: {
    label: '数据导出',
    icon: 'i-lucide:file-down',
    color: 'cyan',
    class: 'text-info bg-info-tint border-color-info',
  },
  import: {
    label: '批量导入',
    icon: 'i-lucide:file-up',
    color: 'green',
    class: 'text-success bg-success-tint border-color-success',
  },
  sync: {
    label: '数据同步',
    icon: 'i-lucide:refresh-cw',
    color: 'purple',
    class: 'text-primary bg-primary-tint border-color-primary',
  },
  backup: {
    label: '系统备份',
    icon: 'i-lucide:database-backup',
    color: 'orange',
    class: 'text-warning bg-warning-tint border-color-warning',
  },
}

export const finishedTaskStatuses = [
  'success',
  'failed',
  'canceled',
] satisfies TaskCenterStatus[]
