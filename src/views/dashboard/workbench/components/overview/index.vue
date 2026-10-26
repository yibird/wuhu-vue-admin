<template>
  <OverviewSkeleton v-if="loading" />
  <a-border-beam v-else :duration="6" :line-width="3">
    <section
      class="workbench-hero relative overflow-hidden rounded-4 b-1-secondary transition-all hover:(shadow-sm)"
    >
      <div class="grid gap-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div class="min-w-0 p-16 sm:p-20">
          <div class="flex flex-col gap-14 sm:(flex-row items-center)">
            <a-avatar
              :size="54"
              class="shrink-0 bg-gradient-to-br from-primary to-primary/65 text-white shadow-xl shadow-primary/28"
            >
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
          class="grid grid-cols-2 b-t-1-[border-secondary] sm:grid-cols-4 lg:grid-cols-2 lg:b-l-1-[border-secondary] lg:border-t-0"
        >
          <div
            v-for="item in metrics"
            :key="item.title"
            class="group min-w-0 b-r-1-[border-secondary] b-b-1-[border-secondary] p-14 transition-colors duration-200 hover:bg-hover last:border-r-0 sm:last:border-r-0 lg:nth-2:border-r-0 lg:nth-last-2:border-b-0 lg:last:border-b-0"
          >
            <div class="flex items-center justify-between gap-10">
              <span class="truncate text-sm text-secondary">{{
                item.title
              }}</span>
              <span
                class="size-30 shrink-0 flex items-center justify-center rounded-8 transition-transform duration-200 group-hover:scale-110"
                :class="item.iconClass"
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
  </a-border-beam>
</template>

<script lang="ts" setup>
import { NumberTicker } from '@/components/number-ticker'
import OverviewSkeleton from './skeleton.vue'
import type { OverviewMetric } from './types'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const metrics: OverviewMetric[] = [
  {
    title: '进行中项目',
    value: 18,
    desc: '3 个高优先级',
    icon: 'i-lucide:folder-kanban',
    iconClass: 'primary-tinted',
  },
  {
    title: '待处理任务',
    value: 42,
    desc: '今日需完成 8 项',
    icon: 'i-lucide:badge-check',
    iconClass: 'bg-warning/10 text-warning',
  },
  {
    title: '团队在线',
    value: 26,
    desc: '覆盖 5 个小组',
    icon: 'i-lucide:users-round',
    iconClass: 'bg-success/10 text-success',
  },
  {
    title: '风险提醒',
    value: 5,
    desc: '2 项需要升级',
    icon: 'i-lucide:triangle-alert',
    iconClass: 'bg-error/10 text-error',
  },
]
</script>

<style lang="less" scoped>
.workbench-hero {
  background-image:
    radial-gradient(
      520px 230px at 0% 0%,
      rgb(var(--w-color-primary) / 16%),
      transparent 72%
    ),
    linear-gradient(135deg, rgb(var(--w-color-primary) / 8%), transparent 55%);
}
</style>
