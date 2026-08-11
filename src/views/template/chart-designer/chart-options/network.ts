import type { EChartsCoreOption } from 'echarts/core'
import type { ChartType } from '../types'
import type { ChartOptionContext } from './shared'

export function createTreeOption(
  context: ChartOptionContext,
  type: Extract<ChartType, 'sunburst' | 'treemap'>
): EChartsCoreOption {
  const rows = context.rows.slice(0, 8)

  return {
    ...context.baseOption,
    tooltip: { ...context.baseOption.tooltip, trigger: 'item' },
    series: [
      {
        data: rows.map((item) => ({ name: item.label, value: item.value })),
        itemStyle: { borderColor: 'transparent', borderRadius: 4 },
        label: { color: context.getColor('secondaryText'), fontSize: 11 },
        radius: type === 'sunburst' ? ['18%', '86%'] : undefined,
        roam: false,
        type,
      },
    ],
  }
}

export function createGraphOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 8)

  return {
    ...context.baseOption,
    tooltip: { ...context.baseOption.tooltip, trigger: 'item' },
    series: [
      {
        data: rows.map((item, index) => ({
          name: item.label,
          symbolSize: Math.max(22, 16 + index * 5),
          value: item.value,
        })),
        force: { edgeLength: 72, repulsion: 120 },
        itemStyle: { color: context.widget.accent },
        label: { color: context.getColor('secondaryText'), show: true },
        layout: 'force',
        links: rows.slice(1).map((item, index) => ({
          source: rows[index]?.label ?? '',
          target: item.label,
        })),
        roam: false,
        type: 'graph',
      },
    ],
  }
}

export function createSankeyOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 7)

  return {
    ...context.baseOption,
    tooltip: { ...context.baseOption.tooltip, trigger: 'item' },
    series: [
      {
        data: rows.map((item) => ({ name: item.label })),
        itemStyle: { color: context.widget.accent },
        label: { color: context.getColor('secondaryText'), fontSize: 11 },
        lineStyle: { color: 'gradient', curveness: 0.48 },
        links: rows.slice(1).map((item, index) => ({
          source: rows[index]?.label ?? '',
          target: item.label,
          value: item.value,
        })),
        type: 'sankey',
      },
    ],
  }
}
