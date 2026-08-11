import type { Event } from '@dayflow/core'

export type CalendarView = 'day' | 'week' | 'month'

export type CalendarEventStatus = 'confirmed' | 'tentative' | 'done'

export type CalendarEventPriority = 'high' | 'medium' | 'low'

export interface CalendarEventMeta extends Record<string, unknown> {
  owner: string
  location: string
  priority: CalendarEventPriority
  status: CalendarEventStatus
}

export interface CalendarEventFormState extends CalendarEventMeta {
  id?: string
  title: string
  description: string
  calendarId: string
  date: string
  startTime: string
  endTime: string
  allDay: boolean
}

export interface CalendarFilterState {
  keyword: string
  calendarIds: string[]
  statuses: CalendarEventStatus[]
}

export interface CalendarSelectOption<T extends string = string> {
  label: string
  value: T
}

export interface CalendarMetaOption<
  T extends string = string,
> extends CalendarSelectOption<T> {
  icon: string
  className: string
}

export interface UpcomingEvent {
  id: string
  title: string
  startDate: Date
  color: string
  time: string
  calendarName: string
  status: CalendarMetaOption<CalendarEventStatus>
  priority: CalendarMetaOption<CalendarEventPriority>
}

export interface SummaryCard {
  label: string
  value: number | string
  description: string
  icon: string
}

export interface CalendarEventDetail {
  id: string
  title: string
  description: string
  time: string
  calendarName: string
  calendarColor: string
  owner: string
  location: string
  status: CalendarMetaOption<CalendarEventStatus>
  priority: CalendarMetaOption<CalendarEventPriority>
  raw: Event
}
