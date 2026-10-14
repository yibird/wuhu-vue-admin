<script lang="ts" setup>
import VChart from 'vue-echarts'
import { useECharts } from '@/plugins/echarts'
import { useChartAdapter } from '../../json-render/chart-adapter'
import { useEChartsTheme } from '@/theme'
import type { AiChartType } from '../../json-render/catalog'

defineOptions({ name: 'ChartBlock' })

const props = withDefaults(
  defineProps<{
    type: AiChartType
    rows: Array<{ label: string; value: number }>
    title?: string
    /**
     * @desc 图表高度像素值
     * @default 280
     */
    height?: number
  }>(),
  { height: 280 }
)

useECharts()

const { eChartsThemeName } = useEChartsTheme()
const toChartOption = useChartAdapter()

const chartOption = computed(() =>
  toChartOption({
    type: props.type,
    rows: props.rows,
    title: props.title,
  })
)
</script>

<template>
  <div class="w-full min-w-0" :style="{ height: `${height}px` }">
    <VChart
      :option="chartOption"
      :theme="eChartsThemeName"
      autoresize
      class="full min-h-0"
    />
  </div>
</template>
