import type { CalendarType, Event } from '@dayflow/core'
import {
  calendarTypes,
  defaultEventLocation,
  defaultEventOwner,
  eventStatusOptions,
} from '../data'
import type {
  CalendarEventMeta,
  CalendarEventPriority,
  CalendarEventStatus,
} from '../types'

export function createEventMeta(
  patch: Partial<CalendarEventMeta> = {}
): CalendarEventMeta {
  return {
    owner: patch.owner ?? defaultEventOwner,
    location: patch.location ?? defaultEventLocation,
    priority: patch.priority ?? 'medium',
    status: patch.status ?? 'confirmed',
  }
}

function isEventStatus(value: unknown): value is CalendarEventStatus {
  return eventStatusOptions.some((item) => item.value === value)
}

function isEventPriority(value: unknown): value is CalendarEventPriority {
  return value === 'high' || value === 'medium' || value === 'low'
}

export function readMeta(event: Event): CalendarEventMeta {
  const meta = event.meta ?? {}
  const owner = typeof meta.owner === 'string' ? meta.owner : defaultEventOwner
  const location =
    typeof meta.location === 'string' ? meta.location : defaultEventLocation
  const priority = isEventPriority(meta.priority) ? meta.priority : 'medium'
  const status = isEventStatus(meta.status) ? meta.status : 'confirmed'

  return {
    owner,
    location,
    priority,
    status,
  }
}

export function getCalendarType(calendarId?: string): CalendarType {
  return (
    calendarTypes.find((item) => item.id === calendarId) ?? calendarTypes[0]
  )
}
