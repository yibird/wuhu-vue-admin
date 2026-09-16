<template>
  <SectionPanel
    title="应用监控"
    icon="i-lucide:boxes"
    description="进程、堆内存、线程和运行状态"
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
    <ProcessLoadChart :processes="processes" />

    <div class="mt-14 overflow-x-auto">
      <div class="min-w-900">
        <div
          class="grid grid-cols-[minmax(180px,1.6fr)_80px_100px_100px_100px_100px_90px] gap-10 border-b-1 border-b-solid border-color-2 px-10 pb-9 text-xs text-secondary"
        >
          <span>进程</span>
          <span>PID</span>
          <span>CPU</span>
          <span>内存</span>
          <span>堆使用</span>
          <span>线程</span>
          <span>状态</span>
        </div>
        <div class="flex flex-col">
          <button
            v-for="item in processes"
            :key="item.id"
            type="button"
            class="grid grid-cols-[minmax(180px,1.6fr)_80px_100px_100px_100px_100px_90px] gap-10 border-b-1 border-b-solid border-color-1 px-10 py-11 text-left transition-[background-color,transform] duration-motion-base hover:(bg-hover-2) active:scale-[0.998] motion-reduce:transition-none"
            @click="emit('selectProcess', item)"
          >
            <span class="min-w-0">
              <span class="block truncate text-sm text-main font-600">{{
                item.name
              }}</span>
              <span class="mt-3 block truncate text-xs text-secondary">{{
                item.version
              }}</span>
            </span>
            <span class="self-center text-xs text-secondary">{{
              item.pid
            }}</span>
            <span class="self-center text-sm text-main">{{ item.cpu }}%</span>
            <span class="self-center text-sm text-main">{{ item.memory }}</span>
            <span class="self-center">
              <span class="text-sm text-main">{{ item.heap }}%</span>
              <span
                class="mt-4 block h-4 w-70 overflow-hidden rounded-full bg-fill-tertiary"
              >
                <span
                  class="block h-full rounded-full bg-primary transition-[width] duration-motion-base"
                  :style="{ width: `${item.heap}%` }"
                />
              </span>
            </span>
            <span class="self-center text-sm text-main">{{
              item.threads
            }}</span>
            <span
              :class="[
                'self-center justify-self-start rounded-999 px-7 py-3 text-xs',
                statusMeta[item.status].class,
              ]"
            >
              {{ statusMeta[item.status].label }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-9 text-xs text-secondary">点击进程可查看运行详情</div>
  </SectionPanel>
</template>

<script setup lang="ts">
import ProcessLoadChart from './ProcessLoadChart.vue'
import SectionPanel from './SectionPanel.vue'
import SummaryMetric from './SummaryMetric.vue'
import type {
  ProcessMetric,
  SummaryMetricItem,
  SystemMonitorActions,
} from './types'

const props = defineProps<{
  processes: ProcessMetric[]
}>()
const emit = defineEmits<SystemMonitorActions>()

const statusMeta = {
  healthy: { label: '运行中', class: 'bg-success-tint text-success' },
  warning: { label: '需关注', class: 'bg-warning-tint text-warning' },
  offline: { label: '已停止', class: 'bg-error-tint text-error' },
} as const

const summaryItems = computed<SummaryMetricItem[]>(() => [
  {
    label: '运行进程',
    value: `${props.processes.filter((item) => item.status !== 'offline').length} / ${props.processes.length}`,
    tone: 'success',
  },
  {
    label: '堆内存使用',
    value: props.processes.length
      ? `${Math.round(props.processes.reduce((sum, item) => sum + item.heap, 0) / props.processes.length)}%`
      : '--',
    tone: 'warning',
  },
  {
    label: '进程线程',
    value: props.processes.reduce((sum, item) => sum + item.threads, 0),
    tone: 'primary',
  },
  {
    label: '最高 CPU',
    value: props.processes.length
      ? `${Math.max(...props.processes.map((item) => item.cpu))}%`
      : '--',
    tone: 'info',
  },
])
</script>
