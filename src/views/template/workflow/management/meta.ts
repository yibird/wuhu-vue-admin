import type {
  WorkflowAlertSeverity,
  WorkflowDefinitionStatus,
  WorkflowRunStatus,
  WorkflowStepStatus,
} from './types'

interface StatusMeta {
  label: string
  color: string
  icon: string
}

export const workflowDefinitionStatusMeta: Record<
  WorkflowDefinitionStatus,
  StatusMeta
> = {
  published: {
    label: '已发布',
    color: 'success',
    icon: 'i-lucide:circle-check',
  },
  draft: {
    label: '草稿',
    color: 'warning',
    icon: 'i-lucide:file-pen-line',
  },
  disabled: {
    label: '已停用',
    color: 'default',
    icon: 'i-lucide:circle-pause',
  },
}

export const workflowRunStatusMeta: Record<WorkflowRunStatus, StatusMeta> = {
  running: {
    label: '运行中',
    color: 'processing',
    icon: 'i-lucide:loader-circle',
  },
  success: {
    label: '成功',
    color: 'success',
    icon: 'i-lucide:circle-check',
  },
  failed: {
    label: '失败',
    color: 'error',
    icon: 'i-lucide:circle-x',
  },
  suspended: {
    label: '等待中',
    color: 'warning',
    icon: 'i-lucide:circle-pause',
  },
  terminated: {
    label: '已终止',
    color: 'default',
    icon: 'i-lucide:octagon-x',
  },
}

export const workflowStepStatusMeta: Record<WorkflowStepStatus, StatusMeta> = {
  running: workflowRunStatusMeta.running,
  success: workflowRunStatusMeta.success,
  failed: workflowRunStatusMeta.failed,
  pending: {
    label: '等待执行',
    color: 'default',
    icon: 'i-lucide:clock-3',
  },
  skipped: {
    label: '已跳过',
    color: 'default',
    icon: 'i-lucide:skip-forward',
  },
}

export const workflowAlertSeverityMeta: Record<
  WorkflowAlertSeverity,
  StatusMeta
> = {
  critical: {
    label: '严重',
    color: 'error',
    icon: 'i-lucide:circle-alert',
  },
  warning: {
    label: '警告',
    color: 'warning',
    icon: 'i-lucide:triangle-alert',
  },
  info: {
    label: '提示',
    color: 'processing',
    icon: 'i-lucide:info',
  },
}
