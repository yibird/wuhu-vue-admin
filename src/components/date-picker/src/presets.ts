import dayjs from './dayjs.ts'
import type { Dayjs } from 'dayjs'

type DateFactory = () => Dayjs
type DateRange = [Dayjs, Dayjs]

export interface DatePreset {
  label: string
  value: Dayjs | DateFactory
}

export interface DateRangePreset {
  label: string
  value: DateRange | (() => DateRange)
}

interface DateRangePresetDefinition {
  label: string
  value: [DateFactory, DateFactory]
}

const currentDay = () => dayjs()

const dayOffset = (offset: number) => () => dayjs().add(offset, 'day')
const weekStartOffset = (offset: number) => () =>
  dayjs().add(offset, 'week').startOf('week')
const weekEndOffset = (offset: number) => () =>
  dayjs().add(offset, 'week').endOf('week')
const monthStartOffset = (offset: number) => () =>
  dayjs().add(offset, 'month').startOf('month')
const monthEndOffset = (offset: number) => () =>
  dayjs().add(offset, 'month').endOf('month')
const quarterBoundary = (offset: number, boundary: 'start' | 'end') => () => {
  const target = dayjs().add(offset * 3, 'month')
  const firstMonth = Math.floor(target.month() / 3) * 3
  const quarterStart = target.month(firstMonth).startOf('month')
  return boundary === 'start'
    ? quarterStart
    : quarterStart.add(2, 'month').endOf('month')
}
const quarterStartOffset = (offset: number) => quarterBoundary(offset, 'start')
const quarterEndOffset = (offset: number) => quarterBoundary(offset, 'end')
const yearStartOffset = (offset: number) => () =>
  dayjs().add(offset, 'year').startOf('year')
const yearEndOffset = (offset: number) => () =>
  dayjs().add(offset, 'year').endOf('year')

export const defaultDatePresets: DatePreset[] = [
  { label: '今天', value: currentDay },
  { label: '明天', value: dayOffset(1) },
  { label: '昨天', value: dayOffset(-1) },
  { label: '前天', value: dayOffset(-2) },
  { label: '后天', value: dayOffset(2) },
  { label: '上一周', value: weekStartOffset(-1) },
  { label: '本周', value: weekStartOffset(0) },
  { label: '下周', value: weekStartOffset(1) },
  { label: '上月', value: monthStartOffset(-1) },
  { label: '本月', value: monthStartOffset(0) },
  { label: '下月', value: monthStartOffset(1) },
  { label: '本季度', value: quarterStartOffset(0) },
  { label: '上季度', value: quarterStartOffset(-1) },
  { label: '下季度', value: quarterStartOffset(1) },
  { label: '上一年', value: yearStartOffset(-1) },
  { label: '本年', value: yearStartOffset(0) },
  { label: '下一年', value: yearStartOffset(1) },
]

const defaultDateRangePresetDefinitions: DateRangePresetDefinition[] = [
  { label: '今天', value: [currentDay, currentDay] },
  { label: '明天', value: [dayOffset(1), dayOffset(1)] },
  { label: '昨天', value: [dayOffset(-1), dayOffset(-1)] },
  { label: '前天', value: [dayOffset(-2), dayOffset(-2)] },
  { label: '后天', value: [dayOffset(2), dayOffset(2)] },
  { label: '上一周', value: [weekStartOffset(-1), weekEndOffset(-1)] },
  { label: '本周', value: [weekStartOffset(0), weekEndOffset(0)] },
  { label: '下周', value: [weekStartOffset(1), weekEndOffset(1)] },
  { label: '上月', value: [monthStartOffset(-1), monthEndOffset(-1)] },
  { label: '本月', value: [monthStartOffset(0), monthEndOffset(0)] },
  { label: '下月', value: [monthStartOffset(1), monthEndOffset(1)] },
  { label: '本季度', value: [quarterStartOffset(0), quarterEndOffset(0)] },
  { label: '上季度', value: [quarterStartOffset(-1), quarterEndOffset(-1)] },
  { label: '下季度', value: [quarterStartOffset(1), quarterEndOffset(1)] },
  { label: '上一年', value: [yearStartOffset(-1), yearEndOffset(-1)] },
  { label: '本年', value: [yearStartOffset(0), yearEndOffset(0)] },
  { label: '下一年', value: [yearStartOffset(1), yearEndOffset(1)] },
]

export const defaultDateRangePresets: DateRangePreset[] =
  defaultDateRangePresetDefinitions.map(({ label, value: [start, end] }) => ({
    label,
    value: (): DateRange => [start(), end()],
  }))
