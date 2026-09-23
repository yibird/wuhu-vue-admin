import { temporalToDate, type Event } from '@dayflow/core'
import dayjs from 'dayjs'

export const monthFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
})

export const fullDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export const countFormatter = new Intl.NumberFormat('zh-CN')

export function getEventStartDate(event: Event): Date {
  return temporalToDate(event.start)
}

export function getEventEndDate(event: Event): Date {
  return temporalToDate(event.end)
}

export function getWeekRange(date: dayjs.Dayjs) {
  const weekday = date.day() || 7
  const start = date.subtract(weekday - 1, 'day').startOf('day')
  return {
    start,
    end: start.add(6, 'day').endOf('day'),
  }
}

export function formatEventTime(event: Event): string {
  const start = dayjs(getEventStartDate(event))
  const end = dayjs(getEventEndDate(event))

  if (event.allDay) return `${start.format('M月D日')} 全天`

  return `${start.format('M月D日 HH:mm')} - ${end.format('HH:mm')}`
}
