<template>
  <a-border-beam :duration="6" :line-width="3">
    <Card
      class="page-enter page-enter--3 overflow-hidden rounded-8 b-1-regular shadow-card"
      variant="borderless"
      :styles="{
        body: {
          padding: '0',
        },
      }"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-12 b-b-1-regular bg-container px-14 py-12 sm:px-18"
      >
        <div class="min-w-0">
          <div class="text-sm text-main font-700">经营趋势</div>
          <div class="mt-2 text-xs text-secondary">销售额与访问量对比分析</div>
        </div>
        <div class="min-w-0 flex flex-wrap items-center justify-end gap-8">
          <a-radio-group
            v-model:value="activeRange"
            name="analysis-range"
            @change="onRangeChange"
          >
            <a-radio-button
              v-for="item in rangeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.title }}
            </a-radio-button>
          </a-radio-group>
          <DateRangePicker
            v-model:value="dateRange"
            allow-clear
            :presets="[]"
            class="w-260! max-sm:w-full"
            @change="onDateChange"
          />
        </div>
      </div>

      <a-tabs
        class="analysis-tabs"
        :tabs-padding="18"
        :tab-bar-style="{ padding: '0 18px' }"
        :animated="{ inkBar: true, tabPane: false }"
        destroy-on-hidden
      >
        <a-tab-pane
          v-for="item in items"
          :key="item.name"
          :name="item.name"
          :tab="item.title"
        >
          <div class="h-360 rounded-8 bg-transparent p-12 max-md:h-300">
            <component :is="item.component" :range="dateRange" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </Card>
  </a-border-beam>
</template>

<script lang="ts" setup>
import { DateRangePicker, Card } from '@/components'
import SalesRevenue from './sales-revenue.vue'
import VisitCount from './visit-count.vue'
import { rangeOptions, resolveRange } from './data'
import type { Dayjs } from 'dayjs'
import type { DateRange, RangeKey } from './data'

const items = [
  {
    name: 'salesRevenue',
    title: '销售额',
    component: SalesRevenue,
  },
  {
    name: 'visitCount',
    title: '访问量',
    component: VisitCount,
  },
]

const activeRange = shallowRef<RangeKey | undefined>('week')
const dateRange = shallowRef<DateRange | null>(resolveRange('week'))

function onRangeChange() {
  if (!activeRange.value) return
  dateRange.value = resolveRange(activeRange.value)
}

function onDateChange(dates: Array<Dayjs> | null) {
  const start = dates?.[0]
  const end = dates?.[1]

  // 清空时回退到当前快捷选项
  if (!start || !end) {
    const fallbackKey = activeRange.value ?? 'week'
    activeRange.value = fallbackKey
    dateRange.value = resolveRange(fallbackKey)
    return
  }

  // 手动选择范围时取消快捷选中
  activeRange.value = undefined
  dateRange.value = [start, end]
}
</script>
