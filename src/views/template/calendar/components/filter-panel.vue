<template>
  <section class="rounded-8 b-1-regular bg-container p-12">
    <div class="mb-10 flex items-center justify-between gap-10">
      <div class="flex items-center gap-8 text-sm text-main font-700">
        <Icon name="i-lucide:sliders-horizontal" :size="15" />
        日程筛选
      </div>
      <a-badge :count="activeFilterCount" size="small" />
    </div>

    <a-input
      :value="keyword"
      allow-clear
      placeholder="搜索标题、负责人、地点"
      @update:value="emits('updateKeyword', String($event))"
    >
      <template #prefix>
        <Icon name="i-lucide:search" class="text-secondary" />
      </template>
    </a-input>

    <div class="mt-12 text-xs text-secondary font-700">日历分类</div>
    <a-checkbox-group
      class="mt-8 grid gap-8"
      :options="calendarCheckboxOptions"
      :value="calendarIds"
      @change="updateCalendarIds"
    />

    <div class="mt-12 text-xs text-secondary font-700">日程状态</div>
    <a-checkbox-group
      class="mt-8 grid gap-8"
      :options="statusCheckboxOptions"
      :value="statuses"
      @change="updateStatuses"
    />

    <a-button
      v-if="hasActiveFilters"
      block
      class="mt-12"
      size="small"
      @click="emits('resetFilters')"
    >
      重置筛选
    </a-button>
  </section>
</template>

<script setup lang="ts">
import type { CalendarType } from '@dayflow/core'
import type { CalendarEventStatus, CalendarMetaOption } from '../types'

const props = defineProps<{
  activeFilterCount: number
  calendarIds: string[]
  calendarTypes: CalendarType[]
  hasActiveFilters: boolean
  keyword: string
  statusOptions: CalendarMetaOption<CalendarEventStatus>[]
  statuses: CalendarEventStatus[]
}>()

const emits = defineEmits<{
  resetFilters: []
  updateCalendarIds: [value: string[]]
  updateKeyword: [value: string]
  updateStatuses: [value: CalendarEventStatus[]]
}>()

const calendarCheckboxOptions = computed(() =>
  props.calendarTypes.map((item) => ({
    label: item.name,
    value: item.id,
  }))
)

const statusCheckboxOptions = computed(() =>
  props.statusOptions.map((item) => ({
    label: item.label,
    value: item.value,
  }))
)

function updateCalendarIds(value: unknown[]) {
  emits(
    'updateCalendarIds',
    value.filter((item): item is string => typeof item === 'string')
  )
}

function updateStatuses(value: unknown[]) {
  emits(
    'updateStatuses',
    value.filter((item): item is CalendarEventStatus =>
      props.statusOptions.some((option) => option.value === item)
    )
  )
}
</script>
