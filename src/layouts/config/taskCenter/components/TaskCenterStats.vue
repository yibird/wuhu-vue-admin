<script setup lang="ts">
import type { TaskCenterStat } from '../types'

defineProps<{
  stats: TaskCenterStat[]
}>()
</script>

<template>
  <div class="grid grid-cols-4 gap-10 max-md:grid-cols-2 max-sm:grid-cols-1">
    <div
      v-for="item in stats"
      :key="item.key"
      class="min-w-0 rounded-6 border-1 border-color-2 border-solid bg-container p-12"
    >
      <div class="flex items-start justify-between gap-10">
        <div class="min-w-0">
          <div class="text-xs text-secondary">{{ item.label }}</div>
          <div class="mt-6 text-24px text-main font-700 leading-none">
            {{ item.value }}
          </div>
        </div>
        <span
          class="size-34 shrink-0 flex items-center justify-center rounded-6"
          :class="item.class"
        >
          <Icon :name="item.icon" :size="18" />
        </span>
      </div>
    </div>
  </div>
</template>
