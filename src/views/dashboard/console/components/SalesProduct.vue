<!-- 成交占比 -->
<template>
  <RoseChart ref="chartRef" v-bind="config" />
</template>
<script setup lang="ts">
  import { RoseChart, RoseChartProps } from '@opd/g2plot-vue';
  import { ref } from 'vue';

  const chartRef = ref(null);
  const config: RoseChartProps = {
    data: [
      { type: '分类一', value: 27 },
      { type: '分类二', value: 25 },
      { type: '分类三', value: 18 },
      { type: '分类四', value: 15 },
      { type: '分类五', value: 10 },
      { type: '其他', value: 5 },
    ],
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    radius: 0.9,
    legend: {
      position: 'bottom',
    },
  };
</script>
