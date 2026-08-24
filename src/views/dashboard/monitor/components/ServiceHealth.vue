<script lang="ts" setup>
import Card from './Card.vue'
import type {
  ServiceHealthEmits,
  ServiceHealthProps,
  ServiceStatus,
} from './types'

const { items = [], loading = false } = defineProps<ServiceHealthProps>()
const emit = defineEmits<ServiceHealthEmits>()

const statusMeta: Record<
  ServiceStatus,
  {
    label: string
    class: string
    icon: string
    action: 'restart' | 'start' | 'stop'
  }
> = {
  running: {
    label: '运行中',
    class: 'bg-success-tint text-success',
    icon: 'i-lucide:circle-check',
    action: 'restart',
  },
  degraded: {
    label: '降级',
    class: 'bg-warning-tint text-warning',
    icon: 'i-lucide:circle-alert',
    action: 'restart',
  },
  stopped: {
    label: '已停止',
    class: 'bg-error-tint text-error',
    icon: 'i-lucide:circle-stop',
    action: 'start',
  },
}
</script>

<template>
  <Card
    v-if="loading"
    title="服务健康"
    icon="i-lucide:server"
    description="核心服务状态与延迟"
  >
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div
        v-for="item in 4"
        :key="item"
        class="rounded-8 border-1 border-solid border-color-2 p-12"
      >
        <a-skeleton active :title="{ width: '45%' }" :paragraph="{ rows: 2 }" />
        <div class="mt-12 flex justify-end">
          <a-skeleton-button active size="small" />
        </div>
      </div>
    </div>
  </Card>
  <Card
    v-else
    title="服务健康"
    icon="i-lucide:server"
    description="核心服务状态与延迟"
  >
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div
        v-for="item in items"
        :key="item.id"
        class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12 transition-[border-color,background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-2 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]) active:(translate-y-0 scale-[0.995]) motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      >
        <div class="flex items-start justify-between gap-10">
          <div class="min-w-0">
            <div class="truncate text-sm text-main font-700">
              {{ item.name }}
            </div>
            <div class="mt-4 truncate text-xs text-secondary">
              {{ item.description }}
            </div>
          </div>
          <span
            :class="[
              'inline-flex shrink-0 items-center gap-4 rounded-999 px-8 py-3 text-xs',
              statusMeta[item.status].class,
            ]"
          >
            <Icon :name="statusMeta[item.status].icon" :size="13" />
            {{ statusMeta[item.status].label }}
          </span>
        </div>
        <div class="mt-12 grid grid-cols-3 gap-8 text-xs">
          <div class="rounded-6 bg-fill-quaternary px-8 py-7">
            <div class="text-secondary">端口</div>
            <div class="mt-3 text-main font-700">{{ item.port }}</div>
          </div>
          <div class="rounded-6 bg-fill-quaternary px-8 py-7">
            <div class="text-secondary">延迟</div>
            <div class="mt-3 text-main font-700">{{ item.latency }}ms</div>
          </div>
          <div class="rounded-6 bg-fill-quaternary px-8 py-7">
            <div class="text-secondary">运行</div>
            <div class="mt-3 truncate text-main font-700">
              {{ item.uptime }}
            </div>
          </div>
        </div>
        <div class="mt-10 flex justify-end">
          <a-button
            size="small"
            @click="emit('action', item, statusMeta[item.status].action)"
          >
            {{ item.status === 'stopped' ? '启动' : '重启' }}
          </a-button>
        </div>
      </div>
    </div>
  </Card>
</template>
