import type { ChartPaletteItem, ChartType } from '../types'
import { advancedChartControls } from './advancedControls'
import { basicChartControls } from './basicControls'
import { toPaletteItem } from './types'

const chartTypeValues = [
  'area',
  'line',
  'bar',
  'pie',
  'funnel',
  'scatter',
  'radar',
  'gauge',
  'heatmap',
  'treemap',
  'sunburst',
  'boxplot',
  'candlestick',
  'graph',
  'pictorialBar',
  'sankey',
] as const

const chartTypeSet = new Set<string>(chartTypeValues)

export const chartControlDefinitions = [
  ...basicChartControls,
  ...advancedChartControls,
] as const

export const favoriteChartControls = chartControlDefinitions.filter((item) =>
  ['kpi', 'area', 'bar', 'pie', 'table'].includes(item.type)
)

export const chartControlPalette = chartControlDefinitions.map(toPaletteItem)
export const favoriteChartPalette = favoriteChartControls.map(toPaletteItem)

export function getChartControlDefinition(type: ChartPaletteItem['type']) {
  return chartControlDefinitions.find((item) => item.type === type)
}

export function isChartType(type: string): type is ChartType {
  return chartTypeSet.has(type)
}

export type { ChartControlDefinition } from './types'
