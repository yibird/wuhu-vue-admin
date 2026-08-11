import type { EChartsCoreOption } from 'echarts/core'
import type { ChartOptionContext } from './shared'

function createCategoryAxes(context: ChartOptionContext, labels: string[]) {
  return {
    grid: { bottom: 34, left: 46, right: 18, top: 18 },
    xAxis: {
      axisLabel: { color: context.getColor('secondaryText'), fontSize: 11 },
      axisLine: { lineStyle: { color: context.getColor('axisLine') } },
      axisTick: { show: false },
      data: labels,
      type: 'category',
    },
    yAxis: {
      axisLabel: { color: context.getColor('secondaryText'), fontSize: 11 },
      axisLine: { show: false },
      splitLine: {
        lineStyle: { color: context.getColor('splitLine'), type: 'dashed' },
      },
      type: 'value',
    },
  }
}

export function createBoxplotOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 8)

  return {
    ...context.baseOption,
    ...createCategoryAxes(
      context,
      rows.map((item) => item.label)
    ),
    series: [
      {
        data: rows.map((item) => {
          const value = item.value
          return [
            Number((value * 0.72).toFixed(2)),
            Number((value * 0.88).toFixed(2)),
            Number(value.toFixed(2)),
            Number((value * 1.12).toFixed(2)),
            Number((value * 1.24).toFixed(2)),
          ]
        }),
        itemStyle: { borderColor: context.widget.accent },
        type: 'boxplot',
      },
    ],
  }
}

export function createCandlestickOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 8).reverse()

  return {
    ...context.baseOption,
    ...createCategoryAxes(
      context,
      rows.map((item) => item.label)
    ),
    series: [
      {
        data: rows.map((item, index) => {
          const open = item.value * (0.92 + index * 0.01)
          const close = item.value * (1.04 - index * 0.006)
          const low = Math.min(open, close) * 0.92
          const high = Math.max(open, close) * 1.08
          return [
            Number(open.toFixed(2)),
            Number(close.toFixed(2)),
            Number(low.toFixed(2)),
            Number(high.toFixed(2)),
          ]
        }),
        itemStyle: {
          borderColor: context.widget.accent,
          borderColor0: '#22c55e',
          color: context.widget.accent,
          color0: '#22c55e',
        },
        type: 'candlestick',
      },
    ],
  }
}
