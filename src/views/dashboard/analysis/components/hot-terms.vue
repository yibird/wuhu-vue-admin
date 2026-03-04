<template>
  <n-card
    :segmented="{ content: true }"
    :header-style="{ padding: 0 }"
    header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
  >
    <template #header>
      <div class="px-20 py-15 text-md font-bold">热门词条</div>
    </template>
    <div ref="chartRef" id="vue-word-cloud" class="w-full min-h-600"></div>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { VChart, type IWordCloudChartSpec } from '@visactor/vchart'

let chart: VChart | null = null
const chartRef = ref<HTMLDivElement>()

function createSpec(): IWordCloudChartSpec {
  return {
    type: 'wordCloud',
    data: {
      id: 'wordCloud',
      name: 'baseData',
      values: [],
    },
    nameField: 'challenge_name',
    valueField: 'sum_count',
    seriesField: 'challenge_name',
    word: {
      formatMethod: (datum) => {
        return `${datum.challenge_name}...`
      },
    },
    title: {
      visible: true,
      text: '',
    },
  } as IWordCloudChartSpec
}

/**
 * 创建或更新图表实例
 */
function createChart() {
  const el = chartRef.value
  if (!el) return
  if (chart) {
    chart.updateSpec(createSpec())
    chart.renderSync()
  } else {
    chart = new VChart(createSpec(), { dom: el })
    chart.renderSync()
  }
}

/**
 * 异步获取数据并更新到图表
 */
async function getData() {
  if (!chart) return
  const url =
    'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/data-wordcloud.json'
  const resp = await fetch(url)
  const data = (await resp.json()) as Array<{
    challenge_name: string
    sum_count: number
  }>
  chart.updateData('wordCloud', data.slice(0, 30))
}

/**
 * 组件挂载时渲染图表
 */
onMounted(() => {
  requestAnimationFrame(() => {
    createChart()
    setTimeout(() => {
      getData()
    }, 1000)
  })
})

/**
 * 组件卸载时释放图表资源
 */
onBeforeUnmount(() => {
  if (chart) {
    chart.release()
    chart = null
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}
.chart-dom {
  width: 100%;
  height: 400px;
}
</style>
