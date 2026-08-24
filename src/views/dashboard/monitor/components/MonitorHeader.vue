<script lang="ts" setup>
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

const emit = defineEmits<{
  'update:autoRefresh': [value: boolean]
  refresh: []
}>()
</script>

<template>
  <section
    v-if="props.loading"
    class="mb-12 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
    aria-label="监控摘要加载中"
    aria-busy="true"
  >
    <div
      class="border-b-1 border-b-solid border-color-2 px-14 py-14 sm:px-18 sm:py-16"
    >
      <div class="flex items-center justify-between gap-12">
        <div class="min-w-0">
          <a-skeleton-input active class="!w-118" />
          <a-skeleton-input active size="small" class="!mt-8 !w-220" />
        </div>
        <div class="flex gap-8">
          <a-skeleton-button active size="small" class="!w-76" />
          <a-skeleton-button active size="small" class="!w-82" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-0 sm:grid-cols-3">
      <div v-for="item in 3" :key="item" class="px-14 py-12 sm:px-18 sm:py-14">
        <a-skeleton-input active size="small" class="!w-72" />
        <a-skeleton-input active size="large" class="!mt-8 !w-104" />
      </div>
    </div>
  </section>

  <section
    v-else
    class="page-enter page-enter--1 mb-12 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 py-14 sm:px-18 sm:py-16"
    >
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-10">
          <h1 class="m-0 text-md text-main font-700 sm:text-lg">服务器监控</h1>
          <span
            class="inline-flex items-center gap-5 rounded-999 px-9 py-4 text-xs"
            :class="
              props.criticalAlertCount > 0
                ? 'bg-error-tint text-error'
                : 'bg-success-tint text-success'
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
          @update:checked="emit('update:autoRefresh', $event)"
        />
        <span class="text-xs text-secondary">自动刷新</span>
        <a-button :loading="props.refreshing" @click="emit('refresh')">
          <template #icon>
            <Icon
              name="i-lucide:refresh-cw"
              :class="{
                'animate-spin motion-reduce:animate-none': props.refreshing,
              }"
            />
          </template>
          刷新
        </a-button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-0 sm:grid-cols-3">
      <div class="px-14 py-12 sm:px-18 sm:py-14">
        <div class="text-xs text-secondary">健康评分</div>
        <div class="mt-6 flex items-end gap-6">
          <span class="text-xl text-main font-800 sm:text-2xl">{{
            props.healthScore
          }}</span>
          <span class="pb-2 text-xs text-secondary">/ 100</span>
        </div>
      </div>
      <div
        class="border-y-1 border-y-solid border-color-2 px-14 py-12 sm:border-x-1 sm:border-y-0 sm:border-x-solid sm:px-18 sm:py-14"
      >
        <div class="text-xs text-secondary">运行服务</div>
        <div class="mt-6 text-xl text-main font-800 sm:text-2xl">
          {{ props.runningServiceCount }} <span class="text-secondary">/</span>
          {{ props.totalServiceCount }}
        </div>
      </div>
      <div class="px-14 py-12 sm:px-18 sm:py-14">
        <div class="text-xs text-secondary">未处理告警</div>
        <div class="mt-6 text-xl text-main font-800 sm:text-2xl">
          {{ props.unresolvedAlertCount }}
        </div>
      </div>
    </div>
  </section>
</template>
