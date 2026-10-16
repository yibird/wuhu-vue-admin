<template>
  <div class="absolute inset-0 full">
    <div class="box-border h-full p-10 flex flex-col gap-12 overflow-hidden">
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
        class="grid flex-1 overflow-y-auto grid-cols-[minmax(0,1fr)_320px] gap-12 max-[1100px]:grid-cols-1"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { message, Modal } from 'antdv-next'
import { useLoading } from '@/hooks'
import CalendarAside from './components/aside.vue'
import CalendarBoard from './components/board.vue'
import CalendarEventForm from './components/event-form.vue'
import CalendarSummary from './components/summary.vue'
import CalendarToolbar from './components/toolbar.vue'
import { useCalendarEvents } from './hooks'
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
  if (!action) return
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

<style>
/**
 * Dayflow 在 :where(:root) 上声明了一套默认 token(含 --df-color-border: #e5e5e5),
 * 画布内的覆盖写在 .calendar 作用域,影响不到 teleport 到 body 的浮层；
 * 这里在根作用域对齐项目 token,避免库默认值(尤其是 #e5e5e5)参与任何渲染。
 * 取值与 components/Board.vue 保持同步。
 */
html:root {
  --df-color-background: rgb(var(--w-bg-container));
  --df-color-border: rgb(var(--w-border-color-2));
  --df-color-card: rgb(var(--w-bg-container));
  --df-color-card-foreground: rgb(var(--w-text-main));
  --df-color-foreground: rgb(var(--w-text-main));
  --df-color-hover: rgb(var(--w-bg-hover));
  --df-color-muted: rgb(var(--w-fill-quaternary));
  --df-color-muted-foreground: rgb(var(--w-text-muted));
  --df-color-primary: rgb(var(--w-color-primary));
  --df-color-secondary: rgb(var(--w-text-muted));
}
</style>
