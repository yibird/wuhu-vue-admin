import { useIntervalFn } from '@vueuse/core'
import { message } from 'antdv-next'
import { createMonitorSnapshot, refreshMonitorSnapshot } from '../data'
import type {
  MonitorEnvironment,
  SystemMonitorSnapshot,
} from '../components/types'

export function useSystemMonitor() {
  const snapshot = shallowRef<SystemMonitorSnapshot>(createMonitorSnapshot())
  const autoRefresh = shallowRef(true)
  const refreshing = shallowRef(false)
  const activeEnvironment = shallowRef<MonitorEnvironment>('production')
  const lastRefreshAt = shallowRef(snapshot.value.updatedAt)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const { pause, resume } = useIntervalFn(
    () => {
      if (autoRefresh.value) refresh(false)
    },
    30_000,
    { immediate: true }
  )

  watch(autoRefresh, (enabled) => {
    if (enabled) {
      resume()
    } else {
      pause()
    }
  })

  onUnmounted(() => {
    pause()
    if (refreshTimer) clearTimeout(refreshTimer)
  })

  function refresh(showMessage = true) {
    if (refreshing.value) return
    refreshing.value = true
    refreshTimer = setTimeout(() => {
      snapshot.value = refreshMonitorSnapshot(snapshot.value)
      lastRefreshAt.value = snapshot.value.updatedAt
      refreshing.value = false
      refreshTimer = undefined
      if (showMessage) message.success('监控数据已刷新')
    }, 360)
  }

  function setAutoRefresh(value: boolean) {
    autoRefresh.value = value
  }

  function setEnvironment(environment: MonitorEnvironment) {
    if (environment === activeEnvironment.value) return

    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = undefined
    }
    refreshing.value = false
    activeEnvironment.value = environment
    snapshot.value = createMonitorSnapshot(environment)
    lastRefreshAt.value = snapshot.value.updatedAt
  }

  return {
    activeEnvironment,
    autoRefresh,
    lastRefreshAt,
    pause,
    refresh,
    refreshing,
    resume,
    setAutoRefresh,
    setEnvironment,
    snapshot,
  }
}
