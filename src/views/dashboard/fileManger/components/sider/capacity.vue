<template>
  <div class="bg-white rounded-2">
    <div className="flex! justify-center" ref="elRef"> </div>
  </div>
</template>
<script lang="ts" setup>
  import { VChart, registerLiquidChart } from '@visactor/vchart'
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  registerLiquidChart()

  const spec = {
    type: 'liquid',
    valueField: 'value',
    data: {
      id: 'chart',
      values: [
        {
          value: 3 / 100
        }
      ]
    },
    width: 200,
    height: 200,
    color: ['#1664ff', '#737bf2'],
    indicator: {
      visible: true,
      title: {
        visible: true,
        style: {
          text: '容量',
          fontSize: 26
        }
      },
      content: [
        {
          visible: true,
          style: {
            fill: 'black',
            text: `0.3%`,
            lineHeight: 32
          }
        }
      ]
    }
  }

  const chartInstance = ref<VChart>()
  const elRef = ref<HTMLDivElement>()

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    chartInstance.value = new VChart(spec, { dom: el })
    chartInstance.value.renderSync()
  })
  onBeforeUnmount(() => {
    chartInstance.value?.release()
  })
</script>
