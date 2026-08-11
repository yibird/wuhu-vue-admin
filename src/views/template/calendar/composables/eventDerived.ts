import type { Event } from '@dayflow/core'
import dayjs from 'dayjs'
import { getPriorityMeta, getStatusMeta } from '../data'
import type {
  CalendarEventDetail,
  CalendarFilterState,
  SummaryCard,
  UpcomingEvent,
} from '../types'
import { getCalendarType, readMeta } from './eventMeta'
import { formatEventTime, getEventStartDate, getWeekRange } from './eventTime'

export function filterCalendarEvents(
  events: Event[],
  filters: CalendarFilterState
): Event[] {
  const keyword = filters.keyword.trim().toLowerCase()

  return events.filter((item) => {
    const meta = readMeta(item)
    const calendarType = getCalendarType(item.calendarId)
    const matchCalendar =
      item.calendarId === undefined ||
      filters.calendarIds.includes(item.calendarId)
    const matchStatus = filters.statuses.includes(meta.status)
    const matchKeyword =
      !keyword ||
      item.title.toLowerCase().includes(keyword) ||
      (item.description ?? '').toLowerCase().includes(keyword) ||
      meta.owner.toLowerCase().includes(keyword) ||
      meta.location.toLowerCase().includes(keyword) ||
      calendarType.name.toLowerCase().includes(keyword)

    return matchCalendar && matchStatus && matchKeyword
  })
}

export function createUpcomingEvents(events: Event[]): UpcomingEvent[] {
  return events
    .map((item) => {
      const startDate = getEventStartDate(item)
      const calendarType = getCalendarType(item.calendarId)
      const meta = readMeta(item)

      return {
        id: item.id,
        title: item.title,
        startDate,
        color: calendarType.colors.eventColor,
        time: formatEventTime(item),
        calendarName: calendarType.name,
        status: getStatusMeta(meta.status),
        priority: getPriorityMeta(meta.priority),
      }
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 8)
}

export function createEventDetail(event: Event): CalendarEventDetail {
  const meta = readMeta(event)
  const calendarType = getCalendarType(event.calendarId)

  return {
    id: event.id,
    title: event.title,
    description: event.description ?? '暂无补充说明',
    time: formatEventTime(event),
    calendarName: calendarType.name,
    calendarColor: calendarType.colors.eventColor,
    owner: meta.owner,
    location: meta.location,
    status: getStatusMeta(meta.status),
    priority: getPriorityMeta(meta.priority),
    raw: event,
  }
}

export function createSummaryCards(events: Event[]): SummaryCard[] {
  const today = dayjs()
  const weekRange = getWeekRange(today)
  const todayCount = events.filter((item) =>
    dayjs(getEventStartDate(item)).isSame(today, 'day')
  ).length
  const weekCount = events.filter((item) => {
    const date = dayjs(getEventStartDate(item))
    return date.isAfter(weekRange.start) && date.isBefore(weekRange.end)
  }).length
  const confirmedCount = events.filter(
    (item) => readMeta(item).status === 'confirmed'
  ).length
  const doneCount = events.filter(
    (item) => readMeta(item).status === 'done'
  ).length

  return [
    {
      label: '今日日程',
      value: todayCount,
      description: todayCount > 0 ? '需要跟进的会议和排期' : '今天暂未安排',
      icon: 'i-lucide:calendar-check',
    },
    {
      label: '本周安排',
      value: weekCount,
      description: '按中国工作周统计',
      icon: 'i-lucide:calendar-days',
    },
    {
      label: '已确认',
      value: confirmedCount,
      description: '可直接进入执行',
      icon: 'i-lucide:circle-check-big',
    },
    {
      label: '完成率',
      value: `${Math.round((doneCount / Math.max(events.length, 1)) * 100)}%`,
      description: `${doneCount}/${events.length} 已完成`,
      icon: 'i-lucide:chart-no-axes-column-increasing',
    },
  ]
}
