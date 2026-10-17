<template>
  <Chart
    :option="chartOption"
    :theme="eChartsThemeName"
    autoresize
    class="full min-h-0"
  />
</template>
<script lang="ts" setup>
import { getCssRgbVarAlpha, useEChartsTheme } from '@/components/chart'
import { Chart } from '@/components'
import { bucketValue, buildBuckets } from './data'
import type { StatisticsChartProps } from './types'
import type { EChartsCoreOption } from 'echarts/core'

const props = defineProps<StatisticsChartProps>()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const countries = [
  { name: 'China', base: 5200, amplitude: 3800 },
  { name: 'USA', base: 6400, amplitude: 4600 },
  { name: 'EU', base: 3600, amplitude: 2600 },
  { name: 'Africa', base: 2400, amplitude: 1800 },
]

const buckets = computed(() => (props.range ? buildBuckets(props.range) : []))

const chartOption = computed<EChartsCoreOption>(() => {
  return {
    ...baseChartOption.value,
    grid: {
      bottom: 58,
      left: 52,
      right: 18,
      top: 18,
    },
    legend: {
      bottom: 8,
      itemHeight: 8,
      itemWidth: 8,
      textStyle: { color: getEChartsColor('secondaryText') },
    },
    tooltip: {
      ...baseChartOption.value.tooltip,
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: { color: getEChartsColor('secondaryText') },
      axisLine: { lineStyle: { color: getEChartsColor('axisLine') } },
      axisTick: { show: false },
      boundaryGap: false,
      data: buckets.value.map((bucket) => bucket.label),
      type: 'category',
    },
    yAxis: {
      axisLabel: { color: getEChartsColor('secondaryText') },
      axisLine: { show: false },
      splitLine: {
        lineStyle: {
          color: getCssRgbVarAlpha(
            '--w-border-color-2',
            0.6,
            'rgba(148, 163, 184, 0.18)'
          ),
        },
      },
      type: 'value',
    },
    series: countries.map((country) => ({
      areaStyle: { opacity: 0.16 },
      data: buckets.value.map((bucket) =>
        bucketValue(
          `${country.name}:${bucket.seed}`,
          country.base,
          country.amplitude
        )
      ),
      emphasis: { focus: 'series' },
      lineStyle: { width: 2 },
      name: country.name,
      showSymbol: false,
      smooth: true,
      stack: 'total',
      type: 'line',
    })),
  }
})
</script>
