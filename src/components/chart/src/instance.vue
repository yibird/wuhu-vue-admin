<template>
  <VChart ref="chartRef" v-bind="$attrs" :autoresize="false" />
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts'
import { useResizeObserver } from '@vueuse/core'
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

/**
 * 尺寸真正变化后才重绘
 *
 * ResizeObserver 在挂载时会先回调一次,此时容器尺寸与图表初始尺寸一致;
 * 若不加判断,200ms 后触发的 resize 会打断图表入场动画,表现为动画非常快。
 */
const resizeChart = (entries: ResizeObserverEntry[]) => {
  if (!props.autoresize) return

  const entry = entries[0]
  const chart = chartRef.value?.chart
  if (!entry || !chart) return

  const width = Math.round(entry.contentRect.width)
  const height = Math.round(entry.contentRect.height)
  if (!width || !height) return
  if (
    width === Math.round(chart.getWidth()) &&
    height === Math.round(chart.getHeight())
  ) {
    return
  }

  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    chartRef.value?.chart?.resize()
  }, 200)
}

useResizeObserver(() => chartRef.value?.root, resizeChart)

onBeforeUnmount(() => window.clearTimeout(resizeTimer))
</script>
