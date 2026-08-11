<script setup lang="ts">
import type { ChartDesignerStats, ChartScreenConfig } from '../types'

defineProps<{
  screenConfig: ChartScreenConfig
  stats: ChartDesignerStats
}>()
</script>

<template>
  <div class="mb-14 flex items-end justify-between gap-16">
    <div class="min-w-0">
      <p class="m-0 text-12px text-cyan-200/66">LIVE DATA BOARD</p>
      <h3 class="m-0 mt-6 truncate text-26px font-800 text-white">
        {{ screenConfig.title }}
      </h3>
    </div>
    <div class="grid grid-cols-3 gap-8 text-right text-12px text-white/58">
      <span
        >Sources<br /><b class="text-white">{{ stats.sourceCount }}</b></span
      >
      <span
        >Widgets<br /><b class="text-white">{{ stats.widgetCount }}</b></span
      >
      <span>Status<br /><b class="text-emerald-300">Ready</b></span>
    </div>
  </div>
</template>
