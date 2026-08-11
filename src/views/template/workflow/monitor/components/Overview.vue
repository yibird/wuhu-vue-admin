<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'

const props = defineProps<{
  failureCount: number
  loading: boolean
  runningCount: number
  successRate: number
  unresolvedAlertCount: number
}>()

const metrics = computed(() => [
  {
    label: '运行中实例',
    value: String(props.runningCount),
    hint: '实时执行队列',
    icon: 'i-lucide:loader-circle',
    tone: 'text-primary bg-primary/10',
  },
  {
    label: '执行成功率',
    value: `${props.successRate}%`,
    hint: '已完成实例',
    icon: 'i-lucide:circle-check',
    tone: 'text-success bg-success-tint',
  },
  {
    label: '失败实例',
    value: String(props.failureCount),
    hint: '需要检查或重试',
    icon: 'i-lucide:circle-x',
    tone: 'text-error bg-error-tint',
  },
  {
    label: '未处理告警',
    value: String(props.unresolvedAlertCount),
    hint: '严重与警告事件',
    icon: 'i-lucide:triangle-alert',
    tone: 'text-warning bg-warning-tint',
  },
])
</script>

<template>
  <section class="grid grid-cols-2 gap-10 xl:grid-cols-4 max-sm:grid-cols-1">
    <Motion
      v-for="(metric, index) in metrics"
      :key="metric.label"
      as="article"
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.24, delay: index * 0.035, ease: 'easeOut' }"
      class="min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container p-13 shadow-[var(--w-shadow-card)]"
    >
      <a-skeleton v-if="loading" active :paragraph="{ rows: 1 }" />
      <div v-else class="flex items-start gap-11">
        <span
          class="size-36 flex flex-none items-center justify-center rounded-6"
          :class="metric.tone"
        >
          <Icon :name="metric.icon" :size="18" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="text-xs text-secondary">{{ metric.label }}</div>
          <strong class="mt-3 block text-xl text-main font-750 leading-24px">
            {{ metric.value }}
          </strong>
          <div class="mt-3 truncate text-xs text-secondary">
            {{ metric.hint }}
          </div>
        </div>
      </div>
    </Motion>
  </section>
</template>
