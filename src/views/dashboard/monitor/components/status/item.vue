<script lang="ts" setup>
import { NumberTicker } from '@/components/numberTicker'
import {
  getCssRgbVar,
  getCssRgbVarAlpha,
  useEChartsTheme,
} from '@/composables/useEChartsTheme'
import { useECharts } from '@/plugins/echarts'
import VChart from 'vue-echarts'
import type { MonitorTone, StatusItemProps } from '../types'
import type { EChartsCoreOption } from 'echarts/core'

useECharts()

const { eChartsThemeName } = useEChartsTheme()

const props = defineProps<StatusItemProps>()

const toneClassMap: Record<MonitorTone, string> = {
  primary: 'icon-primary-soft',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
  error: 'bg-error-tint text-error',
  info: 'bg-info-tint text-info',
}

const chartOption = computed<EChartsCoreOption>(() => ({
  backgroundColor: 'transparent',
  series: [
    {
      axisLabel: { show: false },
      axisLine: {
        lineStyle: {
          color: [
            [
              1,
              getCssRgbVarAlpha(
                '--w-color-primary',
                0.12,
                'rgba(22, 119, 255, 0.12)'
              ),
            ],
          ],
          width: 14,
        },
      },
      axisTick: { show: false },
      data: [{ value: props.item.value }],
      detail: { show: false },
      endAngle: -270,
      pointer: { show: false },
      progress: {
        itemStyle: { color: getCssRgbVar('--w-color-primary', '#1677ff') },
        roundCap: true,
        show: true,
        width: 14,
      },
      radius: '96%',
      splitLine: { show: false },
      startAngle: 90,
      type: 'gauge',
    },
  ],
}))
</script>

<template>
  <div
    class="min-w-0 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12 transition-[border-color,background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-2 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]) active:(translate-y-0 scale-[0.995]) motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
  >
    <div class="flex items-center justify-between gap-10">
      <div class="min-w-0">
        <div class="truncate text-sm text-main font-700">{{ item.title }}</div>
        <div class="mt-4 truncate text-xs text-secondary">{{ item.trend }}</div>
      </div>
      <span
        :class="[
          'h-32 w-32 flex shrink-0 items-center justify-center rounded-8',
          toneClassMap[item.tone],
        ]"
      >
        <Icon :name="item.icon" :size="17" />
      </span>
    </div>
    <div class="mt-10 flex items-center justify-center">
      <div class="relative size-132">
        <VChart
          :option="chartOption"
          :theme="eChartsThemeName"
          autoresize
          class="full min-h-0"
        />
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center text-lg text-main font-700"
        >
          <NumberTicker :value="item.value" :duration="750" suffix="%" />
        </div>
      </div>
    </div>
    <div class="mt-8 truncate text-center text-xs text-secondary">
      {{ item.description }}
    </div>
  </div>
</template>
