import { evaluateExpression, toNumber } from './expression.ts'
import type { ReportField, ReportFilter, ReportRow, ReportSort } from '../types'

export interface ReportSummaryAggregate {
  count: number
  total: number
}

export interface ReportDataPipelineInput {
  fields: ReportField[]
  filters: ReportFilter[]
  rows: ReportRow[]
  sorts: ReportSort[]
}

export interface ReportDataPipelineResult {
  rows: ReportRow[]
  summaries: Record<string, ReportSummaryAggregate>
}

function normalizeText(value: unknown) {
  return value === null || value === undefined ? '' : String(value).trim()
}

function normalizeComparable(value: unknown) {
  const text = normalizeText(value)
  const numeric = Number(text.replaceAll(',', ''))
  if (text && Number.isFinite(numeric)) return numeric

  const timestamp = Date.parse(text)
  if (text && Number.isFinite(timestamp)) return timestamp

  return text.toLowerCase()
}

function compareValues(left: unknown, right: unknown) {
  const normalizedLeft = normalizeComparable(left)
  const normalizedRight = normalizeComparable(right)

  if (
    typeof normalizedLeft === 'number' &&
    typeof normalizedRight === 'number'
  ) {
    return normalizedLeft - normalizedRight
  }

  return String(normalizedLeft).localeCompare(String(normalizedRight), 'zh-CN')
}

function matchesFilter(row: ReportRow, filter: ReportFilter) {
  if (!filter.enabled || !filter.fieldKey) return true

  const rawValue = row[filter.fieldKey]
  const value = normalizeText(rawValue)
  const target = filter.value.trim()
  const secondTarget = filter.secondValue.trim()
  const normalizedValue = value.toLowerCase()
  const normalizedTarget = target.toLowerCase()

  if (filter.operator === 'empty') return !value
  if (filter.operator === 'notEmpty') return !!value
  if (!target) return true
  if (filter.operator === 'contains')
    return normalizedValue.includes(normalizedTarget)
  if (filter.operator === 'equals') return normalizedValue === normalizedTarget
  if (filter.operator === 'notEquals')
    return normalizedValue !== normalizedTarget
  if (filter.operator === 'startsWith')
    return normalizedValue.startsWith(normalizedTarget)
  if (filter.operator === 'endsWith')
    return normalizedValue.endsWith(normalizedTarget)
  if (filter.operator === 'greaterThan')
    return compareValues(rawValue, target) > 0
  if (filter.operator === 'greaterOrEqual')
    return compareValues(rawValue, target) >= 0
  if (filter.operator === 'lessThan') return compareValues(rawValue, target) < 0
  if (filter.operator === 'lessOrEqual')
    return compareValues(rawValue, target) <= 0
  if (filter.operator === 'between') {
    if (!secondTarget) return true
    return (
      compareValues(rawValue, target) >= 0 &&
      compareValues(rawValue, secondTarget) <= 0
    )
  }

  return true
}

function applySorts(rows: ReportRow[], sorts: ReportSort[]) {
  const activeSorts = sorts.filter((sort) => sort.enabled && sort.fieldKey)
  if (!activeSorts.length) return rows

  return [...rows].sort((left, right) => {
    for (const sort of activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      const result = compareValues(left[sort.fieldKey], right[sort.fieldKey])
      if (result !== 0) return result * direction
    }

    return 0
  })
}

function calculateSummaries(rows: ReportRow[], fields: ReportField[]) {
  const summaryFields = fields.filter(
    (field) => field.enabled && field.summary !== 'none'
  )
  if (!summaryFields.length) return {}

  const summaries: Record<string, ReportSummaryAggregate> = {}
  for (const field of summaryFields) {
    summaries[field.key] = { count: rows.length, total: 0 }
  }

  for (const row of rows) {
    for (const field of summaryFields) {
      if (field.summary !== 'count') {
        summaries[field.key].total += toNumber(row[field.key])
      }
    }
  }

  return summaries
}

export function processReportData({
  fields,
  filters,
  rows,
  sorts,
}: ReportDataPipelineInput): ReportDataPipelineResult {
  const computedFields = fields.filter((field) => field.computed)
  const availableKeys = new Set(fields.map((field) => field.key))
  const activeFilters = filters.filter(
    (filter) => filter.enabled && availableKeys.has(filter.fieldKey)
  )

  const computedRows = computedFields.length
    ? rows.map((row) => {
        const nextRow = { ...row }
        for (const field of computedFields) {
          nextRow[field.key] = evaluateExpression(
            field.expression ?? '',
            nextRow
          )
        }
        return nextRow
      })
    : rows

  const filteredRows = activeFilters.length
    ? computedRows.filter((row) =>
        activeFilters.every((filter) => matchesFilter(row, filter))
      )
    : computedRows
  const resultRows = applySorts(filteredRows, sorts)

  return {
    rows: resultRows,
    summaries: calculateSummaries(resultRows, fields),
  }
}
