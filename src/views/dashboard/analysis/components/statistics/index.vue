<script lang="ts" setup>
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

function triggerChartFeedback() {
  chartRefreshing.value = true
}
</script>

<template>
  <a-card
    class="overflow-hidden rounded-8 border-1 border-solid border-color-2 shadow-[var(--w-shadow-card)]"
    variant="borderless"
    :styles="{ body: { padding: '0' } }"
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
          class="analysis-chart-pane h-360 p-12 max-md:h-300"
          :class="{ 'is-refreshing': chartRefreshing }"
          @animationend="chartRefreshing = false"
        >
          <component :is="item.component" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<style scoped>
.analysis-chart-pane {
  border-radius: 8px;
}

.analysis-chart-pane.is-refreshing {
  animation: analysis-chart-feedback 520ms ease-out both;
}

@keyframes analysis-chart-feedback {
  0% {
    background-color: rgb(var(--w-color-primary) / 12%);
    box-shadow: inset 0 0 0 1px rgb(var(--w-color-primary) / 24%);
  }

  100% {
    background-color: transparent;
    box-shadow: inset 0 0 0 1px transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .analysis-chart-pane.is-refreshing {
    animation: none;
  }
}
</style>
