import type { RegionFilter, Scalar, SortSpec } from '../../types'

export function applyRegionFilters(
  rows: Record<string, Scalar>[],
  filters: RegionFilter[]
) {
  if (!filters.length) return rows
  return rows.filter((row) =>
    filters.every((filter) => matchesFilter(row[filter.field], filter))
  )
}

function matchesFilter(value: Scalar | undefined, filter: RegionFilter) {
  const left = value ?? null
  const right = filter.value

  switch (filter.operator) {
    case 'eq':
      return String(left ?? '') === right
    case 'neq':
      return String(left ?? '') !== right
    case 'contains':
      return String(left ?? '')
        .toLowerCase()
        .includes(right.toLowerCase())
    case 'gt':
      return toNumber(left) > toNumber(right)
    case 'gte':
      return toNumber(left) >= toNumber(right)
    case 'lt':
      return toNumber(left) < toNumber(right)
    case 'lte':
      return toNumber(left) <= toNumber(right)
    default:
      return true
  }
}

function toNumber(value: Scalar | undefined) {
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function applyRegionSort(
  rows: Record<string, Scalar>[],
  sort: SortSpec[]
) {
  if (!sort.length) return rows
  return [...rows].sort((left, right) => {
    for (const spec of sort) {
      const comparison = compare(left[spec.field], right[spec.field])
      if (comparison !== 0) return spec.desc ? -comparison : comparison
    }
    return 0
  })
}

function compare(left: Scalar | undefined, right: Scalar | undefined) {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }
  return String(left ?? '').localeCompare(String(right ?? ''), 'zh-CN')
}

export function groupRowsByField(
  rows: Record<string, Scalar>[],
  field: string
) {
  const groups = new Map<string, Record<string, Scalar>[]>()
  rows.forEach((row) => {
    const key = String(row[field] ?? '')
    const list = groups.get(key)
    if (list) list.push(row)
    else groups.set(key, [row])
  })
  return [...groups.values()]
}
