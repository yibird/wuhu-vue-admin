<script setup lang="ts">
import { useSystemMonitor } from './composables'
import {
  DatabasePanel,
  ProcessPanel,
  RabbitPanel,
  RedisPanel,
  ServerPanel,
} from './components'
import type {
  MonitorEnvironment,
  ProcessMetric,
  QueueMetric,
} from './components'

const {
  activeEnvironment,
  autoRefresh,
  lastRefreshAt,
  refresh,
  refreshing,
  setAutoRefresh,
  setEnvironment,
  snapshot,
} = useSystemMonitor()

const selectedProcess = shallowRef<ProcessMetric | null>(null)
const selectedQueue = shallowRef<QueueMetric | null>(null)

const environmentOptions = [
  { label: '生产环境', value: 'production' },
  { label: '预发布环境', value: 'staging' },
]

const resourceWarningCount = computed(
  () =>
    snapshot.value.resources.filter((item) => {
      const threshold = item.id === 'disk' ? 70 : item.id === 'memory' ? 75 : 85
      return item.value >= threshold
    }).length
)
const processWarningCount = computed(
  () =>
    snapshot.value.processes.filter((item) => item.status !== 'healthy').length
)
const queueWarningCount = computed(
  () =>
    snapshot.value.rabbitmq.queues.filter((item) => item.status !== 'healthy')
      .length
)
const warningCount = computed(
  () =>
    resourceWarningCount.value +
    processWarningCount.value +
    queueWarningCount.value
)
const healthScore = computed(() => Math.max(0, 100 - warningCount.value * 8))
const healthScoreClass = computed(() => {
  if (healthScore.value >= 90) return 'text-success'
  if (healthScore.value >= 70) return 'text-warning'
  return 'text-error'
})
const monitorStatus = computed(() => {
  if (healthScore.value >= 90) {
    return {
      label: '运行正常',
      icon: 'i-lucide:circle-check',
      class: 'bg-success-tint text-success',
    }
  }
  if (healthScore.value >= 70) {
    return {
      label: '需要关注',
      icon: 'i-lucide:triangle-alert',
      class: 'bg-warning-tint text-warning',
    }
  }
  return {
    label: '存在风险',
    icon: 'i-lucide:circle-alert',
    class: 'bg-error-tint text-error',
  }
})

const selectedProcessDetails = computed(() => {
  if (!selectedProcess.value) return []
  const item = selectedProcess.value
  return [
    { label: '进程名称', value: item.name },
    { label: '进程 ID', value: String(item.pid) },
    { label: '版本', value: item.version },
    { label: '运行时间', value: item.uptime },
    { label: 'CPU 使用', value: `${item.cpu}%` },
    { label: '内存使用', value: item.memory },
    { label: '堆内存', value: `${item.heap}%` },
    { label: '线程数', value: String(item.threads) },
  ]
})

const selectedQueueDetails = computed(() => {
  if (!selectedQueue.value) return []
  const item = selectedQueue.value
  return [
    { label: '队列名称', value: item.name },
    { label: '虚拟主机', value: item.vhost },
    { label: 'Ready 消息', value: String(item.ready) },
    { label: '未确认消息', value: String(item.unacked) },
    { label: '消费者', value: String(item.consumers) },
    { label: '发布速率', value: `${item.publishRate}/s` },
    { label: '投递速率', value: `${item.deliverRate}/s` },
  ]
})

function handleEnvironmentChange(value: MonitorEnvironment) {
  selectedProcess.value = null
  selectedQueue.value = null
  setEnvironment(value)
}
</script>

