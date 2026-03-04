<template>
  <n-card title="系统监控" body-class="px-10 py-20">
    <template #header-extra>
      <div class="flex items-center gap-10">
        <n-select :options="timeOptions" class="w-180" />
        <n-radio-group v-model:value="value">
          <n-radio-button v-for="item in itemOptions" :key="item.value" :value="item.value">{{
            item.label
          }}</n-radio-button>
        </n-radio-group>
      </div>
    </template>
    <div ref="elRef" class="w-full h-400"></div>
  </n-card>
</template>
<script lang="ts" setup>
  import { VChart, type IAreaChartSpec } from '@visactor/vchart'
  import type { SysMonitorProps } from './types'

  const { data = [] } = defineProps<SysMonitorProps>()
  const chartInstance = ref<VChart>()
  const elRef = ref<HTMLDivElement>()
  const value = ref(1)

  const timeOptions = [
    {
      label: '1小时',
      value: 0
    },
    {
      label: '2小时',
      value: 1
    },
    {
      label: '24小时',
      value: 2
    }
  ]
  const itemOptions = [
    {
      label: 'CPU',
      value: 1
    },
    {
      label: '磁盘IO',
      value: 2
    }
  ]

  function parseSpec(data: SysMonitorProps['data']) {
    return {
      type: 'area',
      data: {
        id: 'monitor-chart',
        values: data
      },
      xField: 'time',
      yField: 'value',
      line: {
        style: {
          curveType: 'monotone',
          stroke: '#1890ff', // 显式设置线条颜色
          lineWidth: 2 // 设置线宽
        }
      }
    } as IAreaChartSpec
  }

  const createChat = (data: SysMonitorProps['data']) => {
    const el = elRef.value
    if (!el) return
    if (!chartInstance.value) {
      chartInstance.value = new VChart(parseSpec(data), { dom: el })
      chartInstance.value.renderSync()
      return
    }
    chartInstance.value.updateSpec(parseSpec(data))
    chartInstance.value.renderSync()
  }

  onMounted(() => {
    createChat(data)
  })

  onUpdated(() => {
    createChat(data)
  })

  onBeforeUnmount(() => {
    chartInstance.value?.release()
  })
</script>
