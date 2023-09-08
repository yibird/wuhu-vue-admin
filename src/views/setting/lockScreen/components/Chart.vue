<template>
  <div class="my-[20px]">
    <LiquidChart ref="chartRef" v-bind="config" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { LiquidChart, LiquidChartProps } from '@opd/g2plot-vue';
  const chartRef = ref(null);
  const config: LiquidChartProps = {
    percent: 0.25,
    shape: 'rect',
    outline: {
      border: 2,
      distance: 4,
    },
    wave: {
      length: 128,
    },
    height: 360,
  };
</script>
