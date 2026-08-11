<script lang="ts" setup>
import {
  getCssRgbVarAlpha,
  useEChartsTheme,
} from '@/composables/useEChartsTheme'
import { useECharts } from '@/plugins/echarts'
import VChart from 'vue-echarts'
import type { EChartsCoreOption } from 'echarts/core'

useECharts()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const data = [
  { day: '2025-11-01', visit: 120 },
  { day: '2025-11-02', visit: 98 },
  { day: '2025-11-03', visit: 150 },
  { day: '2025-11-04', visit: 80 },
  { day: '2025-11-05', visit: 130 },
  { day: '2025-11-06', visit: 60 },
  { day: '2025-11-07', visit: 90 },
  { day: '2025-11-08', visit: 180 },
  { day: '2025-11-09', visit: 40 },
  { day: '2025-11-10', visit: 240 },
  { day: '2025-11-11', visit: 120 },
  { day: '2025-11-12', visit: 98 },
  { day: '2025-11-13', visit: 150 },
  { day: '2025-11-14', visit: 80 },
  { day: '2025-11-15', visit: 130 },
  { day: '2025-11-16', visit: 60 },
  { day: '2025-11-17', visit: 90 },
  { day: '2025-11-18', visit: 180 },
  { day: '2025-11-19', visit: 40 },
  { day: '2025-11-20', visit: 240 },
  { day: '2025-11-21', visit: 120 },
  { day: '2025-11-22', visit: 98 },
  { day: '2025-11-23', visit: 150 },
  { day: '2025-11-24', visit: 80 },
  { day: '2025-11-25', visit: 130 },
  { day: '2025-11-26', visit: 60 },
  { day: '2025-11-27', visit: 90 },
  { day: '2025-11-28', visit: 180 },
  { day: '2025-11-29', visit: 40 },
]

const chartOption = computed<EChartsCoreOption>(() => ({
  ...baseChartOption.value,
  grid: { bottom: 42, left: 42, right: 18, top: 16 },
  tooltip: {
    ...baseChartOption.value.tooltip,
    trigger: 'axis',
  },
  xAxis: {
    axisLabel: { color: getEChartsColor('secondaryText') },
    axisLine: { lineStyle: { color: getEChartsColor('axisLine') } },
    axisTick: { show: false },
    data: data.map((item) => item.day.slice(5)),
    type: 'category',
  },
  yAxis: {
    axisLabel: { color: getEChartsColor('secondaryText') },
    splitLine: { show: false },
    type: 'value',
  },
  series: [
    {
      barWidth: '46%',
      data: data.map((item) => item.visit),
      itemStyle: {
        borderRadius: [8, 8, 2, 2],
        color: getCssRgbVarAlpha(
          '--w-color-primary',
          0.82,
          'rgba(22, 119, 255, 0.82)'
        ),
      },
      name: '访问量',
      type: 'bar',
    },
  ],
}))
</script>

<template>
  <VChart
    :option="chartOption"
    :theme="eChartsThemeName"
    autoresize
    class="full min-h-0"
  />
</template>
