import {
  getChartControlDefinition,
  isChartType,
} from '../components/controls/registry'
import type {
  ChartDataSource,
  ChartField,
  ChartFieldType,
  ChartPaletteItem,
  ChartWidget,
} from '../types'
import { createDesignerId } from './ids'

export function createWidgetFromPalette(
  item: ChartPaletteItem,
  source: ChartDataSource
): ChartWidget {
  const measure = getDefaultField(source.fields, [
    'currency',
    'number',
    'percent',
  ])
  const definition = getChartControlDefinition(item.type)
  const chartType =
    item.kind === 'chart' && isChartType(item.type) ? item.type : undefined

  return {
    accent: '#3b82f6',
    chartType,
    colSpan: definition?.defaultColSpan ?? 4,
    dimension: getDefaultField(source.fields, ['date', 'string']),
    formatter: getFormatter(source.fields, measure),
    id: createDesignerId('widget'),
    insight: `${item.title} 已绑定 ${source.name}，可在右侧继续调整字段、尺寸和配色。`,
    kind: item.kind,
    measure,
    rowSpan: definition?.defaultRowSpan ?? 2,
    sourceId: source.id,
    subtitle: source.name,
    title: item.title,
  }
}

export function getSourceWidgetDefaults(source: ChartDataSource) {
  const measure = getDefaultField(source.fields, [
    'currency',
    'number',
    'percent',
  ])

  return {
    dimension: getDefaultField(source.fields, ['date', 'string']),
    formatter: getFormatter(source.fields, measure),
    insight: `已切换到 ${source.name}，可继续调整字段、尺寸和配色。`,
    measure,
    subtitle: source.name,
  }
}

export function reorderByIds(widgets: ChartWidget[], orderedIds: string[]) {
  const widgetMap = new Map(widgets.map((widget) => [widget.id, widget]))
  const orderedWidgets = orderedIds
    .map((id) => widgetMap.get(id))
    .filter((widget): widget is ChartWidget => !!widget)
  const orderedIdSet = new Set(orderedIds)

  return [
    ...orderedWidgets,
    ...widgets.filter((widget) => !orderedIdSet.has(widget.id)),
  ]
}

export function clampIndex(index: number, max: number) {
  if (!Number.isFinite(index)) return max

  return Math.min(Math.max(index, 0), max)
}

function getDefaultField(
  fields: readonly ChartField[],
  preferredTypes: readonly ChartFieldType[],
  fallback = ''
) {
  return (
    fields.find((field) => preferredTypes.includes(field.type))?.key ??
    fields[0]?.key ??
    fallback
  )
}

function getFormatter(
  fields: readonly ChartField[],
  measure: string
): ChartWidget['formatter'] {
  const fieldType = fields.find((field) => field.key === measure)?.type
  if (fieldType === 'currency' || fieldType === 'percent') return fieldType

  return 'number'
}
