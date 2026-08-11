import type { EChartsCoreOption } from 'echarts/core'
import type {
  BaseEChartsOption,
  EChartsPaletteKey,
} from '@/composables/useEChartsTheme'
import type { ChartDataRecord, ChartDataSource, ChartWidget } from '../types'

export interface AggregatedChartRow {
  label: string
  value: number
}

export interface ChartOptionContext {
  baseOption: BaseEChartsOption
  getColor: (key: EChartsPaletteKey) => string
  rows: readonly AggregatedChartRow[]
  widget: ChartWidget
}

export type ChartOptionFactory = (
  context: ChartOptionContext
) => EChartsCoreOption

export function toFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function formatChartValue(
  value: number,
  formatter?: ChartWidget['formatter']
) {
  if (formatter === 'currency') {
    return new Intl.NumberFormat('zh-CN', {
      currency: 'CNY',
      maximumFractionDigits: 0,
      notation: value > 999999 ? 'compact' : 'standard',
      style: 'currency',
    }).format(value)
  }

  if (formatter === 'percent') {
    return new Intl.NumberFormat('zh-CN', {
      maximumFractionDigits: 1,
      style: 'percent',
    }).format(value)
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: value > 100 ? 0 : 2,
    notation: value > 999999 ? 'compact' : 'standard',
  }).format(value)
}

export function aggregateChartRows(
  source: ChartDataSource | undefined,
  widget: ChartWidget
) {
  if (!source) return []

  const bucket = new Map<string, number>()
  source.records.forEach((record: ChartDataRecord) => {
    const label = String(record[widget.dimension] ?? '未分组')
    bucket.set(
      label,
      (bucket.get(label) ?? 0) + toFiniteNumber(record[widget.measure])
    )
  })

  return Array.from(bucket.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}
