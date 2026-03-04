<template>
  <n-card
    :segmented="{ content: true }"
    :header-style="{ padding: 0 }"
    header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
  >
    <template #header>
      <div class="px-20 py-15 text-md font-bold">热门搜索</div>
    </template>
    <div ref="chartRef"></div>
  </n-card>
</template>
<script lang="ts" setup>
import { VChart, type ISpec } from '@visactor/vchart'
const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<VChart | null>()

const data = [
  { type: 'This is a long Auto-Wrap Category Text for Category1', value: 24 },
  { type: 'Category2', value: 20 },
  { type: 'Category3', value: 18 },
  { type: 'Category4', value: 18 },
  { type: 'Category5', value: 16 },
  {
    type: 'This is a long Auto-Wrap Category Text for Category6. This is a long Auto-Wrap Category Text for Category6',
    value: 14,
  },
]
const spec = {
  type: 'pie',
  data: [
    {
      id: 'pie',
      values: data,
    },
  ],
  outerRadius: 0.8,
  innerRadius: 0.5,
  padAngle: 0.6,
  valueField: 'value',
  categoryField: 'type',
  pie: {
    style: {
      cornerRadius: 10,
    },
    state: {
      hover: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1,
      },
      selected: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1,
      },
    },
  },
  legends: {
    visible: true,
  },
  label: {
    visible: true,
    formatMethod: (_, data) => {
      return {
        type: 'rich',
        text: [
          {
            text: `${data?.value}%\n`,
            fill: 'rgba(0, 0, 0, 0.92)',
            fontSize: 16,
            fontWeight: 500,
            stroke: false,
          },
          {
            text: data?.type,
            fill: 'rgba(0, 0, 0, 0.55)',
            fontSize: 12,
            fontWeight: 400,
            stroke: false,
          },
        ],
      }
    },
    style: {
      wordBreak: 'break-word',
      maxHeight: 50,
    },
  },
  tooltip: {
    mark: {
      content: [
        {
          key: (datum) => datum!['type'],
          value: (datum) => datum!['value'] + '%',
        },
      ],
    },
  },
} as ISpec

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
