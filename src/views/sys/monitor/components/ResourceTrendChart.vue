<template>
  <div
    class="overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12"
  >
    <div class="flex flex-wrap items-start justify-between gap-10">
      <div class="min-w-0">
        <div class="text-sm text-main font-700">资源使用趋势</div>
        <div class="mt-3 text-xs text-secondary">
          CPU、内存和磁盘使用率 · 最近 {{ pointCount }} 个采样点
        </div>
      </div>
      <span
        class="inline-flex shrink-0 items-center gap-5 rounded-999 bg-primary-tint px-7 py-3 text-xs text-primary"
      >
        <Icon name="i-lucide:activity" :size="13" />
        实时采样
      </span>
    </div>
    <div class="h-280 w-full pt-8 max-md:h-240">
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
import type { MonitorTone, ResourceMetric } from './types'

useDashboardECharts()

const props = defineProps<{
  resources: ResourceMetric[]
}>()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const resourceIds = ['cpu', 'memory', 'disk'] as const
const toneColorVars: Record<MonitorTone, string> = {
  primary: '--w-color-primary',
  success: '--w-color-success',
  warning: '--w-color-warning',
  error: '--w-color-error',
  info: '--w-color-info',
}
const toneFallbackColors: Record<MonitorTone, string> = {
  primary: '#1677ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1677ff',
}
const toneFallbackAlphaColors: Record<MonitorTone, string> = {
  primary: 'rgba(22, 119, 255, 0.08)',
  success: 'rgba(82, 196, 26, 0.08)',
  warning: 'rgba(250, 173, 20, 0.08)',
  error: 'rgba(255, 77, 79, 0.08)',
  info: 'rgba(22, 119, 255, 0.08)',
}

const chartResources = computed(() =>
  resourceIds
    .map((id) => props.resources.find((item) => item.id === id))
    .filter((item): item is ResourceMetric => Boolean(item))
)
const pointCount = computed(() =>
  chartResources.value.reduce(
    (max, resource) => Math.max(max, resource.chart.length),
    0
  )
)
const timeLabels = computed(() =>
  Array.from({ length: pointCount.value }, (_, index) => {
    const remaining = pointCount.value - index - 1
    return remaining === 0 ? '现在' : `${remaining}h前`
  })
)

function getResourceColor(resource: ResourceMetric) {
  return getCssRgbVar(
    toneColorVars[resource.tone],
    toneFallbackColors[resource.tone]
  )
}

function getResourceColorAlpha(resource: ResourceMetric, alpha: number) {
  return getCssRgbVarAlpha(
    toneColorVars[resource.tone],
    alpha,
    toneFallbackAlphaColors[resource.tone]
  )
}

const chartOption = computed<EChartsCoreOption>(() => ({
  ...baseChartOption.value,
  animationDuration: 420,
  animationEasing: 'cubicOut',
  grid: { bottom: 30, left: 38, right: 18, top: 42 },
  legend: {
    data: chartResources.value.map((resource) => resource.title),
    itemHeight: 8,
    itemWidth: 8,
    right: 0,
    textStyle: { color: getEChartsColor('secondaryText') },
    top: 0,
    type: 'scroll',
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
    data: timeLabels.value,
    type: 'category',
  },
  yAxis: {
    axisLabel: {
      color: getEChartsColor('secondaryText'),
      formatter: '{value}%',
    },
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
  series: chartResources.value.map((resource) => {
    const color = getResourceColor(resource)
    return {
      areaStyle: {
        color: getResourceColorAlpha(resource, 0.08),
      },
      data: resource.chart,
      emphasis: { focus: 'series' },
      itemStyle: { color },
      lineStyle: { color, width: 2 },
      name: resource.title,
      showSymbol: false,
      smooth: 0.25,
      tooltip: { valueFormatter: (value: string | number) => `${value}%` },
      type: 'line',
    }
  }),
}))
</script>
