<template>
  <Scrollbar
    class="box-border h-full overflow-hidden p-10 [--calendar-content-height:760px] [background:radial-gradient(circle_at_top_left,rgb(var(--w-color-primary)_/_10%),transparent_30%),linear-gradient(180deg,rgb(var(--w-bg-layout-canvas-gradient-start)),rgb(var(--w-bg-layout-canvas-gradient-end)))] max-md:[--calendar-content-height:680px]"
    content-class="min-h-full min-w-0 flex flex-col gap-12"
  >
    <CalendarToolbar
      :loading="isLoading"
      :active-view="activeView"
      :current-month-label="currentMonthLabel"
      :event-count-label="eventCountLabel"
      :today-label="todayLabel"
      :view-options="viewOptions"
      @change-view="changeCalendarView"
      @create-event="openCreateEvent()"
      @next="goToNext"
      @previous="goToPrevious"
      @today="goToToday"
    />

    <CalendarSummary :items="summaryCards" :loading="isLoading" />

    <div
      class="grid min-h-[var(--calendar-content-height)] flex-1 grid-cols-[minmax(0,1fr)_320px] gap-12 max-[1100px]:grid-cols-1"
    >
      <CalendarBoard
        :calendar="calendar"
        :has-active-filters="hasActiveFilters"
        :loading="isLoading"
        :visible-event-count="visibleEventCount"
        @create-event="openCreateEvent()"
      />
      <CalendarAside
        :active-filter-count="activeFilterCount"
        :calendar-ids="filters.calendarIds"
        :calendar-types="calendarTypes"
        :get-calendar-count="getCalendarCount"
        :has-active-filters="hasActiveFilters"
        :keyword="filters.keyword"
        :loading="isLoading"
        :selected-event="selectedEventDetail"
        :status-options="eventStatusOptions"
        :statuses="filters.statuses"
        :upcoming-events="upcomingEvents"
        @delete-event="confirmDeleteEvent"
        @edit-event="handleEditEvent"
        @reset-filters="resetFilters"
        @select-event-date="selectEventDate"
        @update-calendar-ids="updateCalendarIds"
        @update-keyword="updateKeyword"
        @update-statuses="updateStatuses"
      />
    </div>

    <a-modal
      v-model:open="eventModalOpen"
      :confirm-loading="submitLoading"
      destroy-on-hidden
      :title="eventModalTitle"
      :width="720"
      @ok="handleSubmitEvent"
    >
      <CalendarEventForm
        ref="eventFormRef"
        v-model="eventForm"
        :calendar-options="calendarOptions"
        :owner-options="ownerOptions"
        :priority-options="eventPriorityOptions"
        :status-options="eventStatusOptions"
        :time-options="quickTimeOptions"
      />
    </a-modal>
  </Scrollbar>
</template>

<script setup lang="ts">
import { message, Modal } from 'antdv-next'
import { useLoading } from '@/composables'
import CalendarAside from './components/Aside.vue'
import CalendarBoard from './components/Board.vue'
import CalendarEventForm from './components/EventForm.vue'
import CalendarSummary from './components/Summary.vue'
import CalendarToolbar from './components/Toolbar.vue'
import { useCalendarEvents } from './composables/useEvents'
import {
  eventPriorityOptions,
  eventStatusOptions,
  ownerOptions,
  quickTimeOptions,
} from './data'
import type { CalendarEventDetail } from './types'
import '@dayflow/core/dist/styles.css'

const { isLoading } = useLoading({ delay: 280 })
const eventFormRef = shallowRef<InstanceType<typeof CalendarEventForm>>()

const {
  activeFilterCount,
  activeView,
  calendar,
  calendarTypes,
  changeCalendarView,
  currentMonthLabel,
  deleteEvent,
  editingEventId,
  eventForm,
  eventModalOpen,
  eventCountLabel,
  filters,
  getCalendarCount,
  goToNext,
  goToPrevious,
  goToToday,
  hasActiveFilters,
  openCreateEvent,
  openEditEvent,
  resetFilters,
  saveEventForm,
  selectEventDate,
  selectedEventDetail,
  submitLoading,
  summaryCards,
  todayLabel,
  upcomingEvents,
  updateCalendarIds,
  updateKeyword,
  updateStatuses,
  viewOptions,
  visibleEventCount,
} = useCalendarEvents()

const calendarOptions = computed(() =>
  calendarTypes.map((item) => ({
    label: item.name,
    value: item.id,
  }))
)
const eventModalTitle = computed(() =>
  editingEventId.value ? '编辑日程' : '新建日程'
)

function isFormValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}

watch(eventModalOpen, async (open) => {
  if (!open) return
  await nextTick()
  eventFormRef.value?.clearValidate()
})

function handleEditEvent(event: CalendarEventDetail) {
  openEditEvent(event.raw)
}

async function handleSubmitEvent() {
  try {
    await eventFormRef.value?.validate()
  } catch (error: unknown) {
    if (!isFormValidationError(error)) throw error
    return
  }

  const action = await saveEventForm()
  message.success(action === 'created' ? '日程已创建' : '日程已更新')
}

function confirmDeleteEvent(event: CalendarEventDetail) {
  Modal.confirm({
    title: '删除日程',
    content: `确定删除「${event.title}」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteEvent(event.id)
      message.success('日程已删除')
    },
  })
}
</script>
