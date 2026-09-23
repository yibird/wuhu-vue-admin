import { createAllDayEvent, createEvent, type Event } from '@dayflow/core'
import dayjs from 'dayjs'
import { calendarTypes, defaultEventFormState } from '../data'
import type { CalendarEventFormState } from '../types'
import { createEventMeta, readMeta } from './eventMeta'
import { getEventEndDate, getEventStartDate } from './eventTime'

export function assignFormState(
  form: CalendarEventFormState,
  state: CalendarEventFormState
) {
  form.id = state.id
  form.title = state.title
  form.description = state.description
  form.calendarId = state.calendarId
  form.date = state.date
  form.startTime = state.startTime
  form.endTime = state.endTime
  form.allDay = state.allDay
  form.owner = state.owner
  form.location = state.location
  form.priority = state.priority
  form.status = state.status
}

export function createDefaultFormState(
  date = new Date()
): CalendarEventFormState {
  return {
    ...defaultEventFormState,
    date: dayjs(date).format('YYYY-MM-DD'),
  }
}

export function createFormStateFromEvent(event: Event): CalendarEventFormState {
  const start = dayjs(getEventStartDate(event))
  const end = dayjs(getEventEndDate(event))
  const meta = readMeta(event)

  return {
    id: event.id,
    title: event.title,
    description: event.description ?? '',
    calendarId: event.calendarId ?? calendarTypes[0].id,
    date: start.format('YYYY-MM-DD'),
    startTime: start.format('HH:mm'),
    endTime: end.format('HH:mm'),
    allDay: Boolean(event.allDay),
    ...meta,
  }
}

export function createEventId() {
  return `schedule-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`
}

export function createEventFromForm(
  form: CalendarEventFormState,
  id: string
): Event {
  const meta = createEventMeta({
    owner: form.owner,
    location: form.location,
    priority: form.priority,
    status: form.status,
  })

  if (form.allDay) {
    return createAllDayEvent({
      id,
      title: form.title.trim(),
      description: form.description.trim(),
      start: dayjs(form.date).toDate(),
      calendarId: form.calendarId,
      meta,
    })
  }

  return createEvent({
    id,
    title: form.title.trim(),
    description: form.description.trim(),
    start: dayjs(`${form.date} ${form.startTime}`).toDate(),
    end: dayjs(`${form.date} ${form.endTime}`).toDate(),
    calendarId: form.calendarId,
    meta,
  })
}
