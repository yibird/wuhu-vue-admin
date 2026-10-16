<template>
  <Card class="page-enter page-enter--7" title="成交排行">
    <template #extra>
      <a-radio-group v-model:value="metric" size="small">
        <a-radio-button value="amount">销售额</a-radio-button>
        <a-radio-button value="order">订单数</a-radio-button>
      </a-radio-group>
    </template>

    <SlidingHighlight
      ref="highlightRef"
      :inset="4"
      pill-class-name="rounded-8 bg-hover"
      role="list"
    >
      <div
        v-for="(item, index) in rankedItems"
        :key="item.id"
        class="relative min-w-0 rounded-8 px-4 py-9 focus-visible:(outline-none shadow-[inset_0_0_0_1px_rgb(var(--w-color-primary)_/_42%)]) sm:px-6"
        tabindex="0"
        role="listitem"
        @focus="handleItemFocus"
        @blur="handleItemBlur"
      >
        <div class="flex items-center gap-10">
          <span
            :class="[
              'size-26 flex shrink-0 items-center justify-center rounded-8 text-xs font-800',
              rankClass(index),
            ]"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-8">
              <span class="min-w-0 truncate text-sm text-main font-700">
                {{ item.name }}
              </span>
              <span class="shrink-0 text-sm text-main font-800 tabular-nums">
                {{ formatValue(item) }}
              </span>
            </div>
            <div class="mt-7 h-5 overflow-hidden rounded-999 bg-fill-secondary">
              <div
                class="h-full origin-left rounded-999 bg-primary transition-[width] duration-motion-moderate ease-motion-standard motion-reduce:transition-none"
                :style="{ width: `${barWidth(item)}%` }"
              ></div>
            </div>
          </div>
          <div
            class="shrink-0 flex items-center gap-3 text-xs font-700 tabular-nums"
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
              :size="13"
            />
            {{ item.change }}
          </div>
        </div>
      </div>
    </SlidingHighlight>
  </Card>
</template>

<script lang="ts" setup>
import {
  SlidingHighlight,
  type SlidingHighlightInstance,
  Card,
} from '@/components'

type RankMetric = 'amount' | 'order'

interface RankingItem {
  id: number
  /** 地区名称 */
  name: string
  /** 销售额(元) */
  amount: number
  /** 订单数(单) */
  order: number
  /** 环比 */
  change: string
}

const highlightRef = useTemplateRef<SlidingHighlightInstance>('highlightRef')

const metric = shallowRef<RankMetric>('amount')

const items: RankingItem[] = [
  {
    id: 1,
    name: '华东地区',
    amount: 1_286_400,
    order: 3_842,
    change: '+12.4%',
  },
  {
    id: 2,
    name: '华南地区',
    amount: 968_200,
    order: 2_914,
    change: '+9.8%',
  },
  {
    id: 3,
    name: '华北地区',
    amount: 742_600,
    order: 2_235,
    change: '+6.1%',
  },
  {
    id: 4,
    name: '西南地区',
    amount: 486_900,
    order: 1_468,
    change: '-2.3%',
  },
  {
    id: 5,
    name: '华中地区',
    amount: 352_100,
    order: 1_027,
    change: '+1.6%',
  },
  {
    id: 6,
    name: '西北地区',
    amount: 186_400,
    order: 542,
    change: '-4.8%',
  },
]

const amountFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
})

const orderFormatter = new Intl.NumberFormat('zh-CN')

const rankedItems = computed(() =>
  [...items].sort((left, right) => right[metric.value] - left[metric.value])
)

const maxValue = computed(() => rankedItems.value[0]?.[metric.value] ?? 1)

/**
 * 名次徽标配色:前三名区分,其余走中性色
 *
 * @param index 名次下标
 */
function rankClass(index: number) {
  if (index === 0) return 'bg-primary-tint text-primary'
  if (index === 1) return 'bg-info-tint text-info'
  if (index === 2) return 'bg-warning-tint text-warning'
  return 'bg-fill-tertiary text-secondary'
}

/**
 * 按当前指标格式化数值
 *
 * @param item 排行项
 */
function formatValue(item: RankingItem) {
  return metric.value === 'amount'
    ? amountFormatter.format(item.amount)
    : `${orderFormatter.format(item.order)} 单`
}

/**
 * 进度条宽度,以榜首为基准
 *
 * @param item 排行项
 */
function barWidth(item: RankingItem) {
  return Math.max(6, Math.round((item[metric.value] / maxValue.value) * 100))
}

const handleItemFocus = (event: FocusEvent) =>
  highlightRef.value?.highlight(event.currentTarget as HTMLElement)
const handleItemBlur = () => highlightRef.value?.clear()
</script>
