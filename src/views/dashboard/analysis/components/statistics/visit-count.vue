<template>
  <div ref="chartRef"></div>
</template>
<script lang="ts" setup>
import { VChart, type ISpec } from '@visactor/vchart'

const spec = {
  type: 'bar',
  data: [
    {
      id: 'data',
      values: [
        { day: '2025-11-01', visit: 120 },
        { day: '2025-11-02', visit: 98 },
        { day: '2025-11-03', visit: 150 },
        { day: '2025-11-04', visit: 80 },
        { day: '2025-11-05', visit: 130 },
        { day: '2025-11-06', visit: 60 },
        { day: '2025-11-07', visit: 90 },
        { day: '2025-11-08', visit: 180 },
        { day: '2025-11-09', visit: 40 },
        { day: '2025-11-10', visit: 240 },
        { day: '2025-11-11', visit: 120 },
        { day: '2025-11-12', visit: 98 },
        { day: '2025-11-13', visit: 150 },
        { day: '2025-11-14', visit: 80 },
        { day: '2025-11-15', visit: 130 },
        { day: '2025-11-16', visit: 60 },
        { day: '2025-11-17', visit: 90 },
        { day: '2025-11-18', visit: 180 },
        { day: '2025-11-19', visit: 40 },
        { day: '2025-11-20', visit: 240 },
        { day: '2025-11-21', visit: 120 },
        { day: '2025-11-22', visit: 98 },
        { day: '2025-11-23', visit: 150 },
        { day: '2025-11-24', visit: 80 },
        { day: '2025-11-25', visit: 130 },
        { day: '2025-11-26', visit: 60 },
        { day: '2025-11-27', visit: 90 },
        { day: '2025-11-28', visit: 180 },
        { day: '2025-11-29', visit: 40 },
      ],
    },
  ],
  xField: 'day',
  yField: 'visit',

  bar: {
    style: {
      cornerRadius: 6,
      fill: {
        gradient: 'linear',
        x0: 0.5, // 从柱子上方
        y0: 0,
        x1: 0.5, // 渐变到底部
        y1: 1,
        stops: [
          { offset: 0, color: '#86DF6C' }, // 顶部颜色
          { offset: 1, color: '#468DFF' }, // 底部颜色
        ],
      },
    },
  },
  axes: [{ orient: 'bottom' }, { orient: 'left', grid: { visible: false } }],
} as ISpec

const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<VChart | null>()

const renderChart = () => {
  const el = chartRef.value
  if (!el || chartInstance.value) return
  chartInstance.value = new VChart(spec, { dom: el })
  chartInstance.value.renderAsync()
}
const destroyChart = () => {
  chartInstance.value?.release()
  chartInstance.value = null
}

onMounted(() => {
  renderChart()
})
onActivated(() => {
  renderChart()
})

onBeforeUnmount(() => {
  destroyChart()
})
onDeactivated(() => {
  destroyChart()
})
</script>
