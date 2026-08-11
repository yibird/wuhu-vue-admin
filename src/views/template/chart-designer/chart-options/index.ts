import type { EChartsCoreOption } from 'echarts/core'
import { createCartesianOption, createPictorialBarOption } from './cartesian'
import { createBoxplotOption, createCandlestickOption } from './distribution'
import {
  createGraphOption,
  createSankeyOption,
  createTreeOption,
} from './network'
import {
  createFunnelOption,
  createGaugeOption,
  createPieOption,
  createRadarOption,
} from './radial'
import type { ChartOptionContext } from './shared'
export { aggregateChartRows, formatChartValue, toFiniteNumber } from './shared'
export type { AggregatedChartRow, ChartOptionContext } from './shared'

export function createWidgetChartOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const type = context.widget.chartType ?? 'area'

  switch (type) {
    case 'pie':
      return createPieOption(context)
    case 'funnel':
      return createFunnelOption(context)
    case 'gauge':
      return createGaugeOption(context)
    case 'radar':
      return createRadarOption(context)
    case 'treemap':
    case 'sunburst':
      return createTreeOption(context, type)
    case 'boxplot':
      return createBoxplotOption(context)
    case 'candlestick':
      return createCandlestickOption(context)
    case 'graph':
      return createGraphOption(context)
    case 'pictorialBar':
      return createPictorialBarOption(context)
    case 'sankey':
      return createSankeyOption(context)
    case 'area':
    case 'bar':
    case 'heatmap':
    case 'line':
    case 'scatter':
      return createCartesianOption(context, type)
    default:
      return assertNeverChartType(type)
  }
}

function assertNeverChartType(type: never): EChartsCoreOption {
  throw new Error(`Unsupported chart type: ${String(type)}`)
}
