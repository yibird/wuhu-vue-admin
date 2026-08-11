import type { EChartsCoreOption } from 'echarts/core'
import type { ChartOptionContext } from './shared'

export function createPieOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 6)

  return {
    ...context.baseOption,
    legend: {
      bottom: 0,
      icon: 'circle',
      itemHeight: 8,
      itemWidth: 8,
      textStyle: { color: context.getColor('secondaryText'), fontSize: 11 },
    },
    tooltip: { ...context.baseOption.tooltip, trigger: 'item' },
    series: [
      {
        avoidLabelOverlap: true,
        center: ['50%', '44%'],
        data: rows.map((item) => ({ name: item.label, value: item.value })),
        itemStyle: {
          borderColor: 'transparent',
          borderRadius: 6,
          borderWidth: 2,
        },
        label: { color: context.getColor('secondaryText'), formatter: '{b}' },
        radius: ['48%', '70%'],
        type: 'pie',
      },
    ],
  }
}

export function createFunnelOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 7).reverse()

  return {
    ...context.baseOption,
    tooltip: { ...context.baseOption.tooltip, trigger: 'item' },
    series: [
      {
        bottom: 12,
        data: rows.map((item) => ({ name: item.label, value: item.value })),
        gap: 3,
        itemStyle: { borderColor: 'transparent', borderWidth: 1 },
        label: { color: context.getColor('secondaryText'), fontSize: 11 },
        left: 24,
        maxSize: '92%',
        minSize: '28%',
        right: 24,
        sort: 'ascending',
        top: 12,
        type: 'funnel',
      },
    ],
  }
}

export function createGaugeOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const value = context.rows[0]?.value ?? 0
  const maxValue = Math.max(...context.rows.map((item) => item.value), value, 1)

  return {
    ...context.baseOption,
    series: [
      {
        axisLabel: { color: context.getColor('secondaryText'), fontSize: 10 },
        axisLine: { lineStyle: { width: 10 } },
        data: [
          { name: context.widget.measure, value: Number(value.toFixed(2)) },
        ],
        detail: {
          color: context.getColor('primaryText'),
          fontSize: 18,
          formatter: `{value}`,
        },
        max: maxValue,
        pointer: { width: 4 },
        progress: { show: true, width: 10 },
        type: 'gauge',
      },
    ],
  }
}

export function createRadarOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 6)
  const maxValue = Math.max(...rows.map((item) => item.value), 1)

  return {
    ...context.baseOption,
    radar: {
      axisName: { color: context.getColor('secondaryText'), fontSize: 11 },
      indicator: rows.map((item) => ({ max: maxValue, name: item.label })),
      splitArea: { areaStyle: { color: ['transparent'] } },
      splitLine: { lineStyle: { color: context.getColor('splitLine') } },
    },
    series: [
      {
        areaStyle: { color: `${context.widget.accent}22` },
        data: [
          { name: context.widget.title, value: rows.map((item) => item.value) },
        ],
        itemStyle: { color: context.widget.accent },
        lineStyle: { color: context.widget.accent, width: 2 },
        type: 'radar',
      },
    ],
  }
}
