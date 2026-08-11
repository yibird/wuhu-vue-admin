<script lang="ts" setup>
import { useEChartsTheme } from '@/composables/useEChartsTheme'
import { useECharts } from '@/plugins/echarts'
import Card from './Card.vue'
import VChart from 'vue-echarts'
import type { EChartsCoreOption } from 'echarts/core'

useECharts()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const data = [
  { type: '智能报表', value: 24 },
  { type: '工作流', value: 20 },
  { type: '低代码', value: 18 },
  { type: '任务中心', value: 18 },
  { type: '文件管理', value: 16 },
  { type: '系统监控', value: 14 },
]

const chartOption = computed<EChartsCoreOption>(() => ({
  ...baseChartOption.value,
  legend: {
    bottom: 8,
    icon: 'circle',
    textStyle: { color: getEChartsColor('secondaryText') },
  },
  tooltip: {
    ...baseChartOption.value.tooltip,
    formatter: '{b}: {c}%',
    trigger: 'item',
  },
  series: [
    {
      avoidLabelOverlap: true,
      data: data.map((item) => ({ name: item.type, value: item.value })),
      emphasis: {
        itemStyle: {
          shadowBlur: 18,
          shadowColor: 'rgba(15, 23, 42, 0.18)',
        },
      },
      itemStyle: {
        borderColor: 'rgba(255, 255, 255, 0.72)',
        borderRadius: 8,
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      name: '搜索占比',
      radius: ['48%', '72%'],
      top: -8,
      type: 'pie',
    },
  ],
}))
</script>

<template>
  <Card
    title="热门搜索"
    icon="i-lucide:search"
    description="搜索占比分布"
    body-class="p-0"
  >
    <div class="h-320 w-full p-12 max-md:h-280">
      <VChart
        :option="chartOption"
        :theme="eChartsThemeName"
        autoresize
        class="full min-h-0"
      />
    </div>
  </Card>
</template>
