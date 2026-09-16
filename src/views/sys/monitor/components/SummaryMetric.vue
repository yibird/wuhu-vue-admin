<template>
  <div
    class="min-w-0 rounded-6 bg-fill-quaternary px-10 py-9 transition-colors duration-motion-base hover:bg-hover-2"
  >
    <div class="truncate text-xs text-secondary">{{ label }}</div>
    <div :class="['mt-4 truncate text-lg font-700', valueClass]">
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MonitorTone, SummaryMetricItem } from './types'

const props = defineProps<SummaryMetricItem>()

const valueClassMap: Record<MonitorTone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
}

const valueClass = computed(() => valueClassMap[props.tone])
</script>
