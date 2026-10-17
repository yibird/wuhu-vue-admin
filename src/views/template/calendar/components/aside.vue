<template>
  <aside
    class="h-full overflow-y-auto rounded-8 border-1 border-color-2 border-solid bg-container max-[1100px]:order--1"
  >
    <div
      v-if="loading"
      class="p-14"
      aria-label="日历侧栏加载中"
      aria-busy="true"
    >
      <a-skeleton active :paragraph="{ rows: 12 }" />
    </div>
    <div
      v-else
      class="flex flex-col gap-16 p-14 w-full h-full overflow-x-hidden overflow-y-auto"
    >
      <CalendarFilterPanel
        :active-filter-count="activeFilterCount"
        :calendar-ids="calendarIds"
        :calendar-types="calendarTypes"
        :has-active-filters="hasActiveFilters"
        :keyword="keyword"
        :status-options="statusOptions"
        :statuses="statuses"
        @reset-filters="emits('resetFilters')"
        @update-calendar-ids="emits('updateCalendarIds', $event)"
        @update-keyword="emits('updateKeyword', $event)"
        @update-statuses="emits('updateStatuses', $event)"
      />

      <CalendarUpcomingList
        :has-active-filters="hasActiveFilters"
        :upcoming-events="upcomingEvents"
        @reset-filters="emits('resetFilters')"
        @select-event-date="handleSelectEventDate"
      />

      <CalendarEventDetailPanel
        :selected-event="selectedEvent"
        @delete-event="emits('deleteEvent', $event)"
        @edit-event="emits('editEvent', $event)"
      />

      <CalendarCategoryStats
        :calendar-types="calendarTypes"
        :get-calendar-count="getCalendarCount"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import CalendarCategoryStats from './category-stats.vue'
import CalendarEventDetailPanel from './event-detail-panel.vue'
import CalendarFilterPanel from './filter-panel.vue'
import CalendarUpcomingList from './upcoming-list.vue'

import type { CalendarType } from '@dayflow/core'
import type {
  CalendarEventDetail,
  CalendarEventStatus,
  CalendarMetaOption,
  UpcomingEvent,
} from '../types'

const { loading = false } = defineProps<{
  activeFilterCount: number
  calendarTypes: CalendarType[]
  calendarIds: string[]
  getCalendarCount: (calendarId: string) => number
  hasActiveFilters: boolean
  keyword: string
  selectedEvent: CalendarEventDetail | null
  statusOptions: CalendarMetaOption<CalendarEventStatus>[]
  statuses: CalendarEventStatus[]
  upcomingEvents: UpcomingEvent[]
  loading?: boolean
}>()

const emits = defineEmits<{
  deleteEvent: [event: CalendarEventDetail]
  editEvent: [event: CalendarEventDetail]
  resetFilters: []
  selectEventDate: [date: Date, eventId: string]
  updateCalendarIds: [value: string[]]
  updateKeyword: [value: string]
  updateStatuses: [value: CalendarEventStatus[]]
}>()

function handleSelectEventDate(date: Date, eventId: string) {
  emits('selectEventDate', date, eventId)
}
</script>
