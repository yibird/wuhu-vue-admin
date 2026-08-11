<template>
  <section
    class="overflow-hidden rounded-4 border-1 border-color-2 border-solid bg-container transition-[border-color,box-shadow] duration-200 hover:(border-color-1 shadow-all-sm)"
  >
    <div class="grid gap-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div class="min-w-0 p-16 sm:p-20">
        <div class="flex flex-col gap-14 sm:flex-row sm:items-center">
          <a-avatar :size="54" class="shrink-0 bg-primary text-white">
            吴
          </a-avatar>
          <div class="min-w-0">
            <h2 class="m-0 text-md text-main font-700">
              早安，吴彦祖，今天有 8 项关键事项待推进
            </h2>
            <p class="mb-0 mt-6 text-sm text-secondary leading-22px">
              重点关注交付延期风险、待评审需求和线上反馈，优先处理高影响项目。
            </p>
          </div>
        </div>

        <div class="mt-18 flex flex-wrap items-center gap-8">
          <a-button type="primary">
            <template #icon>
              <Icon name="i-lucide:list-checks" :size="16" />
            </template>
            查看待办
          </a-button>
          <a-button>
            <template #icon>
              <Icon name="i-lucide:clock-3" :size="16" />
            </template>
            今日排期
          </a-button>
          <a-button>
            <template #icon>
              <Icon name="i-lucide:send" :size="16" />
            </template>
            发起同步
          </a-button>
        </div>
      </div>

      <div
        class="grid grid-cols-2 border-color-2 border-t-1 border-t-solid sm:grid-cols-4 lg:grid-cols-2 lg:border-l-1 lg:border-l-solid lg:border-t-0"
      >
        <div
          v-for="item in metrics"
          :key="item.title"
          class="group min-w-0 border-color-2 border-r-1 border-r-solid border-b-1 border-b-solid p-14 transition-colors duration-200 hover:bg-hover last:border-r-0 sm:last:border-r-0 lg:nth-2:border-r-0 lg:nth-last-2:border-b-0 lg:last:border-b-0"
        >
          <div class="flex items-center justify-between gap-10">
            <span class="truncate text-sm text-secondary">{{
              item.title
            }}</span>
            <span
              class="size-30 shrink-0 flex items-center justify-center rounded-8 transition-transform duration-200 group-hover:scale-110"
              :class="item.tone"
            >
              <Icon :name="item.icon" :size="16" />
            </span>
          </div>
          <div class="mt-10 truncate text-2md text-main font-700">
            <NumberTicker :value="item.value" />
          </div>
          <div class="mt-4 truncate text-xs text-secondary">
            {{ item.desc }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { NumberTicker } from '@/components'
import type { OverviewMetric } from './types'

const metrics: OverviewMetric[] = [
  {
    title: '进行中项目',
    value: 18,
    desc: '3 个高优先级',
    icon: 'i-lucide:folder-kanban',
    tone: 'icon-primary-soft',
  },
  {
    title: '待处理任务',
    value: 42,
    desc: '今日需完成 8 项',
    icon: 'i-lucide:badge-check',
    tone: 'bg-warning-tint text-warning',
  },
  {
    title: '团队在线',
    value: 26,
    desc: '覆盖 5 个小组',
    icon: 'i-lucide:users-round',
    tone: 'bg-success-tint text-success',
  },
  {
    title: '风险提醒',
    value: 5,
    desc: '2 项需要升级',
    icon: 'i-lucide:triangle-alert',
    tone: 'bg-error-tint text-error',
  },
]
</script>
