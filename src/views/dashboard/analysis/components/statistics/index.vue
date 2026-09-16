<script lang="ts" setup>
import { WCard } from '@/components'
import SalesRevenue from './SalesRevenue.vue'
import VisitCount from './VisitCount.vue'

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

const options = [
  {
    title: '今天',
    value: 'currentDay',
  },
  {
    title: '昨天',
    value: 'yesterday',
  },
  {
    title: '本周',
    value: 'week',
  },
  {
    title: '本月',
    value: 'month',
  },
  {
    title: '本季度',
    value: 'quarter',
  },
  {
    title: '本年',
    value: 'year',
  },
]

const activeRange = shallowRef('week')
const chartRefreshing = shallowRef(false)
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

function triggerChartFeedback() {
  chartRefreshing.value = true
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    chartRefreshing.value = false
    feedbackTimer = undefined
  }, 480)
}

onBeforeUnmount(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer)
})
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
          @change="triggerChartFeedback"
        >
          <a-radio-button
            v-for="item in options"
            :key="item.value"
            :value="item.value"
          >
            {{ item.title }}
          </a-radio-button>
        </a-radio-group>
        <a-date-picker
          type="daterange"
          allow-clear
          class="w-220 max-sm:w-full"
          @change="triggerChartFeedback"
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
        <div
          class="h-360 rounded-8 bg-transparent p-12 shadow-[inset_0_0_0_1px_transparent] transition-[background-color,box-shadow] duration-motion-slower ease-motion-enter motion-reduce:transition-none max-md:h-300"
          :class="
            chartRefreshing
              ? 'bg-primary/12 shadow-[inset_0_0_0_1px_rgb(var(--w-color-primary)_/_24%)]'
              : ''
          "
        >
          <component :is="item.component" />
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
