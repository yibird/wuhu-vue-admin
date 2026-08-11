import type { CalendarType } from '@dayflow/core'
import type {
  CalendarEventFormState,
  CalendarEventPriority,
  CalendarEventStatus,
  CalendarMetaOption,
  CalendarSelectOption,
  CalendarView,
} from './types'

export const calendarTypes: CalendarType[] = [
  {
    id: 'product',
    name: '产品节奏',
    icon: '产',
    colors: {
      eventColor: '#1677ff',
      eventSelectedColor: '#0958d9',
      lineColor: '#91caff',
      textColor: '#ffffff',
    },
    darkColors: {
      eventColor: '#3c89ff',
      eventSelectedColor: '#69a7ff',
      lineColor: '#1554ad',
      textColor: '#ffffff',
    },
  },
  {
    id: 'delivery',
    name: '交付排期',
    icon: '交',
    colors: {
      eventColor: '#00a870',
      eventSelectedColor: '#00875a',
      lineColor: '#8ce8c3',
      textColor: '#ffffff',
    },
    darkColors: {
      eventColor: '#1fbf83',
      eventSelectedColor: '#46d39d',
      lineColor: '#17664a',
      textColor: '#ffffff',
    },
  },
  {
    id: 'team',
    name: '团队协同',
    icon: '协',
    colors: {
      eventColor: '#fa8c16',
      eventSelectedColor: '#d46b08',
      lineColor: '#ffd591',
      textColor: '#ffffff',
    },
    darkColors: {
      eventColor: '#ff9d2e',
      eventSelectedColor: '#ffb357',
      lineColor: '#7a430d',
      textColor: '#ffffff',
    },
  },
]

export const viewOptions: CalendarSelectOption<CalendarView>[] = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

export const eventStatusOptions: CalendarMetaOption<CalendarEventStatus>[] = [
  {
    label: '已确认',
    value: 'confirmed',
    icon: 'i-lucide:check-circle-2',
    className: 'text-success bg-success/10 border-success/30',
  },
  {
    label: '待确认',
    value: 'tentative',
    icon: 'i-lucide:circle-dashed',
    className: 'text-warning bg-warning/10 border-warning/30',
  },
  {
    label: '已完成',
    value: 'done',
    icon: 'i-lucide:badge-check',
    className: 'text-primary bg-primary/10 border-primary/30',
  },
]

export const eventPriorityOptions: CalendarMetaOption<CalendarEventPriority>[] =
  [
    {
      label: '高',
      value: 'high',
      icon: 'i-lucide:chevrons-up',
      className: 'text-error bg-error/10 border-error/30',
    },
    {
      label: '中',
      value: 'medium',
      icon: 'i-lucide:equal',
      className: 'text-info bg-info/10 border-info/30',
    },
    {
      label: '低',
      value: 'low',
      icon: 'i-lucide:chevrons-down',
      className: 'text-secondary bg-fill border-color-2',
    },
  ]

export const ownerOptions: CalendarSelectOption[] = [
  { label: '产品组', value: '产品组' },
  { label: '交付组', value: '交付组' },
  { label: '设计组', value: '设计组' },
  { label: '运营组', value: '运营组' },
  { label: '研发组', value: '研发组' },
]

export const quickTimeOptions: CalendarSelectOption[] = Array.from(
  { length: 27 },
  (_, index) => {
    const totalMinutes = 8 * 60 + index * 30
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`
    return {
      label: value,
      value,
    }
  }
)

export const defaultEventFormState: CalendarEventFormState = {
  title: '',
  description: '',
  calendarId: 'product',
  date: '',
  startTime: '09:00',
  endTime: '10:00',
  allDay: false,
  owner: ownerOptions[0].value,
  location: '线上会议',
  priority: 'medium',
  status: 'confirmed',
}

export function getStatusMeta(status: unknown) {
  return (
    eventStatusOptions.find((item) => item.value === status) ??
    eventStatusOptions[0]
  )
}

export function getPriorityMeta(priority: unknown) {
  return (
    eventPriorityOptions.find((item) => item.value === priority) ??
    eventPriorityOptions[1]
  )
}
