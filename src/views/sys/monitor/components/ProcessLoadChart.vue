<template>
  <div
    class="mt-12 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12"
  >
    <div class="flex flex-wrap items-start justify-between gap-10">
      <div class="min-w-0">
        <div class="text-sm text-main font-700">进程负载对比</div>
        <div class="mt-3 text-xs text-secondary">当前 CPU 与堆内存使用率</div>
      </div>
      <span class="text-xs text-secondary">单位：%</span>
    </div>
    <div class="h-240 w-full pt-8 max-md:h-220">
      <VChart
        :option="chartOption"
        :theme="eChartsThemeName"
        autoresize
        class="full min-h-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import type { EChartsCoreOption } from 'echarts/core'
import { getCssRgbVar, getCssRgbVarAlpha, useEChartsTheme } from '@/composables'
import { useDashboardECharts } from '@/plugins/echartsDashboard'
import type { ProcessMetric } from './types'

useDashboardECharts()

const props = defineProps<{
  processes: ProcessMetric[]
}>()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const chartOption = computed<EChartsCoreOption>(() => {
  const primaryColor = getCssRgbVar('--w-color-primary', '#1677ff')
  const warningColor = getCssRgbVar('--w-color-warning', '#faad14')

  return {
    ...baseChartOption.value,
    animationDuration: 360,
    animationEasing: 'cubicOut',
    grid: { bottom: 28, left: 92, right: 18, top: 40 },
    legend: {
      data: ['CPU', '堆内存'],
      itemHeight: 8,
      itemWidth: 8,
      right: 0,
      textStyle: { color: getEChartsColor('secondaryText') },
      top: 0,
    },
    tooltip: {
      ...baseChartOption.value.tooltip,
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: {
        color: getEChartsColor('secondaryText'),
        formatter: '{value}%',
      },
      axisLine: { lineStyle: { color: getEChartsColor('axisLine') } },
      axisTick: { show: false },
      max: 100,
      splitLine: {
        lineStyle: {
          color: getCssRgbVarAlpha(
            '--w-border-color-2',
            0.62,
            'rgba(148, 163, 184, 0.18)'
          ),
        },
      },
      type: 'value',
    },
    yAxis: {
      axisLabel: {
        color: getEChartsColor('secondaryText'),
        overflow: 'truncate',
        width: 78,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      data: props.processes.map((process) => process.name),
      type: 'category',
    },
    series: [
      {
        barMaxWidth: 10,
        data: props.processes.map((process) => process.cpu),
        itemStyle: { borderRadius: 2, color: primaryColor },
        name: 'CPU',
        type: 'bar',
      },
      {
        barMaxWidth: 10,
        data: props.processes.map((process) => process.heap),
        itemStyle: { borderRadius: 2, color: warningColor },
        name: '堆内存',
        type: 'bar',
      },
    ],
  }
})
</script>
