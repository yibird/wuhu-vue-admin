<template>
  <div
    class="group min-w-0 rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12 transition-[background-color,border-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-1 border-color-primary bg-hover shadow-all-sm) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
  >
    <div class="flex items-start justify-between gap-10">
      <div class="min-w-0">
        <div class="truncate text-xs text-secondary">{{ metric.title }}</div>
        <div class="mt-7 flex items-baseline gap-4">
          <strong :class="['text-xl font-800', valueClass]">
            {{ metric.value }}
          </strong>
          <span class="text-xs text-secondary">{{ metric.unit }}</span>
        </div>
      </div>
      <span
        :class="[
          'size-30 shrink-0 flex-center rounded-8',
          toneClassMap[metric.tone],
        ]"
      >
        <Icon :name="metric.icon" :size="16" />
      </span>
    </div>
    <div class="mt-10 flex h-28 items-end gap-3" aria-hidden="true">
      <span
        v-for="(point, index) in metric.chart"
        :key="`${metric.id}-${index}`"
        :class="[
          'min-w-0 flex-1 rounded-t-3 opacity-75',
          barClassMap[metric.tone],
        ]"
        :style="{ height: `${Math.max(12, point)}%` }"
      />
    </div>
    <div class="mt-9 truncate text-xs text-secondary">{{ metric.detail }}</div>
    <div :class="['mt-5 text-xs', trendClassMap[metric.tone]]">
      {{ metric.trend }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResourceMetric } from './types'

const props = defineProps<{
  metric: ResourceMetric
}>()

const toneClassMap = {
  primary: 'bg-primary-tint text-primary',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
  error: 'bg-error-tint text-error',
  info: 'bg-info-tint text-info',
} as const

const barClassMap = {
  primary: 'bg-primary/45',
  success: 'bg-success/45',
  warning: 'bg-warning/45',
  error: 'bg-error/45',
  info: 'bg-info/45',
} as const

const trendClassMap = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
} as const

const valueClass = computed(() => trendClassMap[props.metric.tone])
</script>
