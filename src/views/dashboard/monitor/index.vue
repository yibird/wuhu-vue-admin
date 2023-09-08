<template>
  <a-space direction="vertical" class="w-full">
    <a-row :gutter="10">
      <a-col :span="6" v-for="item in charts">
        <div class="bg-white p-10 rounded-[2px]">
          <component :is="item.component" v-bind="item.config" />
        </div>
      </a-col>
    </a-row>
    <div class="bg-white rounded-[2px]">
      <TinyAreaChart v-bind="areaChartConfig" />
    </div>
  </a-space>
</template>
<script setup lang="ts">
  import {
    LiquidChart,
    LiquidChartProps,
    GaugeChart,
    GaugeChartProps,
    TinyAreaChart,
    TinyAreaChartProps,
  } from '@opd/g2plot-vue';
  const charts = [
    {
      component: LiquidChart,
      config: {
        percent: 0.25,
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
        height: 300,
      },
    },
    {
      component: GaugeChart,
      config: {
        percent: 0.75,
        type: 'meter',
        innerRadius: 0.75,
        range: {
          ticks: [0, 1 / 3, 2 / 3, 1],
          color: ['#F4664A', '#FAAD14', '#30BF78'],
        },
        indicator: {
          pointer: {
            style: {
              stroke: '#D0D0D0',
            },
          },
          pin: {
            style: {
              stroke: '#D0D0D0',
            },
          },
        },
        statistic: {
          content: {
            style: {
              fontSize: '36px',
              lineHeight: '36px',
            },
          },
        },
        height: 300,
      },
    },
    {
      component: LiquidChart,
      config: {
        percent: 0.25,
        shape: 'rect',
        outline: {
          border: 2,
          distance: 4,
        },
        wave: {
          length: 128,
        },
        height: 300,
      },
    },
    {
      component: LiquidChart,
      config: {
        percent: 0.25,
        shape: function (x: number, y: number, width: number, height: number) {
          const r = width / 4;
          const dx = x - width / 2;
          const dy = y - height / 2;
          return [
            ['M', dx, dy + r * 2],
            ['A', r, r, 0, 0, 1, x, dy + r],
            ['A', r, r, 0, 0, 1, dx + width, dy + r * 2],
            ['L', x, dy + height],
            ['L', dx, dy + r * 2],
            ['Z'],
          ];
        },
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
        height: 300,
      },
    },
  ];
  const areaChartConfig: TinyAreaChartProps = {
    autoFit: false,
    data: [
      264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539,
      243, 226, 192,
    ],
    smooth: true,
    height: 300,
  };
</script>
