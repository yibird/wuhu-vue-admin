import { useCalendarApp } from '@dayflow/vue'
import {
  createDayView,
  createEventsPlugin,
  createMonthView,
  createWeekView,
  type Event,
} from '@dayflow/core'
import { createDragPlugin } from '@dayflow/plugin-drag'
import { message } from 'antdv-next'
import { computed, reactive, shallowRef, watch } from 'vue'
import { calendarTypes, eventStatusOptions, viewOptions } from '../data'
import type {
  CalendarEventFormState,
  CalendarEventStatus,
  CalendarFilterState,
  CalendarView,
} from '../types'
import {
  createEventDetail,
  createSummaryCards,
  createUpcomingEvents,
  filterCalendarEvents,
} from './event-derived'
import {
  assignFormState,
  createDefaultFormState,
  createEventFromForm,
  createEventId,
  createFormStateFromEvent,
} from './event-form'
import { createSeedEvents } from './event-seed'
import {
  countFormatter,
  fullDateFormatter,
  getEventStartDate,
  monthFormatter,
} from './event-time'

export function useCalendarEvents() {
  const initialEvents = createSeedEvents()
  const sourceEvents = shallowRef<Event[]>(initialEvents)
  const selectedEventId = shallowRef<string | null>(null)

  const calendar = useCalendarApp({
    views: [createDayView(), createWeekView(), createMonthView()],
    plugins: [createDragPlugin(), createEventsPlugin()],
    calendars: calendarTypes,
    defaultCalendar: 'product',
    defaultView: 'week',
    events: initialEvents,
    initialDate: new Date(),
    eventDetailTrigger: 'click',
    useEventDetailPanel: false,
    useCalendarHeader: false,
    locale: 'zh-CN',
    callbacks: {
      onEventClick(event) {
        selectedEventId.value = event.id
      },
      onEventUpdate(event) {
        selectedEventId.value = event.id
        upsertSourceEvent(event)
      },
      onEventDelete(eventId) {
        if (selectedEventId.value === eventId) selectedEventId.value = null
        removeSourceEvent(eventId)
      },
      onEventCreate(event) {
        selectedEventId.value = event.id
        upsertSourceEvent(event)
      },
    },
  })

  const activeView = shallowRef<CalendarView>('week')
  const eventForm = reactive<CalendarEventFormState>(createDefaultFormState())
  const filters = reactive<CalendarFilterState>({
    keyword: '',
    calendarIds: calendarTypes.map((item) => item.id),
    statuses: eventStatusOptions.map((item) => item.value),
  })
  const eventModalOpen = shallowRef(false)
  const editingEventId = shallowRef<string | null>(null)
  const submitLoading = shallowRef(false)

  const events = computed(() => sourceEvents.value)

  const visibleEvents = computed(() =>
    filterCalendarEvents(events.value, filters)
  )

  const selectedEvent = computed(() => {
    if (!selectedEventId.value) return null
    return (
      events.value.find((item) => item.id === selectedEventId.value) ?? null
    )
  })

  const currentMonthLabel = computed(() =>
    monthFormatter.format(calendar.currentDate)
  )
  const todayLabel = computed(() => fullDateFormatter.format(new Date()))
  const eventCountLabel = computed(() => {
    return `${countFormatter.format(events.value.length)} 个日程`
  })
  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.keyword.trim()) count += 1
    if (filters.calendarIds.length !== calendarTypes.length) count += 1
    if (filters.statuses.length !== eventStatusOptions.length) count += 1
    return count
  })
  const hasActiveFilters = computed(() => activeFilterCount.value > 0)

  const upcomingEvents = computed(() =>
    createUpcomingEvents(visibleEvents.value)
  )
  const selectedEventDetail = computed(() => {
    const event = selectedEvent.value
    return event ? createEventDetail(event) : null
  })
  const summaryCards = computed(() => createSummaryCards(events.value))

  watch(visibleEvents, syncCalendarProjection, { immediate: true })

  function replaceSourceEvents(updater: (events: Event[]) => Event[]) {
    sourceEvents.value = updater(sourceEvents.value)
  }

  function upsertSourceEvent(event: Event) {
    replaceSourceEvents((items) => {
      const existingIndex = items.findIndex((item) => item.id === event.id)
      if (existingIndex < 0) return [...items, event]

      return items.map((item) => (item.id === event.id ? event : item))
    })
  }

  function removeSourceEvent(eventId: string) {
    replaceSourceEvents((items) => items.filter((item) => item.id !== eventId))
  }

  /**
   * 把过滤后的投影同步给日历实例。
   *
   * @dayflow/core 3.7.4 的 useCalendarApp 未暴露 setEvents 之类的公开 setter，
   * 只能用内部字段 `app.state.events` + `app.triggerRender()` 直接改写；
   * 这里统一收口并做防御性判断，避免库调整内部结构后直接抛错。
   */
  function syncCalendarProjection(projectedEvents: Event[]) {
    const app = calendar.app
    if (!app?.state) return
    app.state.events = [...projectedEvents]
    app.triggerRender?.()
  }

  function changeCalendarView(value: string | number) {
    const view = viewOptions.find((item) => item.value === value)?.value
    if (!view) return

    activeView.value = view
    calendar.changeView(view)
  }

  function goToToday() {
    calendar.goToToday()
  }

  function goToPrevious() {
    calendar.goToPrevious()
  }

  function goToNext() {
    calendar.goToNext()
  }

  function selectEvent(eventId: string) {
    const event = events.value.find((item) => item.id === eventId)
    if (!event) return

    selectedEventId.value = eventId
    calendar.setCurrentDate(getEventStartDate(event))
    calendar.highlightEvent(eventId)
  }

  function selectEventDate(date: Date, eventId?: string) {
    calendar.setCurrentDate(date)
    if (eventId) selectEvent(eventId)
  }

  function getCalendarCount(calendarId: string) {
    return events.value.filter((item) => item.calendarId === calendarId).length
  }

  function updateKeyword(value: string) {
    filters.keyword = value
  }

  function updateCalendarIds(value: string[]) {
    filters.calendarIds = value
  }

  function updateStatuses(value: CalendarEventStatus[]) {
    filters.statuses = value
  }

  function resetFilters() {
    filters.keyword = ''
    filters.calendarIds = calendarTypes.map((item) => item.id)
    filters.statuses = eventStatusOptions.map((item) => item.value)
  }

  function openCreateEvent(date = calendar.currentDate) {
    editingEventId.value = null
    assignFormState(eventForm, createDefaultFormState(date))
    eventModalOpen.value = true
  }

  function openEditEvent(event: Event) {
    editingEventId.value = event.id
    selectedEventId.value = event.id
    assignFormState(eventForm, createFormStateFromEvent(event))
    eventModalOpen.value = true
  }

  async function saveEventForm() {
    submitLoading.value = true
    try {
      const id = editingEventId.value ?? createEventId()
      const nextEvent = createEventFromForm(eventForm, id)

      if (editingEventId.value) {
        replaceSourceEvents((items) =>
          items.map((item) => (item.id === id ? nextEvent : item))
        )
      } else {
        replaceSourceEvents((items) => [...items, nextEvent])
      }

      selectedEventId.value = id
      eventModalOpen.value = false
      return editingEventId.value ? 'updated' : 'created'
    } catch {
      message.error('日程保存失败，请检查日期与时间后重试')
      return null
    } finally {
      submitLoading.value = false
    }
  }

  async function deleteEvent(eventId: string) {
    removeSourceEvent(eventId)
    if (selectedEventId.value === eventId) selectedEventId.value = null
  }

  return {
    activeFilterCount,
    activeView,
    calendar,
    calendarTypes,
    changeCalendarView,
    currentMonthLabel,
    deleteEvent,
    editingEventId,
    eventCountLabel,
    eventForm,
    eventModalOpen,
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
    visibleEventCount: computed(() => visibleEvents.value.length),
  }
}
