<template>
  <a-border-beam :duration="8" :line-width="2" :size="140">
    <Card class="page-enter page-enter--4" title="销售目标达成">
      <template #extra>
        <span class="text-xs text-secondary">
          剩余
          <span class="text-main font-700">{{ goal.remainingDays }}</span> 天
        </span>
      </template>

      <div class="flex flex-wrap items-end justify-between gap-12">
        <div class="min-w-0">
          <div class="flex items-baseline gap-8">
            <span class="text-3xl text-main font-800 tabular-nums">
              {{ goal.percent }}%
            </span>
            <span class="text-xs text-secondary">已完成</span>
          </div>
          <div class="mt-6 text-xs text-secondary tabular-nums">
            {{ formatFull(goal.completed) }} / {{ formatFull(goal.target) }}
          </div>
        </div>

        <div
          class="shrink-0 flex items-center gap-4 rounded-6 bg-success/10 px-8 py-4 text-xs text-success font-700"
        >
          <Icon name="i-lucide:trending-up" :size="13" />
          {{ goal.compare }} 较上月
        </div>
      </div>

      <div
        class="mt-14 h-9 overflow-hidden rounded-999 bg-muted"
        role="progressbar"
        :aria-valuenow="goal.percent"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`销售目标已完成 ${goal.percent}%`"
      >
        <div
          class="h-full origin-left rounded-999 bg-primary transition-[width] duration-motion-moderate ease-motion-standard motion-reduce:transition-none"
          :style="{ width: `${goal.percent}%` }"
        ></div>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
        <div
          v-for="stage in stages"
          :key="stage.label"
          class="rounded-8 bg-secondary px-10 py-9 transition-colors duration-motion-base hover:bg-hover motion-reduce:transition-none"
        >
          <div class="flex items-center justify-between gap-8">
            <span class="text-xs text-secondary">{{ stage.label }}</span>
            <span class="text-xs font-700 tabular-nums" :class="stage.tone">
              {{ stage.percent }}%
            </span>
          </div>
          <div class="mt-7 h-5 overflow-hidden rounded-999 bg-muted">
            <div
              class="h-full origin-left rounded-999 transition-[width] duration-motion-moderate ease-motion-standard motion-reduce:transition-none"
              :class="stage.bar"
              :style="{ width: `${stage.percent}%` }"
            ></div>
          </div>
          <div class="mt-6 text-xs text-secondary tabular-nums">
            {{ formatCompact(stage.value) }}
          </div>
        </div>
      </div>

      <div class="mt-12 flex items-center gap-6 text-xs text-secondary">
        <Icon name="i-lucide:gauge" :size="13" class="shrink-0" />
        日均需完成
        <span class="text-main font-700 tabular-nums">
          {{ formatFull(goal.dailyNeed) }}
        </span>
        才能按期达成
      </div>
    </Card>
  </a-border-beam>
</template>

<script lang="ts" setup>
import { Card } from '@/components'

interface GoalStage {
  /** 统计口径 */
  label: string
  /** 完成百分比 */
  percent: number
  /** 已完成金额 */
  value: number
  /** 百分比文字色 */
  tone: string
  /** 进度条底色 */
  bar: string
}

const goal = {
  remainingDays: 12,
  percent: 82.4,
  completed: 824_600,
  target: 1_000_000,
  compare: '+8.6%',
  dailyNeed: 14_617,
}

const stages: GoalStage[] = [
  {
    label: '本周目标',
    percent: 96.2,
    value: 212_480,
    tone: 'text-success',
    bar: 'bg-success',
  },
  {
    label: '本月目标',
    percent: 82.4,
    value: 824_600,
    tone: 'text-primary',
    bar: 'bg-primary',
  },
  {
    label: '本季目标',
    percent: 64.8,
    value: 2_164_000,
    tone: 'text-info',
    bar: 'bg-info',
  },
]

const fullFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 0,
  style: 'currency',
})

const compactFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
})

/**
 * 完整金额,用于目标值等需要精确展示的场合
 *
 * @param value 金额
 */
function formatFull(value: number) {
  return fullFormatter.format(value)
}

/**
 * 紧凑金额,用于卡片内的次要数值
 *
 * @param value 金额
 */
function formatCompact(value: number) {
  return compactFormatter.format(value)
}
</script>
