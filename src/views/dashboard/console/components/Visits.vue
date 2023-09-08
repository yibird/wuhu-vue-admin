<!-- 访问量 -->
<template>
  <ColumnChart ref="chartRef" v-bind="config" />
</template>
<script setup lang="ts">
  import { ColumnChart, ColumnChartProps } from '@opd/g2plot-vue';
  import { Datum } from '@antv/g2plot';
  import { ref } from 'vue';

  let chartRef = ref(null);
  const data = [
    { type: '1-3秒', value: 0.16 },
    { type: '4-10秒', value: 0.125 },
    { type: '11-30秒', value: 0.24 },
    { type: '31-60秒', value: 0.19 },
    { type: '1-3分', value: 0.22 },
    { type: '3-10分', value: 0.05 },
    { type: '10-30分', value: 0.01 },
    { type: '30+分', value: 0.015 },
  ];
  const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';
  const config: ColumnChartProps = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    color: ({ type }) => {
      if (type === '10-30分' || type === '30+分') {
        return paletteSemanticRed;
      }
      return brandColor;
    },
    label: {
      content: (originData: Datum) => {
        const val = parseFloat(originData.value);
        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
        return originData.value;
      },
      offset: 10,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    height: 300,
  };
</script>
