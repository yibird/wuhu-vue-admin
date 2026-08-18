<script setup lang="ts">
import { computed } from 'vue'
import type { TicketStats } from '../types'

const props = defineProps<{
  stats: TicketStats
}>()

const items = computed(() => [
  {
    key: 'total',
    label: '全部工单',
    value: props.stats.total,
    icon: 'i-lucide:ticket-check',
    textClass: 'text-primary',
  },
  {
    key: 'pending',
    label: '待受理',
    value: props.stats.pending,
    icon: 'i-lucide:inbox',
    textClass: 'text-warning',
  },
  {
    key: 'processing',
    label: '处理中',
    value: props.stats.processing,
    icon: 'i-lucide:loader-circle',
    textClass: 'text-info',
  },
  {
    key: 'resolved',
    label: '已完成',
    value: props.stats.resolved,
    icon: 'i-lucide:circle-check',
    textClass: 'text-success',
  },
])
</script>

<template>
  <section
    class="grid grid-cols-2 border-b-1 border-color-2 border-b-solid bg-container lg:grid-cols-4"
  >
    <div
      v-for="(item, index) in items"
      :key="item.key"
      class="min-w-0 flex items-center gap-10 px-14 py-12 lg:px-18"
      :class="{
        'border-r-1 border-color-2 border-r-solid': index < items.length - 1,
      }"
    >
      <span
        class="size-34 shrink-0 flex items-center justify-center rounded-6 bg-fill"
        :class="item.textClass"
      >
        <Icon :name="item.icon" :size="17" />
      </span>
      <div class="min-w-0">
        <div class="text-xl text-main font-700 leading-none">
          {{ item.value }}
        </div>
        <div class="mt-5 truncate text-xs text-secondary">
          {{ item.label }}
        </div>
      </div>
    </div>
  </section>
</template>
