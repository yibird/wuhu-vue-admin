<script lang="ts" setup>
import Card from './Card.vue'

const stages = [
  {
    id: 'visit',
    title: '访问触达',
    value: '48,920',
    rate: 100,
    trend: '+12.8%',
    toneClass: 'text-success',
    fillClass: 'from-primary to-info',
  },
  {
    id: 'signup',
    title: '线索留资',
    value: '16,840',
    rate: 72,
    trend: '+8.4%',
    toneClass: 'text-success',
    fillClass: 'from-info to-success',
  },
  {
    id: 'trial',
    title: '试用激活',
    value: '8,426',
    rate: 48,
    trend: '+3.2%',
    toneClass: 'text-success',
    fillClass: 'from-success to-warning',
  },
  {
    id: 'deal',
    title: '成交转化',
    value: '2,356',
    rate: 28,
    trend: '-1.6%',
    toneClass: 'text-warning',
    fillClass: 'from-warning to-error',
  },
]

const insights = [
  {
    id: 'retention',
    label: '复访率',
    value: '64.2%',
    description: '较上周提升 4.8%',
    icon: 'i-lucide:repeat-2',
    iconClass: 'bg-success-tint text-success',
  },
  {
    id: 'response',
    label: '平均响应',
    value: '1.8h',
    description: '客服承接更快',
    icon: 'i-lucide:timer',
    iconClass: 'bg-info-tint text-info',
  },
  {
    id: 'risk',
    label: '异常波动',
    value: '3',
    description: '需关注渠道',
    icon: 'i-lucide:radar',
    iconClass: 'bg-warning-tint text-warning',
  },
]
</script>

<template>
  <Card
    title="转化漏斗"
    icon="i-lucide:funnel"
    description="从访问到成交的关键链路"
    body-class="p-14 sm:p-16"
  >
    <div class="grid grid-cols-1 gap-16 2xl:grid-cols-[minmax(0,1fr)_260px]">
      <div class="min-w-0">
        <div class="mb-14 flex items-end justify-between gap-12">
          <div class="min-w-0">
            <div class="text-sm text-main font-700">本周转化链路</div>
            <div class="mt-3 truncate text-xs text-secondary">
              核心流失集中在试用激活阶段
            </div>
          </div>
          <div class="shrink-0 text-right">
            <div class="text-2xl text-primary font-800">4.8%</div>
            <div class="mt-1 text-xs text-secondary">最终转化率</div>
          </div>
        </div>

        <div role="list" class="flex flex-col gap-6">
          <div
            v-for="(stage, index) in stages"
            :key="stage.id"
            class="group relative rounded-8 px-6 py-10 transition-[background-color,transform] hover:(-translate-y-2 bg-hover)"
            tabindex="0"
            role="listitem"
          >
            <div
              class="relative z-1 mb-9 flex items-center justify-between gap-10"
            >
              <div class="min-w-0 flex items-center gap-9">
                <span
                  :class="[
                    'relative z-1 size-28 flex shrink-0 items-center justify-center rounded-999 border-1 border-solid text-xs font-800',
                    index === 0
                      ? 'border-primary bg-primary text-white'
                      : index === stages.length - 1
                        ? 'border-warning bg-warning-tint text-warning'
                        : 'border-color-2 bg-container text-secondary',
                  ]"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <div class="min-w-0">
                  <div class="truncate text-sm text-main font-700">
                    {{ stage.title }}
                  </div>
                  <div class="mt-1 truncate text-xs text-secondary">
                    {{ stage.value }} 人
                  </div>
                </div>
              </div>
              <div class="shrink-0 text-right">
                <div class="text-md text-main font-800">{{ stage.rate }}%</div>
                <div class="mt-2 text-xs" :class="stage.toneClass">
                  {{ stage.trend }}
                </div>
              </div>
            </div>
            <div
              class="relative h-22 overflow-hidden rounded-6 bg-fill-tertiary"
            >
              <div
                class="relative mx-auto h-full bg-gradient-to-r [clip-path:polygon(0_0,100%_0,94%_100%,6%_100%)] transition-[filter,transform,width] duration-motion-moderate ease-motion-standard group-hover:(scale-y-110 [filter:saturate(1.2)]) group-focus-visible:(scale-y-110 [filter:saturate(1.2)]) motion-reduce:(transform-none transition-none)"
                :class="stage.fillClass"
                :style="{ width: `${stage.rate}%` }"
              >
                <span
                  class="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_18%,rgb(255_255_255_/_24%)_48%,transparent_72%)] opacity-70 transition-transform duration-motion-slower ease-motion-standard group-hover:translate-x-full group-focus-visible:translate-x-full motion-reduce:(transform-none transition-none)"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="analysis-funnel-aside min-w-0">
        <div
          class="analysis-funnel-summary overflow-hidden rounded-10 bg-primary-tint p-12"
        >
          <div class="flex items-center justify-between gap-8">
            <span class="text-xs text-primary font-700">最终成交</span>
            <span
              class="size-28 flex shrink-0 items-center justify-center rounded-8 bg-primary text-white"
            >
              <Icon name="i-lucide:badge-check" :size="15" />
            </span>
          </div>
          <div class="mt-12 flex items-end gap-5">
            <span class="text-3xl text-main font-800">2,356</span>
            <span class="pb-2 text-xs text-secondary">人</span>
          </div>
          <div class="mt-5 text-xs text-secondary">
            由 48,920 次访问逐步转化
          </div>
          <div class="mt-12 flex items-center justify-between gap-8">
            <span class="text-xs text-secondary">总体转化率</span>
            <span class="text-sm text-primary font-800">4.8%</span>
          </div>
          <div class="mt-6 h-6 overflow-hidden rounded-999 bg-primary/10">
            <div class="h-full rounded-999 bg-primary" style="width: 28%"></div>
          </div>
        </div>

        <div class="mt-14 flex items-center justify-between gap-8 px-2">
          <span class="text-sm text-main font-700">运营信号</span>
          <span class="text-xs text-secondary">实时监测</span>
        </div>
        <div class="mt-6 flex flex-col gap-6">
          <div
            v-for="item in insights"
            :key="item.id"
            class="min-w-0 rounded-8 px-6 py-10 transition-[background-color,transform] hover:(-translate-y-1 bg-hover) sm:px-10 2xl:px-6"
            tabindex="0"
          >
            <div class="flex items-start gap-10">
              <span
                class="size-32 flex shrink-0 items-center justify-center rounded-8"
                :class="item.iconClass"
              >
                <Icon :name="item.icon" :size="16" />
              </span>
              <div class="min-w-0">
                <div class="truncate text-xs text-secondary">
                  {{ item.label }}
                </div>
                <div class="mt-3 min-w-0">
                  <span class="block text-lg text-main font-800">
                    {{ item.value }}
                  </span>
                  <span class="mt-2 block truncate text-xs text-secondary">
                    {{ item.description }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </Card>
</template>
