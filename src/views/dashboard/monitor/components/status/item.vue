<template>
  <div className="flex flex-col items-center text-center overflow-hidden">
    <div className="m-auto" ref="elRef"> </div>
    <div className="text-primary text-sm">{{ item.description }}</div>
  </div>
</template>
<script lang="ts" setup>
  import { VChart, registerLiquidChart } from '@visactor/vchart'
  import type { StatusItemProps } from '../types'
  registerLiquidChart()

  const { item } = defineProps<StatusItemProps>()
  const chartInstance = ref<VChart>()
  const elRef = ref<HTMLDivElement>()

  const spec = {
    type: 'liquid',
    valueField: 'value',
    data: {
      id: item.id,
      values: [
        {
          value: item.value / 100
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
          text: item.title,
          fontSize: 26
        }
      },
      content: [
        {
          visible: true,
          style: {
            fill: 'black',
            text: `${item.value}%`,
            lineHeight: 32
          }
        }
      ]
    }
  }

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
