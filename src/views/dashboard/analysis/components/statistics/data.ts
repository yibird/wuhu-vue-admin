import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

export type RangeKey =
  | 'currentDay'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

export type DateRange = [Dayjs, Dayjs]

export const rangeOptions: Array<{ title: string; value: RangeKey }> = [
  { title: '今天', value: 'currentDay' },
  { title: '昨天', value: 'yesterday' },
  { title: '本周', value: 'week' },
  { title: '本月', value: 'month' },
  { title: '本季度', value: 'quarter' },
  { title: '本年', value: 'year' },
]

/**
 * 按快捷选项解析出时间范围
 */
export function resolveRange(key: RangeKey): DateRange {
  const now = dayjs()

  switch (key) {
    case 'currentDay':
      return [now.startOf('day'), now.endOf('day')]
    case 'yesterday': {
      const day = now.subtract(1, 'day')
      return [day.startOf('day'), day.endOf('day')]
    }
    case 'week':
      return [now.startOf('week'), now.endOf('week')]
    case 'month':
      return [now.startOf('month'), now.endOf('month')]
    case 'quarter': {
      const start = now.startOf('month').subtract(now.month() % 3, 'month')
      return [start, start.add(3, 'month').subtract(1, 'day').endOf('day')]
    }
    case 'year':
      return [now.startOf('year'), now.endOf('year')]
  }
}

export interface RangeBucket {
  /** 横轴标签 */
  label: string
  /** 数据种子，保证同一时间段重复渲染结果一致 */
  seed: string
}

/**
 * 按范围跨度聚合横轴数据点：
 * 两天内按小时、100 天内按天、更长按月份
 */
export function buildBuckets([start, end]: DateRange): RangeBucket[] {
  const buckets: RangeBucket[] = []
  const days = end.diff(start, 'day') + 1

  if (days <= 2) {
    for (
      let cursor = start.startOf('hour');
      !cursor.isAfter(end);
      cursor = cursor.add(1, 'hour')
    ) {
      buckets.push({
        label: days > 1 ? cursor.format('MM-DD HH:00') : cursor.format('HH:00'),
        seed: cursor.format('YYYYMMDDHH'),
      })
    }
    return buckets
  }

  if (days <= 100) {
    for (
      let cursor = start.startOf('day');
      !cursor.isAfter(end);
      cursor = cursor.add(1, 'day')
    ) {
      buckets.push({
        label: cursor.format('MM-DD'),
        seed: cursor.format('YYYYMMDD'),
      })
    }
    return buckets
  }

  for (
    let cursor = start.startOf('month');
    !cursor.isAfter(end);
    cursor = cursor.add(1, 'month')
  ) {
    buckets.push({
      label: cursor.format('YYYY-MM'),
      seed: cursor.format('YYYYMM'),
    })
  }
  return buckets
}

function hash(input: string) {
  let value = 2166136261
  for (let index = 0; index < input.length; index++) {
    value ^= input.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return (value >>> 0) / 4294967295
}

/**
 * 生成可复现的模拟数值，同一 seed 每次结果一致
 */
export function bucketValue(seed: string, base: number, amplitude: number) {
  return Math.round(base + amplitude * hash(seed))
}
