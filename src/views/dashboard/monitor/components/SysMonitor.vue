<script lang="ts" setup>
import { NumberTicker } from '@/components/number-ticker'
import {
  getCssRgbVar,
  getCssRgbVarAlpha,
  useEChartsTheme,
} from '@/composables/useEChartsTheme'
import { useECharts } from '@/plugins/echarts'
import Card from './Card.vue'
import { metricLabels } from '../config'
import VChart from 'vue-echarts'
import type { MonitorMetric, SysMonitorProps } from './types'
import type { EChartsCoreOption } from 'echarts/core'

useECharts()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const props = withDefaults(defineProps<SysMonitorProps>(), {
  data: () => [],
})
const activeMetric = shallowRef<MonitorMetric>('cpu')
const activeRange = shallowRef(12)

const timeOptions = [
  { label: '最近 6 小时', value: 6 },
  { label: '最近 12 小时', value: 12 },
  { label: '最近 24 小时', value: 24 },
]

const metricOptions: Array<{ label: string; value: MonitorMetric }> = [
  { label: 'CPU', value: 'cpu' },
  { label: '内存', value: 'memory' },
  { label: '磁盘 IO', value: 'diskIo' },
  { label: '网络', value: 'network' },
]

const chartBars = [42, 64, 50, 78, 58, 86, 66, 72, 48, 82, 56, 70]

const chartData = computed(() => {
  return props.data.slice(-activeRange.value).map((item) => ({
    time: item.time,
    value: item[activeMetric.value],
    metric: metricLabels[activeMetric.value],
  }))
})

const peakValue = computed(() =>
  chartData.value.reduce((max, item) => Math.max(max, item.value), 0)
)
const averageValue = computed(() => {
  if (!chartData.value.length) return 0
  const total = chartData.value.reduce((sum, item) => sum + item.value, 0)
  return Math.round(total / chartData.value.length)
})
const latestValue = computed(() => chartData.value.at(-1)?.value ?? 0)

const chartOption = computed<EChartsCoreOption>(() => {
  const primaryColor = getCssRgbVar('--w-color-primary', '#1677ff')

  return {
    ...baseChartOption.value,
    grid: { bottom: 36, left: 38, right: 18, top: 18 },
    tooltip: {
      ...baseChartOption.value.tooltip,
      formatter: '{b}<br />{a}: {c}%',
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: { color: getEChartsColor('secondaryText') },
      axisLine: { lineStyle: { color: getEChartsColor('axisLine') } },
      axisTick: { show: false },
      boundaryGap: false,
      data: chartData.value.map((item) => item.time),
      type: 'category',
    },
    yAxis: {
      axisLabel: { color: getEChartsColor('secondaryText') },
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
    series: [
      {
        areaStyle: {
          color: getCssRgbVarAlpha(
            '--w-color-primary',
            0.18,
            'rgba(22, 119, 255, 0.18)'
          ),
        },
        data: chartData.value.map((item) => item.value),
        itemStyle: { color: primaryColor },
        lineStyle: { color: primaryColor, width: 2 },
        name: metricLabels[activeMetric.value],
        showSymbol: false,
        smooth: true,
        type: 'line',
      },
    ],
  }
})
</script>

<template>
  <Card
    v-if="props.loading"
    title="系统监控"
    icon="i-lucide:chart-area"
    description="关键资源使用率趋势"
    body-class="p-0"
  >
    <div class="grid grid-cols-3 border-b-1 border-b-solid border-color-2">
      <div v-for="item in 3" :key="item" class="px-16 py-12">
        <a-skeleton-input active size="small" class="!w-46" />
        <a-skeleton-input active class="!mt-6 !w-72" />
      </div>
    </div>
    <div class="h-360 p-16 max-md:h-280">
      <div class="h-full flex items-end gap-10">
        <div
          v-for="height in chartBars"
          :key="height"
          class="flex-1 rounded-t-6 bg-fill-tertiary"
          :style="{ height: `${height}%` }"
        />
      </div>
    </div>
  </Card>
  <Card
    v-else
    title="系统监控"
    icon="i-lucide:chart-area"
    description="关键资源使用率趋势"
    body-class="p-0"
  >
    <template #extra>
      <div class="flex items-center gap-8 max-lg:flex-col max-lg:items-end">
        <a-select
          v-model:value="activeRange"
          :options="timeOptions"
          class="w-138"
        />
        <a-segmented v-model:value="activeMetric" :options="metricOptions" />
      </div>
    </template>

    <div
      class="grid grid-cols-3 gap-0 border-b-1 border-b-solid border-color-2"
    >
      <div class="min-w-0 px-16 py-12">
        <div class="text-xs text-secondary">当前</div>
        <div class="mt-4 text-lg text-main font-700">
          <NumberTicker :value="latestValue" :duration="750" suffix="%" />
        </div>
      </div>
      <div class="min-w-0 border-x-1 border-x-solid border-color-2 px-16 py-12">
        <div class="text-xs text-secondary">峰值</div>
        <div class="mt-4 text-lg text-main font-700">
          <NumberTicker :value="peakValue" :duration="750" suffix="%" />
        </div>
      </div>
      <div class="min-w-0 px-16 py-12">
        <div class="text-xs text-secondary">均值</div>
        <div class="mt-4 text-lg text-main font-700">
          <NumberTicker :value="averageValue" :duration="750" suffix="%" />
        </div>
      </div>
    </div>
    <div class="h-360 w-full max-md:h-280">
      <VChart
        :option="chartOption"
        :theme="eChartsThemeName"
        autoresize
        class="full min-h-0"
      />
    </div>
  </Card>
</template>
