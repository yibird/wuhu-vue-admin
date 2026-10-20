<template>
  <div class="w-full min-w-0" :style="{ height: `${height}px` }">
    <Chart
      :option="chartOption"
      :theme="EChartsTheme"
      autoresize
      class="full min-h-0"
    />
  </div>
</template>

<script lang="ts" setup>
import { Chart } from '@/components'

import { useChartAdapter } from '../../json-render/chart-adapter'
import { useEChartsTheme } from '@/components/chart'
import type { AiChartType } from '../../json-render/catalog'

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

const { EChartsTheme } = useEChartsTheme()
const toChartOption = useChartAdapter()

const chartOption = computed(() =>
  toChartOption({
    type: props.type,
    rows: props.rows,
    title: props.title,
  })
)
</script>
