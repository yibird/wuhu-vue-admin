<template>
  <SectionPanel
    title="RabbitMQ 监控"
    icon="i-lucide:message-circle-more"
    description="消息吞吐、积压、消费者和队列状态"
  >
    <div class="grid grid-cols-2 gap-10 sm:grid-cols-4">
      <SummaryMetric
        v-for="item in summaryItems"
        :key="item.label"
        :label="item.label"
        :tone="item.tone"
        :value="item.value"
      />
    </div>
    <div class="mt-14 overflow-x-auto">
      <div class="min-w-850">
        <div
          class="grid grid-cols-[minmax(210px,1.7fr)_120px_90px_90px_90px_110px_110px] gap-10 border-b-1 border-b-solid border-color-2 px-10 pb-9 text-xs text-secondary"
        >
          <span>队列</span>
          <span>状态</span>
          <span>Ready</span>
          <span>未确认</span>
          <span>消费者</span>
          <span>发布速率</span>
          <span>投递速率</span>
        </div>
        <div class="flex flex-col">
          <button
            v-for="item in rabbitmq.queues"
            :key="item.id"
            type="button"
            class="grid grid-cols-[minmax(210px,1.7fr)_120px_90px_90px_90px_110px_110px] items-center gap-10 border-b-1 border-b-solid border-color-1 px-10 py-11 text-left transition-[background-color,transform] duration-motion-base hover:bg-hover-2 active:scale-[0.998] motion-reduce:transition-none"
            @click="emit('selectQueue', item)"
          >
            <span class="min-w-0">
              <span class="block truncate text-sm text-main font-600">{{
                item.name
              }}</span>
              <span class="mt-3 block text-xs text-secondary">{{
                item.vhost
              }}</span>
            </span>
            <span
              :class="[
                'justify-self-start rounded-999 px-7 py-3 text-xs',
                statusMeta[item.status].class,
              ]"
              >{{ statusMeta[item.status].label }}</span
            >
            <span
              :class="[
                'text-sm',
                item.ready > 100 ? 'text-warning font-700' : 'text-main',
              ]"
              >{{ item.ready }}</span
            >
            <span class="text-sm text-main">{{ item.unacked }}</span>
            <span class="text-sm text-main">{{ item.consumers }}</span>
            <span class="text-sm text-main">{{ item.publishRate }}/s</span>
            <span class="text-sm text-main">{{ item.deliverRate }}/s</span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-9 text-xs text-secondary">点击队列可查看消费和积压详情</div>
  </SectionPanel>
</template>

<script setup lang="ts">
import SectionPanel from './SectionPanel.vue'
import SummaryMetric from './SummaryMetric.vue'
import type {
  RabbitSnapshot,
  SummaryMetricItem,
  SystemMonitorActions,
} from './types'

const props = defineProps<{
  rabbitmq: RabbitSnapshot
}>()
const emit = defineEmits<SystemMonitorActions>()

const statusMeta = {
  healthy: { label: '运行正常', class: 'bg-success-tint text-success' },
  warning: { label: '有积压', class: 'bg-warning-tint text-warning' },
  offline: { label: '已停止', class: 'bg-error-tint text-error' },
} as const

const summaryItems = computed<SummaryMetricItem[]>(() => [
  {
    label: '发布速率',
    value: `${props.rabbitmq.publishRate}/s`,
    tone: 'primary',
  },
  {
    label: '投递速率',
    value: `${props.rabbitmq.deliverRate}/s`,
    tone: 'success',
  },
  {
    label: '待处理消息',
    value: props.rabbitmq.messagesReady.toLocaleString(),
    tone: props.rabbitmq.messagesReady > 100 ? 'warning' : 'success',
  },
  {
    label: '活跃消费者',
    value: `${props.rabbitmq.consumers} 个`,
    tone: 'info',
  },
])
</script>
