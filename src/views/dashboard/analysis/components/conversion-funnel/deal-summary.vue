<template>
  <div
    class="analysis-funnel-summary overflow-hidden rounded-10 bg-primary/10 p-12"
  >
    <div class="flex items-center justify-between gap-8">
      <span class="text-xs text-primary font-700">{{ summary.title }}</span>
      <span
        class="size-28 flex shrink-0 items-center justify-center rounded-8 bg-primary text-white"
      >
        <Icon name="i-lucide:badge-check" :size="15" />
      </span>
    </div>
    <div class="mt-12 flex items-end gap-5">
      <span class="text-3xl text-main font-800">{{ summary.value }}</span>
      <span class="pb-2 text-xs text-secondary">{{ summary.unit }}</span>
    </div>
    <div class="mt-5 text-xs text-secondary">
      {{ summary.description }}
    </div>
    <div class="mt-12 flex items-center justify-between gap-8">
      <span class="text-xs text-secondary">{{ summary.rateLabel }}</span>
      <span class="text-sm text-primary font-800">{{ summary.rate }}</span>
    </div>
    <div class="mt-6 h-6 overflow-hidden rounded-999 bg-primary/10">
      <div
        class="h-full rounded-999 bg-primary"
        :style="{ width: `${summary.progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { summary } from './data'
</script>
