<template>
  <ViewSection skeleton-name="monitor-header" :loading="!!props.loading">
    <a-border-beam :duration="6" :line-width="3">
      <section
        class="monitor-hero page-enter page-enter--1 relative mb-12 overflow-hidden rounded-8 b-1-secondary bg-container shadow-sm"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-12 b-b-1-secondary px-14 py-14 sm:(px-18 py-16)"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-10">
              <h1 class="m-0 text-md text-main font-700 sm:text-lg">
                服务器监控
              </h1>
              <span
                class="inline-flex items-center gap-5 rounded-999 px-9 py-4 text-xs"
                :class="
                  props.criticalAlertCount > 0
                    ? 'bg-error/10 text-error'
                    : 'bg-success/10 text-success'
                "
              >
                <Icon
                  :name="
                    props.criticalAlertCount > 0
                      ? 'i-lucide:circle-alert'
                      : 'i-lucide:circle-check'
                  "
                  :size="13"
                />
                {{ props.criticalAlertCount > 0 ? '需要处理' : '运行正常' }}
              </span>
            </div>
            <div class="mt-5 text-xs text-secondary">
              最近刷新 {{ props.lastRefreshAt }} · 自动刷新
              {{ props.autoRefresh ? '已开启' : '已关闭' }}
            </div>
          </div>

          <div
            class="flex flex-wrap items-center justify-start gap-8 sm:justify-end"
          >
            <a-switch
              :checked="props.autoRefresh"
              @update:checked="emits('update:autoRefresh', $event)"
            />
            <span class="text-xs text-secondary">自动刷新</span>
            <a-button :loading="props.refreshing" @click="emits('refresh')">
              <template #icon>
                <Icon
                  name="i-lucide:refresh-cw"
                  :class="{
                    'animate-spin ': props.refreshing,
                  }"
                />
              </template>
              刷新
            </a-button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-0 sm:grid-cols-3">
          <div class="px-14 py-12 sm:(px-18 py-14)">
            <div class="text-xs text-secondary">健康评分</div>
            <div class="mt-6 flex items-end gap-6">
              <span class="monitor-hero__score text-xl font-800 sm:text-2xl">{{
                props.healthScore
              }}</span>
              <span class="pb-2 text-xs text-secondary">/ 100</span>
            </div>
          </div>
          <div
            class="b-y-1-[border-secondary] px-14 py-12 sm:(b-x-1-[border-secondary] border-y-0)"
          >
            <div class="text-xs text-secondary">运行服务</div>
            <div class="mt-6 text-xl text-main font-800 sm:text-2xl">
              {{ props.runningServiceCount }}
              <span class="text-secondary">/</span>
              {{ props.totalServiceCount }}
            </div>
          </div>
          <div class="px-14 py-12 sm:(px-18 py-14)">
            <div class="text-xs text-secondary">未处理告警</div>
            <div class="mt-6 text-xl text-main font-800 sm:text-2xl">
              {{ props.unresolvedAlertCount }}
            </div>
          </div>
        </div>
      </section>
    </a-border-beam>
  </ViewSection>
</template>

<script lang="ts" setup>
import { ViewSection } from '@/components/view-section'

const props = defineProps<{
  criticalAlertCount: number
  lastRefreshAt: string
  autoRefresh: boolean
  refreshing: boolean
  healthScore: number
  runningServiceCount: number
  totalServiceCount: number
  unresolvedAlertCount: number
  loading?: boolean
}>()

const emits = defineEmits<{
  'update:autoRefresh': [value: boolean]
  refresh: []
}>()
</script>

<style lang="less" scoped>
.monitor-hero {
  background-image:
    radial-gradient(
      520px 210px at 100% 0%,
      rgb(var(--w-color-primary) / 16%),
      transparent 70%
    ),
    linear-gradient(120deg, rgb(var(--w-color-primary) / 8%), transparent 52%);
}

.monitor-hero__score {
  background: linear-gradient(
    135deg,
    rgb(var(--w-color-primary)),
    rgb(var(--w-color-primary) / 62%)
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
