<script lang="ts" setup>
import { useClipboard, useIntervalFn } from '@vueuse/core'
import { onUnmounted } from 'vue'
import message from 'antdv-next/dist/message/index'
import { NumberTicker } from '@/components/numberTicker'
import { useLoading } from '@/composables'
import {
  AlertCenter,
  Overview,
  RecommendApp,
  ServiceHealth,
  Status,
  SysInfo,
  SysMonitor,
} from './components'
import Skeleton from './components/Skeleton.vue'
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
    if (autoRefresh.value) {
      refreshDashboard(false)
    }
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
    if (showMessage) {
      message.success('监控数据已刷新')
    }
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
        <Skeleton v-if="isLoading" />
        <div v-else class="w-full">
          <section
            class="page-enter page-enter--1 mb-12 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
          >
            <div
              class="flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 py-14 sm:px-18 sm:py-16"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-10">
                  <h1 class="m-0 text-md text-main font-700 sm:text-lg">
                    服务器监控
                  </h1>
                  <span
                    :class="[
                      'inline-flex items-center gap-5 rounded-999 px-9 py-4 text-xs',
                      criticalAlertCount > 0
                        ? 'bg-error-tint text-error'
                        : 'bg-success-tint text-success',
                    ]"
                  >
                    <Icon
                      :name="
                        criticalAlertCount > 0
                          ? 'i-lucide:circle-alert'
                          : 'i-lucide:circle-check'
                      "
                      :size="13"
                    />
                    {{ criticalAlertCount > 0 ? '需要处理' : '运行正常' }}
                  </span>
                </div>
                <div class="mt-5 text-xs text-secondary">
                  最近刷新 {{ lastRefreshAt }} · 自动刷新
                  {{ autoRefresh ? '已开启' : '已关闭' }}
                </div>
              </div>

              <div
                class="flex flex-wrap items-center justify-start gap-8 sm:justify-end"
              >
                <a-switch v-model:checked="autoRefresh" />
                <span class="text-xs text-secondary">自动刷新</span>
                <a-button :loading="refreshing" @click="refreshDashboard()">
                  <template #icon>
                    <Icon
                      name="i-lucide:refresh-cw"
                      :class="{
                        'animate-spin motion-reduce:animate-none': refreshing,
                      }"
                    />
                  </template>
                  刷新
                </a-button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-0 sm:grid-cols-3">
              <div class="px-14 py-12 sm:px-18 sm:py-14">
                <div class="text-xs text-secondary">健康评分</div>
                <div class="mt-6 flex items-end gap-6">
                  <span class="text-xl text-main font-800 sm:text-2xl">
                    <NumberTicker :value="healthScore" :duration="800" />
                  </span>
                  <span class="pb-2 text-xs text-secondary">/ 100</span>
                </div>
              </div>
              <div
                class="border-y-1 border-y-solid border-color-2 px-14 py-12 sm:border-x-1 sm:border-y-0 sm:border-x-solid sm:px-18 sm:py-14"
              >
                <div class="text-xs text-secondary">运行服务</div>
                <div class="mt-6 text-xl text-main font-800 sm:text-2xl">
                  <NumberTicker :value="runningServiceCount" :duration="800" />
                  <span class="text-secondary"> / </span>
                  <NumberTicker :value="serviceItems.length" :duration="800" />
                </div>
              </div>
              <div class="px-14 py-12 sm:px-18 sm:py-14">
                <div class="text-xs text-secondary">未处理告警</div>
                <div class="mt-6 text-xl text-main font-800 sm:text-2xl">
                  <NumberTicker
                    :value="unresolvedAlerts.length"
                    :duration="800"
                  />
                </div>
              </div>
            </div>
          </section>

          <div
            class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
          >
            <main class="min-w-0 flex flex-col gap-12">
              <Overview
                class="page-enter page-enter--2"
                :items="overviewItems"
              />
              <Status class="page-enter page-enter--3" :items="statusItems" />
              <SysMonitor
                class="page-enter page-enter--4"
                :data="monitorData"
              />
              <ServiceHealth
                class="page-enter page-enter--5"
                :items="serviceItems"
                @action="handleServiceAction"
              />
            </main>

            <aside class="min-w-0 flex flex-col gap-12">
              <AlertCenter
                v-model:active-severity="activeSeverity"
                class="page-enter page-enter--2"
                :items="unresolvedAlerts"
                @resolve="resolveAlert"
              />
              <SysInfo
                class="page-enter page-enter--3"
                :items="sysInfoItems"
                @copy="copySysInfo"
                @copy-all="copyAllSysInfo"
              />
              <RecommendApp
                class="page-enter page-enter--4"
                :items="appItems"
                @open="openApp"
                @install="installApp"
              />
            </aside>
          </div>
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
