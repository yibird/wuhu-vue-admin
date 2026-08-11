<script setup lang="ts">
import CalendarCategoryStats from './CategoryStats.vue'
import CalendarEventDetailPanel from './EventDetailPanel.vue'
import CalendarFilterPanel from './FilterPanel.vue'
import CalendarUpcomingList from './UpcomingList.vue'

import type { CalendarType } from '@dayflow/core'
import type {
  CalendarEventDetail,
  CalendarEventStatus,
  CalendarMetaOption,
  UpcomingEvent,
} from '../types'

defineProps<{
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
}>()

const emit = defineEmits<{
  deleteEvent: [event: CalendarEventDetail]
  editEvent: [event: CalendarEventDetail]
  resetFilters: []
  selectEventDate: [date: Date, eventId: string]
  updateCalendarIds: [value: string[]]
  updateKeyword: [value: string]
  updateStatuses: [value: CalendarEventStatus[]]
}>()

function handleSelectEventDate(date: Date, eventId: string) {
  emit('selectEventDate', date, eventId)
}
</script>

<template>
  <aside
    class="min-h-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-elevated)] max-[1100px]:order--1"
  >
    <Scrollbar content-class="flex flex-col gap-16 p-14">
      <CalendarFilterPanel
        :active-filter-count="activeFilterCount"
        :calendar-ids="calendarIds"
        :calendar-types="calendarTypes"
        :has-active-filters="hasActiveFilters"
        :keyword="keyword"
        :status-options="statusOptions"
        :statuses="statuses"
        @reset-filters="emit('resetFilters')"
        @update-calendar-ids="emit('updateCalendarIds', $event)"
        @update-keyword="emit('updateKeyword', $event)"
        @update-statuses="emit('updateStatuses', $event)"
      />

      <CalendarUpcomingList
        :has-active-filters="hasActiveFilters"
        :upcoming-events="upcomingEvents"
        @reset-filters="emit('resetFilters')"
        @select-event-date="handleSelectEventDate"
      />

      <CalendarEventDetailPanel
        :selected-event="selectedEvent"
        @delete-event="emit('deleteEvent', $event)"
        @edit-event="emit('editEvent', $event)"
      />

      <CalendarCategoryStats
        :calendar-types="calendarTypes"
        :get-calendar-count="getCalendarCount"
      />
    </Scrollbar>
  </aside>
</template>