<template>
  <WView :full="true" :padding="0">
    <Scrollbar>
      <div class="min-h-full bg-page p-10 sm:p-12">
        <header
          class="mb-12 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
        >
          <div
            class="flex flex-wrap items-start justify-between gap-14 border-b-1 border-b-solid border-color-2 px-14 py-14 sm:px-18 sm:py-16"
          >
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-10">
                <h1 class="m-0 text-md text-main font-700 sm:text-lg">
                  系统监控
                </h1>
                <span
                  :class="[
                    'inline-flex items-center gap-5 rounded-999 px-9 py-4 text-xs',
                    monitorStatus.class,
                  ]"
                >
                  <Icon :name="monitorStatus.icon" :size="13" />
                  {{ monitorStatus.label }}
                </span>
              </div>
              <p class="m-0 mt-5 text-xs text-secondary">
                {{ snapshot.hostname }} · {{ snapshot.region }} · 最近更新
                {{ lastRefreshAt }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-8">
              <a-select
                :value="activeEnvironment"
                class="w-132"
                :options="environmentOptions"
                @change="handleEnvironmentChange"
              />
              <div class="flex items-center gap-7 px-2 text-xs text-secondary">
                <a-switch
                  :checked="autoRefresh"
                  @update:checked="setAutoRefresh"
                />
                自动刷新
              </div>
              <a-button :loading="refreshing" @click="refresh()">
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

          <div class="grid grid-cols-2 gap-0 sm:grid-cols-4">
            <div class="px-14 py-12 sm:px-18 sm:py-14">
              <div class="text-xs text-secondary">健康评分</div>
              <div class="mt-6 flex items-baseline gap-5">
                <strong :class="['text-2xl font-800', healthScoreClass]">{{
                  healthScore
                }}</strong>
                <span class="text-xs text-secondary">/ 100</span>
              </div>
            </div>
            <div
              class="border-l-1 border-l-solid border-color-2 px-14 py-12 sm:px-18 sm:py-14"
            >
              <div class="text-xs text-secondary">应用进程</div>
              <div class="mt-6 text-2xl text-primary font-800">
                {{ snapshot.processes.length }}
              </div>
            </div>
            <div
              class="border-t-1 border-color-2 px-14 py-12 sm:border-l-1 sm:border-t-0 sm:px-18 sm:py-14"
            >
              <div class="text-xs text-secondary">数据库实例</div>
              <div class="mt-6 text-2xl text-info font-800">
                {{ snapshot.database.instances.length }}
              </div>
            </div>
            <div
              class="border-l-1 border-color-2 px-14 py-12 sm:px-18 sm:py-14"
            >
              <div class="text-xs text-secondary">待处理风险</div>
              <div
                :class="[
                  'mt-6 text-2xl font-800',
                  warningCount ? 'text-warning' : 'text-success',
                ]"
              >
                {{ warningCount }}
              </div>
            </div>
          </div>
        </header>

        <div class="flex flex-col gap-12">
          <ServerPanel :resources="snapshot.resources" :snapshot="snapshot" />
          <ProcessPanel
            :processes="snapshot.processes"
            @select-process="selectedProcess = $event"
          />
          <DatabasePanel :database="snapshot.database" />
          <RedisPanel :redis="snapshot.redis" />
          <RabbitPanel
            :rabbitmq="snapshot.rabbitmq"
            @select-queue="selectedQueue = $event"
          />
        </div>
      </div>
    </Scrollbar>

    <a-modal
      :open="Boolean(selectedProcess)"
      title="进程详情"
      :footer="null"
      :width="560"
      @cancel="selectedProcess = null"
    >
      <template v-if="selectedProcess">
        <div class="mb-14 flex items-start gap-10">
          <span
            class="size-36 flex-center rounded-8 bg-primary-tint text-primary"
          >
            <Icon name="i-lucide:boxes" :size="18" />
          </span>
          <div class="min-w-0">
            <div class="text-base text-main font-700">
              {{ selectedProcess.name }}
            </div>
            <div class="mt-4 text-xs text-secondary">
              {{ selectedProcess.detail }}
            </div>
          </div>
        </div>
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item
            v-for="item in selectedProcessDetails"
            :key="item.label"
            :label="item.label"
          >
            {{ item.value }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-modal>

    <a-modal
      :open="Boolean(selectedQueue)"
      title="队列详情"
      :footer="null"
      :width="560"
      @cancel="selectedQueue = null"
    >
      <template v-if="selectedQueue">
        <div class="mb-14 flex items-start gap-10">
          <span
            class="size-36 flex-center rounded-8 bg-warning-tint text-warning"
          >
            <Icon name="i-lucide:message-circle-more" :size="18" />
          </span>
          <div class="min-w-0">
            <div class="text-base text-main font-700">
              {{ selectedQueue.name }}
            </div>
            <div class="mt-4 text-xs text-secondary">
              {{
                selectedQueue.status === 'healthy'
                  ? '消费链路运行正常'
                  : '队列存在积压，请及时处理'
              }}
            </div>
          </div>
        </div>
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item
            v-for="item in selectedQueueDetails"
            :key="item.label"
            :label="item.label"
          >
            {{ item.value }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-modal>
  </WView>
</template>
