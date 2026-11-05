<template>
  <ViewSection
    :loading="props.loading"
    :skeleton-options="{ name: 'analysis-goal-progress' }"
  >
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
            class="h-full origin-left rounded-999 bg-primary transition-[width] duration-300 ease-[var(--w-motion-ease)]"
            :style="{ width: `${goal.percent}%` }"
          ></div>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div
            v-for="stage in stages"
            :key="stage.label"
            class="rounded-8 bg-secondary px-10 py-9 transition-colors duration-200 hover:bg-hover"
          >
            <div class="flex items-center justify-between gap-8">
              <span class="text-xs text-secondary">{{ stage.label }}</span>
              <span class="text-xs font-700 tabular-nums" :class="stage.tone">
                {{ stage.percent }}%
              </span>
            </div>
            <div class="mt-7 h-5 overflow-hidden rounded-999 bg-muted">
              <div
                class="h-full origin-left rounded-999 transition-[width] duration-300 ease-[var(--w-motion-ease)]"
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
  </ViewSection>
</template>

<script lang="ts" setup>
import { Card, ViewSection } from '@/components'
import { compactFormatter, fullFormatter, goal, stages } from './data'

const props = withDefaults(defineProps<{ loading?: boolean }>(), {
  loading: false,
})

function formatFull(value: number) {
  return fullFormatter.format(value)
}

function formatCompact(value: number) {
  return compactFormatter.format(value)
}
</script>
