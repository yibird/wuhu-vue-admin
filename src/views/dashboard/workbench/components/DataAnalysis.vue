<template>
  <section data-swapy-slot="analysis" class="page-enter page-enter--7 min-w-0">
    <a-card
      size="small"
      :segmented="{ content: true }"
      content-class="p-0!"
      data-swapy-item="analysis"
    >
      <template #header>
        <span class="text-base text-main font-700">数据概览</span>
      </template>

      <div class="p-12">
        <div class="grid grid-cols-2 gap-8">
          <div
            v-for="item in metrics"
            :key="item.label"
            class="group min-w-0 rounded-8 bg-fill-tertiary p-10 transition-[background-color,box-shadow,transform] duration-200 hover:(-translate-y-1 bg-hover shadow-all-sm)"
          >
            <div class="truncate text-xs text-secondary">{{ item.label }}</div>
            <div class="mt-6 truncate text-lg text-main font-700">
              <NumberTicker
                :value="item.value"
                :decimals="item.suffix === '%' ? 1 : 0"
                :suffix="item.suffix"
              />
            </div>
            <div class="mt-4 truncate text-xs" :class="item.tone">
              <NumberTicker
                :value="item.descValue"
                :decimals="item.descSuffix === '%' ? 1 : 0"
                :prefix="item.descPrefix"
                :suffix="item.descSuffix"
              />
            </div>
          </div>
        </div>

        <div class="mt-16">
          <div class="mb-10 flex items-center justify-between">
            <span class="text-sm text-main font-700">本周工作分布</span>
            <span class="text-xs text-secondary">按投入占比</span>
          </div>
          <div class="flex flex-col gap-10">
            <div v-for="item in ranks" :key="item.label">
              <div class="mb-5 flex items-center justify-between gap-8 text-xs">
                <span class="truncate text-secondary">{{ item.label }}</span>
                <span class="text-main font-600">
                  <NumberTicker :value="item.value" :suffix="item.suffix" />
                </span>
              </div>
              <a-progress
                :percent="item.percent"
                :show-info="false"
                :size="7"
              />
            </div>
          </div>
        </div>

        <div
          class="mt-16 rounded-8 border-1 border-color-2 border-solid bg-container p-12 transition-[border-color,box-shadow,transform] duration-200 hover:(-translate-y-1 border-color-primary shadow-all-sm)"
        >
          <div class="flex items-center gap-8">
            <span
              class="size-30 flex items-center justify-center rounded-8 bg-warning-tint text-warning transition-transform duration-200"
            >
              <Icon name="i-lucide:bell-ring" :size="16" />
            </span>
            <div class="min-w-0">
              <div class="truncate text-sm text-main font-700">今日提醒</div>
              <div class="mt-3 truncate text-xs text-secondary">
                2 个项目临近截止，1 个评审等待确认。
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </section>
</template>

<script lang="ts" setup>
import { NumberTicker } from '@/components'
import type { AnalysisMetric, AnalysisRankItem } from './types'

const metrics: AnalysisMetric[] = [
  {
    label: '交付准时率',
    value: 91.6,
    suffix: '%',
    descValue: 4.2,
    descPrefix: '+',
    descSuffix: '%',
    percent: 92,
    tone: 'text-success',
  },
  {
    label: '需求吞吐',
    value: 128,
    descValue: 16,
    descPrefix: '+',
    descSuffix: ' 本周',
    percent: 72,
    tone: 'text-primary',
  },
]

const ranks: AnalysisRankItem[] = [
  {
    label: '项目交付',
    value: 46,
    suffix: '%',
    percent: 46,
  },
  {
    label: '需求评审',
    value: 28,
    suffix: '%',
    percent: 28,
  },
  {
    label: '问题响应',
    value: 18,
    suffix: '%',
    percent: 18,
  },
  {
    label: '团队同步',
    value: 8,
    suffix: '%',
    percent: 8,
  },
]
</script>
