<template>
  <a-border-beam :duration="8" :line-width="2" :size="140">
    <Card class="page-enter page-enter--6" title="流量来源">
      <template #extra>
        <span class="text-xs text-secondary tabular-nums">
          共 {{ totalCount }} 次访问
        </span>
      </template>

      <div class="h-200 w-full">
        <Chart
          :option="chartOption"
          :theme="EChartsTheme"
          autoresize
          class="full min-h-0"
        />
      </div>

      <ul class="m-0 mt-10 flex list-none flex-col p-0" role="list">
        <li
          v-for="item in items"
          :key="item.name"
          class="flex items-center gap-8 rounded-8 px-4 py-7 transition-colors duration-200 hover:bg-hover motion-reduce:transition-none"
        >
          <span
            class="size-8 shrink-0 rounded-999"
            :class="item.tone"
            aria-hidden="true"
          ></span>
          <span class="min-w-0 flex-1 truncate text-sm text-main">
            {{ item.name }}
          </span>
          <span class="shrink-0 text-xs text-secondary tabular-nums">
            {{ item.percent }}%
          </span>
          <span
            class="shrink-0 flex items-center gap-2 text-xs font-700 tabular-nums"
            :class="
              item.change.startsWith('-') ? 'text-warning' : 'text-success'
            "
          >
            <Icon
              :name="
                item.change.startsWith('-')
                  ? 'i-lucide:trending-down'
                  : 'i-lucide:trending-up'
              "
              :size="12"
            />
            {{ item.change }}
          </span>
        </li>
      </ul>
    </Card>
  </a-border-beam>
</template>

<script lang="ts" setup>
import { Chart } from '@/components/chart'
import { Card } from '@/components/card'
import { getCssRgbVarAlpha, useEChartsTheme } from '@/components/chart'
import type { EChartsCoreOption } from 'echarts/core'

const { baseChartOption, EChartsTheme, getEChartsColor } = useEChartsTheme()

interface TrafficItem {
  /** 来源名称 */
  name: string
  /** 占比 */
  percent: number
  /** 环比 */
  change: string
  /** 图例色块的原子类 */
  tone: string
  /** 图表颜色,取自主题 token */
  chart: {
    varName: string
    alpha: number
    fallback: string
  }
}

/**
 * 占比用环形图呈现,颜色取自主题 token,保证明暗色一致
 */
const items: TrafficItem[] = [
  {
    name: '自然搜索',
    percent: 42,
    change: '+6.2%',
    tone: 'bg-primary',
    chart: { varName: '--w-color-primary', alpha: 0.9, fallback: '#1677ff' },
  },
  {
    name: '直接访问',
    percent: 28,
    change: '+2.4%',
    tone: 'bg-info',
    chart: { varName: '--w-color-info', alpha: 0.72, fallback: '#4096ff' },
  },
  {
    name: '社交媒体',
    percent: 18,
    change: '-1.8%',
    tone: 'bg-success',
    chart: { varName: '--w-color-success', alpha: 0.72, fallback: '#52c41a' },
  },
  {
    name: '广告投放',
    percent: 12,
    change: '+4.6%',
    tone: 'bg-warning',
    chart: { varName: '--w-color-warning', alpha: 0.78, fallback: '#faad14' },
  },
]

const totalCount = 12_486

const chartOption = computed<EChartsCoreOption>(() => ({
  ...baseChartOption.value,
  tooltip: {
    ...baseChartOption.value.tooltip,
    formatter: '{b}: {c}%',
    trigger: 'item',
  },
  series: [
    {
      avoidLabelOverlap: true,
      // 颜色在这里解析:computed 依赖主题 baseChartOption,明暗切换时会重新取 token
      data: items.map((item) => ({
        itemStyle: {
          color: getCssRgbVarAlpha(
            item.chart.varName,
            item.chart.alpha,
            item.chart.fallback
          ),
        },
        name: item.name,
        value: item.percent,
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 16,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
        },
      },
      itemStyle: {
        borderColor: getEChartsColor('tooltipBg'),
        borderRadius: 6,
        borderWidth: 2,
      },
      label: {
        color: getEChartsColor('primaryText'),
        formatter: '{d}%',
        fontSize: 11,
      },
      labelLine: { show: false },
      name: '流量来源',
      radius: ['52%', '76%'],
      type: 'pie',
    },
  ],
}))
</script>
