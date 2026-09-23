<script lang="ts" setup>
import { DateRangePicker, WCard } from '@/components'
import SalesRevenue from './SalesRevenue.vue'
import VisitCount from './VisitCount.vue'
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

<template>
  <WCard
    class="page-enter page-enter--3 overflow-hidden rounded-8 border-1 border-solid border-color-2 shadow-[var(--w-shadow-card)]"
    variant="borderless"
    :styles="{
      body: {
        padding: '0',
      },
    }"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 bg-container px-14 py-12 sm:px-18"
    >
      <div class="min-w-0">
        <div class="text-sm text-main font-700">经营趋势</div>
        <div class="mt-2 text-xs text-secondary">销售额与访问量对比分析</div>
      </div>
      <div class="min-w-0 flex flex-wrap items-center justify-end gap-8">
        <a-radio-group
          v-model:value="activeRange"
          name="analysis-range"
          class="analysis-range-group"
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
          class="w-240 max-sm:w-full"
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
  </WCard>
</template>

<style lang="less" scoped>
// 分段时间筛选：统一为现代 pill 分段控件
:deep(.analysis-range-group) {
  .ant-radio-button-wrapper {
    height: 32px;
    padding: 0 14px;
    line-height: 30px;
    color: rgb(var(--w-text-secondary));
    background: transparent;
    border: none;
    border-radius: 8px;
    transition:
      color var(--w-motion-duration-base) var(--w-motion-ease-standard),
      background-color var(--w-motion-duration-base)
        var(--w-motion-ease-standard);

    &:not(:first-child)::before {
      display: none;
    }

    &:hover {
      color: rgb(var(--w-color-primary));
      background: rgb(var(--w-color-primary) / 6%);
    }

    &-checked,
    &-checked:hover {
      color: #fff;
      background: rgb(var(--w-color-primary));
      box-shadow: 0 4px 12px -4px rgb(var(--w-color-primary) / 55%);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.analysis-range-group .ant-radio-button-wrapper) {
    transition: none;
  }
}
</style>
