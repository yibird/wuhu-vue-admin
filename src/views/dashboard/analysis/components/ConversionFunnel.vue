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
    <div class="grid grid-cols-1 gap-14 2xl:grid-cols-[minmax(0,1fr)_280px]">
      <div class="min-w-0">
        <div class="mb-12 flex items-center justify-between gap-12">
          <div class="min-w-0">
            <div class="truncate text-sm text-main font-700">本周转化链路</div>
            <div class="mt-2 truncate text-xs text-secondary">
              成交转化率 4.8%，核心流失集中在试用激活
            </div>
          </div>
          <span
            class="shrink-0 rounded-999 bg-primary-tint px-10 py-4 text-xs text-primary"
          >
            实时
          </span>
        </div>

        <div class="flex flex-col gap-10">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="analysis-funnel-stage rounded-8 border-1 border-solid border-color-2 bg-fill-tertiary p-10"
            tabindex="0"
          >
            <div class="mb-8 flex items-center justify-between gap-10">
              <div class="min-w-0">
                <div class="truncate text-sm text-main font-700">
                  {{ stage.title }}
                </div>
                <div class="mt-1 truncate text-xs text-secondary">
                  {{ stage.value }} 人
                </div>
              </div>
              <div class="shrink-0 text-right">
                <div class="text-sm text-main font-800">{{ stage.rate }}%</div>
                <div class="mt-1 text-xs" :class="stage.toneClass">
                  {{ stage.trend }}
                </div>
              </div>
            </div>
            <div class="h-7 overflow-hidden rounded-999 bg-fill-secondary">
              <div
                class="analysis-funnel-progress h-full rounded-999 bg-gradient-to-r transition-[width]"
                :class="stage.fillClass"
                :style="{ width: `${stage.rate}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-10 sm:grid-cols-3 2xl:grid-cols-1">
        <div
          v-for="item in insights"
          :key="item.id"
          class="analysis-insight-card min-w-0 rounded-8 border-1 border-solid border-color-2 bg-container px-12 py-11"
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
              <div class="mt-3 truncate text-lg text-main font-800">
                {{ item.value }}
              </div>
              <div class="mt-2 truncate text-xs text-secondary">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.analysis-funnel-stage,
.analysis-insight-card {
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.analysis-funnel-stage:hover,
.analysis-funnel-stage:focus-visible,
.analysis-insight-card:hover,
.analysis-insight-card:focus-visible {
  border-color: rgb(var(--w-color-primary) / 32%);
  box-shadow: 0 8px 20px rgb(var(--w-shadow-color) / 10%);
  transform: translateY(-1px);
}

.analysis-funnel-stage:focus-visible,
.analysis-insight-card:focus-visible {
  outline: 2px solid rgb(var(--w-color-primary) / 36%);
  outline-offset: 2px;
}

.analysis-funnel-progress {
  transform-origin: left center;
  transition:
    filter 160ms ease,
    transform 160ms ease,
    width 240ms ease;
}

.analysis-funnel-stage:hover .analysis-funnel-progress,
.analysis-funnel-stage:focus-visible .analysis-funnel-progress {
  filter: saturate(1.2);
  transform: scaleY(1.2);
}

@media (prefers-reduced-motion: reduce) {
  .analysis-funnel-stage,
  .analysis-insight-card,
  .analysis-funnel-progress {
    transition: none;
  }

  .analysis-funnel-stage:hover,
  .analysis-funnel-stage:focus-visible,
  .analysis-insight-card:hover,
  .analysis-insight-card:focus-visible,
  .analysis-funnel-stage:hover .analysis-funnel-progress,
  .analysis-funnel-stage:focus-visible .analysis-funnel-progress {
    transform: none;
  }
}
</style>
