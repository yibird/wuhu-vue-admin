<script setup lang="ts">
import type { CalendarType } from '@dayflow/core'

defineProps<{
  calendarTypes: CalendarType[]
  getCalendarCount: (calendarId: string) => number
}>()
</script>

<template>
  <section>
    <div class="mb-10 flex items-center gap-8 text-sm text-main font-700">
      <Icon name="i-lucide:layers" :size="15" />
      分类统计
    </div>
    <div class="flex flex-col gap-8">
      <div
        v-for="item in calendarTypes"
        :key="item.id"
        class="w-full flex items-center gap-8 rounded-8 border-1 border-color-2 border-solid bg-page px-10 py-8 text-13px text-main"
      >
        <span
          class="size-8 flex-none rounded-full"
          :style="{ backgroundColor: item.colors.eventColor }"
        ></span>
        <span>{{ item.name }}</span>
        <span class="ml-auto text-xs text-secondary tabular-nums">
          {{ getCalendarCount(item.id) }}
        </span>
      </div>
    </div>
  </section>
</template>
