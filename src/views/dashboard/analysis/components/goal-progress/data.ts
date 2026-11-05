import type { GoalStage } from './types'

export const goal = {
  remainingDays: 12,
  percent: 82.4,
  completed: 824_600,
  target: 1_000_000,
  compare: '+8.6%',
  dailyNeed: 14_617,
}

export const stages: GoalStage[] = [
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

export const fullFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 0,
  style: 'currency',
})

export const compactFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
})
