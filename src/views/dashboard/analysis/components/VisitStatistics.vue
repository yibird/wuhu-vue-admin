<script lang="ts" setup>
import VChart from 'vue-echarts'
import Card from './Card.vue'
import {
  getCssRgbVar,
  getCssRgbVarAlpha,
  useEChartsTheme,
} from '@/composables/useEChartsTheme'
import { useDashboardECharts } from '@/plugins/echartsDashboard'
import type { EChartsCoreOption } from 'echarts/core'

useDashboardECharts()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const dataSource = [
  { date: '2024-10-01', value: 3 },
  { date: '2024-10-02', value: 4 },
  { date: '2024-10-03', value: 100 },
  { date: '2024-10-04', value: 5 },
  { date: '2024-10-05', value: 60 },
  { date: '2024-10-06', value: 6 },
  { date: '2024-10-07', value: 7 },
  { date: '2024-10-08', value: 2 },
  { date: '2024-10-09', value: 113 },
]
const chartOption = computed<EChartsCoreOption>(() => ({
  ...baseChartOption.value,
  grid: { bottom: 38, left: 42, right: 18, top: 16 },
  tooltip: {
    ...baseChartOption.value.tooltip,
    trigger: 'axis',
  },
  xAxis: {
    axisLabel: { color: getEChartsColor('secondaryText') },
    axisLine: { lineStyle: { color: getEChartsColor('axisLine') } },
    axisTick: { show: false },
    boundaryGap: false,
    data: dataSource.map((item) => item.date.slice(5)),
    type: 'category',
  },
  yAxis: {
    axisLabel: { color: getEChartsColor('secondaryText') },
    axisLine: { show: false },
    splitLine: {
      lineStyle: {
        color: getCssRgbVarAlpha(
          '--w-border-color-2',
          0.64,
          'rgba(148, 163, 184, 0.18)'
        ),
      },
    },
    type: 'value',
  },
  series: [
    {
      areaStyle: {
        color: getCssRgbVarAlpha(
          '--w-color-primary',
          0.16,
          'rgba(22, 119, 255, 0.16)'
        ),
      },
      data: dataSource.map((item) => item.value),
      itemStyle: { color: getCssRgbVar('--w-color-primary', '#1677ff') },
      lineStyle: {
        color: getCssRgbVar('--w-color-primary', '#1677ff'),
        width: 2,
      },
      name: '访问',
      showSymbol: false,
      smooth: true,
      type: 'line',
    },
  ],
}))
</script>

<template>
  <Card
    title="最近访问"
    icon="i-lucide:chart-area"
    description="近 9 日访问趋势"
    body-class="p-0"
  >
    <div class="h-380 w-full p-12 max-md:h-260">
      <VChart
        :option="chartOption"
        :theme="eChartsThemeName"
        autoresize
        class="full min-h-0"
      />
    </div>
  </Card>
</template>
