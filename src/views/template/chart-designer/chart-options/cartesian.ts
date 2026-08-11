import type { EChartsCoreOption } from 'echarts/core'
import type { ChartType } from '../types'
import type { ChartOptionContext } from './shared'

export function createCartesianOption(
  context: ChartOptionContext,
  type: Extract<ChartType, 'area' | 'bar' | 'heatmap' | 'line' | 'scatter'>
): EChartsCoreOption {
  const rows = context.rows.slice(0, 8).reverse()
  const isBar = type === 'bar'
  const isArea = type === 'area'
  const isHeatmap = type === 'heatmap'
  const seriesData = rows.map((item, index) =>
    isHeatmap ? [index, 0, item.value] : item.value
  )

  return {
    ...context.baseOption,
    grid: { bottom: isHeatmap ? 40 : 34, left: 48, right: 18, top: 18 },
    visualMap: isHeatmap
      ? {
          bottom: 0,
          calculable: false,
          inRange: { color: ['#dbeafe', context.widget.accent] },
          left: 'center',
          max: Math.max(...rows.map((item) => item.value), 1),
          min: 0,
          orient: 'horizontal',
          show: false,
        }
      : undefined,
    xAxis: {
      axisLabel: { color: context.getColor('secondaryText'), fontSize: 11 },
      axisLine: { lineStyle: { color: context.getColor('axisLine') } },
      axisTick: { show: false },
      data: rows.map((item) => item.label),
      type: 'category',
    },
    yAxis: {
      axisLabel: { color: context.getColor('secondaryText'), fontSize: 11 },
      axisLine: { show: false },
      data: isHeatmap ? ['热度'] : undefined,
      splitLine: {
        lineStyle: { color: context.getColor('splitLine'), type: 'dashed' },
      },
      type: isHeatmap ? 'category' : 'value',
    },
    series: [
      {
        areaStyle: isArea
          ? {
              color: {
                colorStops: [
                  { color: `${context.widget.accent}55`, offset: 0 },
                  { color: `${context.widget.accent}08`, offset: 1 },
                ],
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
              },
            }
          : undefined,
        barMaxWidth: isBar ? 34 : undefined,
        data: seriesData,
        itemStyle: {
          borderRadius: isBar ? [5, 5, 0, 0] : undefined,
          color: context.widget.accent,
        },
        lineStyle: { color: context.widget.accent, width: 2 },
        smooth: type === 'line' || isArea,
        symbol: isBar || isHeatmap ? 'none' : 'circle',
        symbolSize: type === 'scatter' ? 12 : 6,
        type: isArea ? 'line' : type,
      },
    ],
  }
}

export function createPictorialBarOption(
  context: ChartOptionContext
): EChartsCoreOption {
  const rows = context.rows.slice(0, 8).reverse()

  return {
    ...context.baseOption,
    grid: { bottom: 34, left: 48, right: 18, top: 18 },
    xAxis: {
      axisLabel: { color: context.getColor('secondaryText'), fontSize: 11 },
      axisLine: { lineStyle: { color: context.getColor('axisLine') } },
      axisTick: { show: false },
      data: rows.map((item) => item.label),
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
    series: [
      {
        data: rows.map((item) => item.value),
        itemStyle: { color: context.widget.accent },
        symbol: 'roundRect',
        symbolRepeat: true,
        symbolSize: [12, 6],
        type: 'pictorialBar',
      },
    ],
  }
}
