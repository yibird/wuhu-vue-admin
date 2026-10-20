<template>
  <VChart ref="chartRef" v-bind="$attrs" :autoresize="false" />
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts'
import { useResizeObserver } from '@vueuse/core'
import { useECharts } from './hooks'
import type { EChartsType } from 'echarts/core'

defineOptions({
  inheritAttrs: false,
})

interface ChartProps {
  /**
   * @desc 是否跟随容器尺寸变化自动重绘
   * @default true
   */
  autoresize?: boolean
}

const props = withDefaults(defineProps<ChartProps>(), {
  autoresize: true,
})

const chartRef = useTemplateRef<{
  root?: HTMLElement
  chart?: EChartsType
}>('chartRef')

/**
 * 容器尺寸稳定后再重绘
 *
 * 不用 vue-echarts 自带的 autoresize:它按节流(默认 100ms)触发,
 * 侧边栏折叠、抽屉展开这类宽度动画期间会反复全量重绘图表,造成明显掉帧。
 * 这里改为去抖:连续尺寸变化只在停下来后重绘一次。
 */
let resizeTimer = 0

const resizeChart = () => {
  if (!props.autoresize) return
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    chartRef.value?.chart?.resize()
  }, 200)
}

useResizeObserver(() => chartRef.value?.root, resizeChart)

onBeforeUnmount(() => window.clearTimeout(resizeTimer))

useECharts()
</script>
