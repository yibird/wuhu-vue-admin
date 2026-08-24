<script setup lang="ts">
import type { CalendarSelectOption, CalendarView } from '../types'

const {
  activeView,
  currentMonthLabel,
  eventCountLabel,
  todayLabel,
  viewOptions,
  loading = false,
} = defineProps<{
  activeView: CalendarView
  currentMonthLabel: string
  eventCountLabel: string
  todayLabel: string
  viewOptions: CalendarSelectOption<CalendarView>[]
  loading?: boolean
}>()

const emit = defineEmits<{
  changeView: [value: string | number]
  createEvent: []
  next: []
  previous: []
  today: []
}>()
</script>

<template>
  <header
    class="relative overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container px-18 py-16 shadow-[var(--w-shadow-elevated)]"
  >
    <div
      v-if="loading"
      class="min-h-84 flex items-center justify-between gap-14 max-lg:flex-col max-lg:items-start"
      aria-label="日历工具栏加载中"
      aria-busy="true"
    >
      <div>
        <a-skeleton-input active size="small" class="!w-96" />
        <a-skeleton-input active class="!mt-10 !w-220" />
        <a-skeleton-input active size="small" class="!mt-8 !w-180" />
      </div>
      <div class="flex flex-wrap gap-8">
        <a-skeleton-button active class="!w-120" />
        <a-skeleton-button v-for="item in 4" :key="item" active />
      </div>
    </div>
    <template v-else>
      <div
        class="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(circle_at_12%_0,rgb(var(--w-color-primary)_/_12%),transparent_32%),linear-gradient(135deg,rgb(var(--w-bg-container)),rgb(var(--w-fill-quaternary)_/_48%))]"
      ></div>
      <div
        class="relative flex items-center justify-between gap-14 max-lg:flex-col max-lg:items-start"
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-8">
            <span
              class="inline-flex items-center gap-6 rounded-4 border-1 border-primary/30 border-solid bg-primary/8 px-8 py-4 text-xs text-primary font-700"
            >
              <Icon name="i-lucide:calendar-range" :size="14" />
              团队日历
            </span>
            <span class="text-xs text-secondary">{{ todayLabel }}</span>
          </div>
          <h1 class="m-0 mt-8 text-26px text-main font-800 leading-[1.2]">
            {{ currentMonthLabel }}
          </h1>
          <p class="m-0 mt-6 text-13px text-regular">
            {{ eventCountLabel }}，按产品、交付和团队协同统一排期。
          </p>
        </div>

        <div
          class="flex flex-none flex-wrap items-center justify-end gap-8 max-lg:w-full max-lg:justify-start [&_.ant-segmented]:max-w-full max-sm:[&_.ant-segmented]:w-full"
        >
          <a-segmented
            :options="viewOptions"
            :value="activeView"
            @change="emit('changeView', $event)"
          />
          <a-button aria-label="上一段时间" @click="emit('previous')">
            <template #icon>
              <Icon name="i-lucide:chevron-left" />
            </template>
          </a-button>
          <a-button @click="emit('today')">今天</a-button>
          <a-button aria-label="下一段时间" @click="emit('next')">
            <template #icon>
              <Icon name="i-lucide:chevron-right" />
            </template>
          </a-button>
          <a-button type="primary" @click="emit('createEvent')">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            新建日程
          </a-button>
        </div>
      </div>
    </template>
  </header>
</template>
