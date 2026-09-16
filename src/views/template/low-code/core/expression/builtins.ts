import dayjs from 'dayjs'
import type { ExpressionFunction } from './types'

type UnknownRecord = Record<string, unknown>

function toNumber(value: unknown, fallback = 0) {
  const result = Number(value)
  return Number.isFinite(result) ? result : fallback
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []
  return [value]
}

/**
 * Expression 白名单函数集合。
 * Expression 无法访问任意全局环境，所有函数能力必须在此显式注册。
 */
export const expressionFunctions: Record<string, ExpressionFunction> = {
  formatDate(value, pattern) {
    const date = dayjs(value as string | number | Date)
    return date.isValid()
      ? date.format(String(pattern ?? 'YYYY-MM-DD HH:mm:ss'))
      : ''
  },
  formatNumber(value, digits) {
    const precision = toNumber(digits, 2)
    const result = toNumber(value)
    return result.toFixed(precision)
  },
  now() {
    return Date.now()
  },
  today() {
    return dayjs().format('YYYY-MM-DD')
  },
  len(value) {
    if (typeof value === 'string' || Array.isArray(value)) return value.length
    if (value instanceof Map || value instanceof Set) return value.size
    if (value && typeof value === 'object') return Object.keys(value).length
    return 0
  },
  upper(value) {
    return String(value ?? '').toUpperCase()
  },
  lower(value) {
    return String(value ?? '').toLowerCase()
  },
  capitalize(value) {
    const text = String(value ?? '')
    return text ? text[0].toUpperCase() + text.slice(1) : text
  },
  trim(value) {
    return String(value ?? '').trim()
  },
  json(value) {
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  },
  parseJson(value) {
    try {
      return JSON.parse(String(value))
    } catch {
      return undefined
    }
  },
  int(value) {
    return Math.trunc(toNumber(value))
  },
  float(value) {
    return toNumber(value)
  },
  str(value) {
    return value === null || value === undefined ? '' : String(value)
  },
  bool(value) {
    return Boolean(value)
  },
  sum(value) {
    return toArray(value).reduce<number>(
      (total, item) => total + toNumber(item),
      0
    )
  },
  avg(value) {
    const list = toArray(value)
    if (!list.length) return 0
    return (
      list.reduce<number>((total, item) => total + toNumber(item), 0) /
      list.length
    )
  },
  min(value) {
    const list = toArray(value).map((item) => toNumber(item))
    return list.length ? Math.min(...list) : 0
  },
  max(value) {
    const list = toArray(value).map((item) => toNumber(item))
    return list.length ? Math.max(...list) : 0
  },
  round(value, digits) {
    const factor = 10 ** toNumber(digits, 0)
    return Math.round(toNumber(value) * factor) / factor
  },
  floor(value) {
    return Math.floor(toNumber(value))
  },
  ceil(value) {
    return Math.ceil(toNumber(value))
  },
  abs(value) {
    return Math.abs(toNumber(value))
  },
  unique(value) {
    const seen = new Set<unknown>()
    const result: unknown[] = []
    for (const item of toArray(value)) {
      const key = typeof item === 'object' ? JSON.stringify(item) : item
      if (seen.has(key)) continue
      seen.add(key)
      result.push(item)
    }
    return result
  },
  first(value) {
    return toArray(value)[0]
  },
  last(value) {
    const list = toArray(value)
    return list[list.length - 1]
  },
  sortBy(value, key, order) {
    const list = [...toArray(value)]
    const direction = order === 'desc' ? -1 : 1
    return list.sort((left, right) => {
      const a = key ? (left as UnknownRecord)[String(key)] : left
      const b = key ? (right as UnknownRecord)[String(key)] : right
      if (a === b) return 0
      return (a as number) > (b as number) ? direction : -direction
    })
  },
  groupBy(value, key) {
    const result: Record<string, unknown[]> = {}
    for (const item of toArray(value)) {
      const groupKey = String((item as UnknownRecord)[String(key)])
      result[groupKey] ??= []
      result[groupKey].push(item)
    }
    return result
  },
  includes(value, keyword) {
    if (typeof value === 'string') return value.includes(String(keyword))
    return toArray(value).includes(keyword)
  },
  isEmpty(value) {
    if (value === null || value === undefined || value === '') return true
    if (Array.isArray(value)) return value.length === 0
    if (value instanceof Map || value instanceof Set) return value.size === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
  },
  defaultTo(value, fallback) {
    return value === null || value === undefined || value === ''
      ? fallback
      : value
  },
  concat(...args) {
    if (args.some((item) => Array.isArray(item))) {
      return args.flatMap((item) => (Array.isArray(item) ? item : [item]))
    }
    return args.join('')
  },
  range(start, end, step) {
    const from = toNumber(start)
    const to = toNumber(end)
    const size = Math.abs(toNumber(step, from <= to ? 1 : -1)) || 1
    const result: number[] = []
    if (from <= to) {
      for (let value = from; value < to; value += size) result.push(value)
    } else {
      for (let value = from; value > to; value -= size) result.push(value)
    }
    return result
  },
}
