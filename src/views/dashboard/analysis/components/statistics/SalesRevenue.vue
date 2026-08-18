<script lang="ts" setup>
import {
  getCssRgbVarAlpha,
  useEChartsTheme,
} from '@/composables/useEChartsTheme'
import { useDashboardECharts } from '@/plugins/echartsDashboard'
import VChart from 'vue-echarts'
import type { EChartsCoreOption } from 'echarts/core'

useDashboardECharts()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const data = [
  { type: 'Nail polish', country: 'Africa', value: 4229 },
  { type: 'Nail polish', country: 'EU', value: 4376 },
  { type: 'Nail polish', country: 'China', value: 3054 },
  { type: 'Nail polish', country: 'USA', value: 12814 },
  { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
  { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
  { type: 'Eyebrow pencil', country: 'China', value: 5067 },
  { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
  { type: 'Rouge', country: 'Africa', value: 5221 },
  { type: 'Rouge', country: 'EU', value: 3574 },
  { type: 'Rouge', country: 'China', value: 7004 },
  { type: 'Rouge', country: 'USA', value: 11624 },
  { type: 'Lipstick', country: 'Africa', value: 9256 },
  { type: 'Lipstick', country: 'EU', value: 4376 },
  { type: 'Lipstick', country: 'China', value: 9054 },
  { type: 'Lipstick', country: 'USA', value: 8814 },
  { type: 'Eyeshadows', country: 'Africa', value: 3308 },
  { type: 'Eyeshadows', country: 'EU', value: 4572 },
  { type: 'Eyeshadows', country: 'China', value: 12043 },
  { type: 'Eyeshadows', country: 'USA', value: 12998 },
  { type: 'Eyeliner', country: 'Africa', value: 5432 },
  { type: 'Eyeliner', country: 'EU', value: 3417 },
  { type: 'Eyeliner', country: 'China', value: 15067 },
  { type: 'Eyeliner', country: 'USA', value: 12321 },
  { type: 'Foundation', country: 'Africa', value: 13701 },
  { type: 'Foundation', country: 'EU', value: 5231 },
  { type: 'Foundation', country: 'China', value: 10119 },
  { type: 'Foundation', country: 'USA', value: 10342 },
  { type: 'Lip gloss', country: 'Africa', value: 4008 },
  { type: 'Lip gloss', country: 'EU', value: 4572 },
  { type: 'Lip gloss', country: 'China', value: 12043 },
  { type: 'Lip gloss', country: 'USA', value: 22998 },
  { type: 'Mascara', country: 'Africa', value: 18712 },
  { type: 'Mascara', country: 'EU', value: 6134 },
  { type: 'Mascara', country: 'China', value: 10419 },
  { type: 'Mascara', country: 'USA', value: 11261 },
]

const productTypes = [...new Set(data.map((item) => item.type))]
const countries = ['China', 'USA', 'EU', 'Africa'] as const

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
      data: productTypes,
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
      data: productTypes.map(
        (type) =>
          data.find((item) => item.type === type && item.country === country)
            ?.value ?? 0
      ),
      emphasis: { focus: 'series' },
      lineStyle: { width: 2 },
      name: country,
      showSymbol: false,
      smooth: true,
      stack: 'total',
      type: 'line',
    })),
  }
})
</script>

<template>
  <VChart
    :option="chartOption"
    :theme="eChartsThemeName"
    autoresize
    class="full min-h-0"
  />
</template>
