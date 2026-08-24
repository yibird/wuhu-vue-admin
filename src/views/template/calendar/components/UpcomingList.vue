<script setup lang="ts">
import type { UpcomingEvent } from '../types'
import { getPriorityClass, getStatusClass } from '../data'

defineProps<{
  hasActiveFilters: boolean
  upcomingEvents: UpcomingEvent[]
}>()

const emit = defineEmits<{
  resetFilters: []
  selectEventDate: [date: Date, eventId: string]
}>()
</script>

<template>
  <section>
    <div class="mb-10 flex items-center justify-between gap-10">
      <div class="flex items-center gap-8 text-sm text-main font-700">
        <Icon name="i-lucide:list-todo" :size="15" />
        近期日程
      </div>
      <span class="text-xs text-secondary tabular-nums">
        {{ upcomingEvents.length }} 项
      </span>
    </div>

    <div v-if="upcomingEvents.length > 0" class="flex flex-col gap-8">
      <button
        v-for="item in upcomingEvents"
        :key="item.id"
        class="w-full appearance-none rounded-8 border-1 border-color-2 border-solid bg-page p-10 text-left text-main font-inherit cursor-pointer transition-[transform,colors] duration-motion-base hover:(-translate-y-1 border-primary/50 bg-hover) focus-visible:(border-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_20%)] outline-none) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        type="button"
        @click="emit('selectEventDate', item.startDate, item.id)"
      >
        <div class="flex items-start gap-10">
          <span
            class="mt-5 size-8 flex-none rounded-full"
            :style="{ backgroundColor: item.color }"
          ></span>
          <span class="min-w-0 flex flex-1 flex-col">
            <span class="truncate text-13px font-700">{{ item.title }}</span>
            <span class="mt-3 truncate text-xs text-secondary">
              {{ item.time }} · {{ item.calendarName }}
            </span>
          </span>
        </div>
        <div class="mt-8 flex flex-wrap gap-6">
          <span
            class="inline-flex items-center gap-4 rounded-4 border-1 border-solid px-6 py-2 text-11px"
            :class="getStatusClass(item.status.value)"
          >
            <Icon :name="item.status.icon" :size="12" />
            {{ item.status.label }}
          </span>
          <span
            class="inline-flex items-center gap-4 rounded-4 border-1 border-solid px-6 py-2 text-11px"
            :class="getPriorityClass(item.priority.value)"
          >
            <Icon :name="item.priority.icon" :size="12" />
            {{ item.priority.label }}优先级
          </span>
        </div>
      </button>
    </div>
    <div
      v-else
      class="rounded-8 border-1 border-color-2 border-dashed bg-page px-12 py-18 text-center"
    >
      <a-empty description="暂无匹配日程" />
      <a-button
        v-if="hasActiveFilters"
        class="mt-8"
        size="small"
        @click="emit('resetFilters')"
      >
        清空条件
      </a-button>
    </div>
  </section>
</template>
