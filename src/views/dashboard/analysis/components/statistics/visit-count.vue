<script lang="ts" setup>
import { getCssRgbVarAlpha, useEChartsTheme } from '@/theme'
import VChart from 'vue-echarts'
import { bucketValue, buildBuckets } from './data'
import type { StatisticsChartProps } from './types'
import type { EChartsCoreOption } from 'echarts/core'

const props = defineProps<StatisticsChartProps>()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const buckets = computed(() => (props.range ? buildBuckets(props.range) : []))

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
    data: buckets.value.map((bucket) => bucket.label),
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
      data: buckets.value.map((bucket) =>
        bucketValue(`visit:${bucket.seed}`, 140, 160)
      ),
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
