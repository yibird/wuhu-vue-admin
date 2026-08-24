import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  shallowRef,
  watch,
} from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { message } from 'antdv-next'
import {
  initialWorkflowAlerts,
  initialWorkflowInstances,
} from '../../management/data'
import type {
  WorkflowRunInstance,
  WorkflowRunStatus,
} from '../../management/types'

export type WorkflowRunStatusFilter = WorkflowRunStatus | 'all'
export type WorkflowEnvironmentFilter =
  | WorkflowRunInstance['environment']
  | 'all'
export type WorkflowMonitorRange = '1h' | '24h' | '7d'

function formatRefreshTime() {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date())
}

export function useWorkflowMonitor() {
  const instances = shallowRef<WorkflowRunInstance[]>(
    initialWorkflowInstances.map((item) => ({
      ...item,
      steps: item.steps.map((step) => ({ ...step })),
    }))
  )
  const alerts = shallowRef(initialWorkflowAlerts.map((item) => ({ ...item })))
  const keyword = shallowRef('')
  const statusFilter = shallowRef<WorkflowRunStatusFilter>('all')
  const workflowFilter = shallowRef('all')
  const environmentFilter = shallowRef<WorkflowEnvironmentFilter>('all')
  const timeRange = shallowRef<WorkflowMonitorRange>('1h')
  const autoRefresh = shallowRef(true)
  const refreshing = shallowRef(false)
  const lastRefreshAt = shallowRef(formatRefreshTime())
  const selectedInstanceId = shallowRef<string>()
  const detailOpen = shallowRef(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const workflowOptions = computed(() => {
    const names = new Map<string, string>()
    instances.value.forEach((item) =>
      names.set(item.workflowId, item.workflowName)
    )
    return [...names].map(([value, label]) => ({ value, label }))
  })

  const filteredInstances = computed(() => {
    const text = keyword.value.trim().toLowerCase()
    return instances.value.filter((item) => {
      const matchesKeyword =
        !text ||
        [item.id, item.traceId, item.workflowName, item.initiator].some(
          (value) => value.toLowerCase().includes(text)
        )
      const matchesStatus =
        statusFilter.value === 'all' || item.status === statusFilter.value
      const matchesWorkflow =
        workflowFilter.value === 'all' ||
        item.workflowId === workflowFilter.value
      const matchesEnvironment =
        environmentFilter.value === 'all' ||
        item.environment === environmentFilter.value
      return (
        matchesKeyword && matchesStatus && matchesWorkflow && matchesEnvironment
      )
    })
  })

  const selectedInstance = computed(() =>
    instances.value.find((item) => item.id === selectedInstanceId.value)
  )
  const runningCount = computed(
    () => instances.value.filter((item) => item.status === 'running').length
  )
  const failureCount = computed(
    () => instances.value.filter((item) => item.status === 'failed').length
  )
  const completedInstances = computed(() =>
    instances.value.filter((item) =>
      ['failed', 'success'].includes(item.status)
    )
  )
  const successRate = computed(() => {
    if (!completedInstances.value.length) return 0
    const successCount = completedInstances.value.filter(
      (item) => item.status === 'success'
    ).length
    return Number(
      ((successCount / completedInstances.value.length) * 100).toFixed(1)
    )
  })
  const unresolvedAlerts = computed(() =>
    alerts.value.filter((item) => !item.acknowledged)
  )

  function advanceRunningInstances() {
    instances.value = instances.value.map((item) => {
      if (item.status !== 'running') return item
      const progress = Math.min(100, item.progress + 8)
      if (progress < 100) {
        const activeStepIndex = Math.min(
          item.steps.length - 1,
          Math.floor((progress / 100) * item.steps.length)
        )
        return {
          ...item,
          progress,
          currentNode: item.steps[activeStepIndex]?.name ?? item.currentNode,
          duration: `${(Number.parseFloat(item.duration) + 0.8).toFixed(1)}s`,
          steps: item.steps.map((step, index) => ({
            ...step,
            status:
              index < activeStepIndex
                ? 'success'
                : index === activeStepIndex
                  ? 'running'
                  : 'pending',
            duration:
              index < activeStepIndex
                ? step.duration === '-' || step.duration === '执行中'
                  ? '320ms'
                  : step.duration
                : index === activeStepIndex
                  ? '执行中'
                  : '-',
          })),
        }
      }
      return {
        ...item,
        status: 'success',
        progress: 100,
        currentNode: '完成',
        finishedAt: '刚刚',
        steps: item.steps.map((step) => ({
          ...step,
          status: 'success',
          duration: step.duration === '执行中' ? '2.5s' : step.duration,
        })),
      }
    })
  }

  function refresh(showFeedback = false) {
    if (refreshing.value) return
    refreshing.value = true
    refreshTimer = setTimeout(() => {
      advanceRunningInstances()
      lastRefreshAt.value = formatRefreshTime()
      refreshing.value = false
      refreshTimer = undefined
      if (showFeedback) message.success('监控数据已刷新')
    }, 360)
  }

  const { pause, resume } = useIntervalFn(() => refresh(false), 15_000, {
    immediate: true,
  })

  watch(autoRefresh, (enabled) => {
    if (enabled) resume()
    else pause()
  })

  onActivated(() => {
    if (autoRefresh.value) {
      resume()
      refresh(false)
    }
  })

  onDeactivated(pause)

  function openInstance(id: string) {
    const instance = instances.value.find((item) => item.id === id)
    if (!instance) {
      message.info('该历史实例已归档')
      return
    }
    selectedInstanceId.value = id
    detailOpen.value = true
  }

  function retryInstance(id: string) {
    instances.value = instances.value.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        status: 'running',
        progress: 8,
        currentNode: '接收触发事件',
        duration: '0.1s',
        finishedAt: undefined,
        retries: item.retries + 1,
        steps: item.steps.map((step, index) => ({
          ...step,
          status: index === 0 ? 'running' : 'pending',
          duration: index === 0 ? '执行中' : '-',
          detail:
            step.status === 'failed' ? '等待模型服务重新执行。' : step.detail,
        })),
      }
    })
    message.success('实例已重新进入执行队列')
  }

  function terminateInstance(id: string) {
    instances.value = instances.value.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        status: 'terminated',
        currentNode: '已终止',
        finishedAt: '刚刚',
        steps: item.steps.map((step) =>
          step.status === 'running'
            ? { ...step, status: 'failed', detail: '实例已由管理员终止。' }
            : step
        ),
      }
    })
    message.success('实例已终止')
  }

  function acknowledgeAlert(id: string) {
    alerts.value = alerts.value.map((item) =>
      item.id === id ? { ...item, acknowledged: true } : item
    )
    message.success('告警已确认')
  }

  onBeforeUnmount(() => {
    if (refreshTimer) clearTimeout(refreshTimer)
  })

  return {
    alerts,
    autoRefresh,
    detailOpen,
    environmentFilter,
    failureCount,
    filteredInstances,
    instances,
    keyword,
    lastRefreshAt,
    refreshing,
    runningCount,
    selectedInstance,
    statusFilter,
    successRate,
    timeRange,
    unresolvedAlerts,
    workflowFilter,
    workflowOptions,
    acknowledgeAlert,
    openInstance,
    refresh,
    retryInstance,
    terminateInstance,
  }
}
