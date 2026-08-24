<script lang="ts" setup>
import { useClipboard, useIntervalFn } from '@vueuse/core'
import { message } from 'antdv-next'
import { useLoading } from '@/composables'
import {
  AlertCenter,
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

<template>
  <WView :full="true" :padding="0">
    <Scrollbar>
      <div class="min-h-full bg-page p-10 sm:p-12">
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
    </Scrollbar>

    <a-modal
      :open="!!appDetail"
      :title="appDetail ? `${appDetail.title} 详情` : '应用详情'"
      :footer="null"
      :width="560"
      @cancel="appDetail = null"
    >
      <div v-if="appDetail" class="grid gap-14">
        <div class="flex items-start gap-12">
          <div
            class="size-48 shrink-0 flex items-center justify-center rounded-8 icon-primary-soft"
          >
            <Icon :name="appDetail.icon" :size="22" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-8">
              <strong class="text-base text-main">{{ appDetail.title }}</strong>
              <a-tag
                :color="appDetail.status === 'installed' ? 'green' : 'blue'"
              >
                {{ appDetail.status === 'installed' ? '已安装' : '可安装' }}
              </a-tag>
            </div>
            <div class="mt-5 text-sm text-secondary">
              {{ appDetail.description }}
            </div>
          </div>
        </div>

        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="当前版本">
            {{ appDetail.version }}
          </a-descriptions-item>
          <a-descriptions-item label="运行状态">
            {{
              appDetail.status === 'installed'
                ? '可从应用中心打开和维护'
                : '等待安装'
            }}
          </a-descriptions-item>
          <a-descriptions-item label="部署建议">
            {{
              appDetail.status === 'installed'
                ? '建议在低峰期检查更新并备份配置。'
                : '安装前请确认端口、存储和权限策略。'
            }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="flex justify-end gap-8">
          <a-button @click="appDetail = null">关闭</a-button>
          <a-button
            v-if="appDetail.status === 'available'"
            type="primary"
            @click="installApp(appDetail)"
          >
            安装应用
          </a-button>
        </div>
      </div>
    </a-modal>
  </WView>
</template>
