<script setup lang="ts">
import VChart from 'vue-echarts'
import { useEChartsTheme } from '@/composables/useEChartsTheme'
import { useECharts } from '@/plugins/echarts'
import {
  aggregateChartRows,
  createWidgetChartOption,
  formatChartValue,
  toFiniteNumber,
} from '../chartOptions'
import type { ChartDataSource, ChartWidget } from '../types'
import type { ChartPreviewMode } from '../types'

useECharts()

const props = defineProps<{
  previewMode: ChartPreviewMode
  source?: ChartDataSource
  widget: ChartWidget
}>()

const { baseChartOption, eChartsThemeName, getEChartsColor } = useEChartsTheme()

const aggregatedRows = computed(() =>
  aggregateChartRows(props.source, props.widget)
)

const kpiValue = computed(() => {
  const rows = props.source?.records ?? []
  const total = rows.reduce(
    (sum, record) => sum + toFiniteNumber(record[props.widget.measure]),
    0
  )
  const field = props.source?.fields.find(
    (item) => item.key === props.widget.measure
  )
  const value =
    field?.type === 'percent' && rows.length > 0 ? total / rows.length : total

  return formatChartValue(value, props.widget.formatter)
})

const tableRows = computed(() => (props.source?.records ?? []).slice(0, 5))
const tableFields = computed(() => (props.source?.fields ?? []).slice(0, 4))

const chartOption = computed(() => {
  if (props.widget.kind !== 'chart') return undefined

  return createWidgetChartOption({
    baseOption: baseChartOption.value,
    getColor: getEChartsColor,
    rows: aggregatedRows.value,
    widget: props.widget,
  })
})
</script>

<template>
  <div class="full min-h-0" :class="`chart-preview--${previewMode}`">
    <div
      v-if="widget.kind === 'kpi'"
      class="chart-preview-surface h-full flex flex-col justify-between rounded-6 border-1 border-white/9 border-solid bg-white/7 p-14"
    >
      <div class="flex items-start justify-between gap-10">
        <div class="min-w-0">
          <p class="chart-preview-muted m-0 text-12px text-white/58">
            {{ widget.subtitle }}
          </p>
          <strong
            class="chart-preview-value mt-6 block truncate text-30px text-white leading-none"
          >
            {{ kpiValue }}
          </strong>
        </div>
        <span
          class="size-34 flex shrink-0 items-center justify-center rounded-8 text-white"
          :style="{ backgroundColor: widget.accent }"
        >
          <Icon name="i-lucide:sparkles" :size="16" />
        </span>
      </div>
      <p
        class="chart-preview-muted m-0 line-clamp-2 text-12px text-white/66 leading-18px"
      >
        {{ widget.insight }}
      </p>
    </div>

    <div v-else-if="widget.kind === 'table'" class="h-full overflow-hidden">
      <table
        class="chart-preview-table w-full border-collapse text-left text-12px text-white/74"
      >
        <thead>
          <tr class="border-b border-white/10">
            <th
              v-for="field in tableFields"
              :key="field.key"
              class="px-8 py-7 font-500 text-white/48"
            >
              {{ field.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in tableRows"
            :key="rowIndex"
            class="border-b border-white/7"
          >
            <td v-for="field in tableFields" :key="field.key" class="px-8 py-7">
              {{ row[field.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else-if="widget.kind === 'note'"
      class="chart-preview-surface h-full rounded-6 border-1 border-white/9 border-solid bg-white/7 p-14 text-13px text-white/76 leading-22px"
    >
      {{ widget.insight }}
    </div>

    <VChart
      v-else-if="chartOption"
      :option="chartOption"
      :theme="eChartsThemeName"
      autoresize
      class="full min-h-160"
    />
  </div>
</template>

<style scoped>
.chart-preview--light .chart-preview-surface {
  color: rgb(30 41 59);
  background: rgb(248 250 252 / 76%);
  border-color: rgb(15 23 42 / 8%);
}

.chart-preview--light .chart-preview-muted {
  color: rgb(71 85 105 / 72%);
}

.chart-preview--light .chart-preview-value {
  color: rgb(15 23 42);
}

.chart-preview--light .chart-preview-table {
  color: rgb(51 65 85);
}
</style>
