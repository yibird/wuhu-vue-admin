<template>
  <WView :full="true" :padding="0">
    <div class="w-full h-full overflow-x-hidden overflow-y-auto">
      <div class="page-view min-h-full bg-page p-10 sm:p-12">
        <MonitorHeader
          :auto-refresh="autoRefresh"
          :critical-alert-count="criticalAlertCount"
          :health-score="healthScore"
          :last-refresh-at="lastRefreshAt"
          :loading="isLoading"
          :refreshing="refreshing"
          :running-service-count="runningServiceCount"
          :total-service-count="serviceItems.length"
          :unresolved-alert-count="unresolvedAlerts.length"
          @refresh="refreshDashboard()"
          @update:auto-refresh="autoRefresh = $event"
        />

        <div
          class="grid w-full grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
        >
          <main class="min-w-0 flex flex-col gap-12">
            <Overview
              class="page-enter page-enter--2"
              :items="overviewItems"
              :loading="isLoading"
            />
            <Status
              class="page-enter page-enter--3"
              :items="statusItems"
              :loading="isLoading"
            />
            <SysMonitor
              class="page-enter page-enter--4"
              :data="monitorData"
              :loading="isLoading"
            />
            <ServiceHealth
              class="page-enter page-enter--5"
              :items="serviceItems"
              :loading="isLoading"
              @action="handleServiceAction"
            />
          </main>

          <aside class="min-w-0 flex flex-col gap-12">
            <AlertCenter
              v-model:active-severity="activeSeverity"
              class="page-enter page-enter--2"
              :items="unresolvedAlerts"
              :loading="isLoading"
              @resolve="resolveAlert"
            />
            <SysInfo
              class="page-enter page-enter--3"
              :items="sysInfoItems"
              :loading="isLoading"
              @copy="copySysInfo"
              @copy-all="copyAllSysInfo"
            />
            <RecommendApp
              class="page-enter page-enter--4"
              :items="appItems"
              :loading="isLoading"
              @install="installApp"
              @open="openApp"
            />
          </aside>
        </div>
      </div>
    </div>

    <AppDetailModal
      v-model:open="appDetailOpen"
      :app="appDetail"
      @install="installApp"
    />
  </WView>
</template>

<script lang="ts" setup>
import { useClipboard, useIntervalFn } from '@vueuse/core'
import { message } from 'antdv-next'
import { useLoading } from '@/hooks'
import {
  AlertCenter,
  AppDetailModal,
  MonitorHeader,
  Overview,
  RecommendApp,
  ServiceHealth,
  Status,
  SysInfo,
  SysMonitor,
} from './components'
import {
  alertItems,
  appItems,
  monitorData,
  overviewItems,
  serviceItems,
  statusItems,
  sysInfoItems,
} from './config'
import type {
  AlertItem,
  AppType,
  MonitorSeverity,
  ServiceItem,
  SysInfoType,
} from './components'

const { isLoading } = useLoading()
const { copy, isSupported: isClipboardSupported } = useClipboard({
  legacy: true,
})
const activeSeverity = shallowRef<MonitorSeverity | 'all'>('all')
const autoRefresh = shallowRef(true)
const refreshing = shallowRef(false)
const lastRefreshAt = shallowRef(formatTime())
const resolvedAlertIds = shallowRef<string[]>([])
const appDetail = shallowRef<AppType | null>(null)
/** 弹窗开关由 appDetail 派生,避免再维护一份状态与它同步 */
const appDetailOpen = computed({
  get: () => appDetail.value !== null,
  set: (open) => {
    if (!open) appDetail.value = null
  },
})
let refreshTimer: number | null = null

onUnmounted(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
})

const unresolvedAlerts = computed(() =>
  alertItems.filter((item) => !resolvedAlertIds.value.includes(item.id))
)
const criticalAlertCount = computed(
  () =>
    unresolvedAlerts.value.filter((item) => item.severity === 'critical').length
)
const runningServiceCount = computed(
  () => serviceItems.filter((item) => item.status === 'running').length
)
const healthScore = computed(() => {
  const alertPenalty = criticalAlertCount.value * 12
  const stoppedPenalty =
    serviceItems.filter((item) => item.status === 'stopped').length * 10
  return Math.max(0, 96 - alertPenalty - stoppedPenalty)
})

const { pause, resume } = useIntervalFn(
  () => {
    if (autoRefresh.value) refreshDashboard(false)
  },
  30_000,
  { immediate: true }
)

watch(autoRefresh, (enabled) => {
  if (enabled) {
    resume()
    return
  }
  pause()
})

onActivated(() => {
  if (autoRefresh.value) {
    resume()
    refreshDashboard(false)
  }
})

onDeactivated(pause)

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function refreshDashboard(showMessage = true) {
  if (refreshing.value) return
  refreshing.value = true
  refreshTimer = window.setTimeout(() => {
    refreshTimer = null
    lastRefreshAt.value = formatTime()
    refreshing.value = false
    if (showMessage) message.success('监控数据已刷新')
  }, 420)
}

async function copySysInfo(item: SysInfoType) {
  if (!isClipboardSupported.value) {
    message.warning('当前环境不支持复制')
    return
  }
  await copy(`${item.title}: ${item.value}`)
  message.success('系统信息已复制')
}

async function copyAllSysInfo() {
  if (!isClipboardSupported.value) {
    message.warning('当前环境不支持复制')
    return
  }
  await copy(
    sysInfoItems.map((item) => `${item.title}: ${item.value}`).join('\n')
  )
  message.success('系统信息已复制')
}

function resolveAlert(item: AlertItem) {
  if (!resolvedAlertIds.value.includes(item.id)) {
    resolvedAlertIds.value = [...resolvedAlertIds.value, item.id]
  }
  message.success('告警已标记处理')
}

function handleServiceAction(
  item: ServiceItem,
  action: 'restart' | 'start' | 'stop'
) {
  const actionText =
    action === 'start' ? '启动' : action === 'stop' ? '停止' : '重启'
  message.success(`${item.name} 已提交${actionText}任务`)
}

function openApp(item: AppType) {
  appDetail.value = item
}

function installApp(item: AppType) {
  message.success(`${item.title} 已加入安装队列`)
}
</script>
<style lang="less" scoped>
.page-view {
  background-image:
    radial-gradient(
      1100px 520px at -10% -8%,
      rgb(var(--w-color-primary) / 12%),
      transparent 70%
    ),
    radial-gradient(
      900px 460px at 108% -6%,
      rgb(var(--w-color-primary) / 9%),
      transparent 72%
    );
  background-repeat: no-repeat;
}
</style>
