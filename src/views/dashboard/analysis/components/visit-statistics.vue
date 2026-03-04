<template>
  <n-card
    :segmented="{ content: true }"
    :header-style="{ padding: 0 }"
    header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
  >
    <template #header>
      <div class="px-20 py-15 text-md font-bold">最近访问</div>
    </template>
    <div ref="chartRef"></div>
  </n-card>
</template>
<script lang="ts" setup>
import { VChart, type ISpec } from '@visactor/vchart'

const dataSource = [
  { date: '2024-10-01', value: 3 },
  { date: '2024-10-02', value: 4 },
  { date: '2024-10-03', value: 100 },
  { date: '2024-10-04', value: 5 },
  { date: '2024-10-05', value: 60 },
  { date: '2024-10-06', value: 6 },
  { date: '2024-10-07', value: 7 },
  { date: '2024-10-08', value: 2 },
  { date: '2024-10-09', value: 113 },
]
const spec = {
  type: 'area',
  data: {
    id: 'recentlyVisite',
    values: dataSource,
  },
  xField: 'date',
  yField: 'value',
  line: {
    style: {
      curveType: 'monotone',
    },
  },
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
