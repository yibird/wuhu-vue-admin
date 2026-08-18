<script lang="ts" setup>
import { NumberTicker } from '@/components/numberTicker'
import Card from './Card.vue'
import type { MonitorTone, OverviewProps } from './types'

const { items = [] } = defineProps<OverviewProps>()

const toneClassMap: Record<MonitorTone, string> = {
  primary: 'icon-primary-soft',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
  error: 'bg-error-tint text-error',
  info: 'bg-info-tint text-info',
}
</script>

<template>
  <Card
    title="资源概览"
    icon="i-lucide:gauge"
    description="核心资源、任务与应用概况"
  >
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 2xl:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="group min-w-0 rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-14 transition-[border-color,background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-2 border-color-primary bg-hover shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]) active:(translate-y-0 scale-[0.995]) motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      >
        <div class="flex items-start justify-between gap-12">
          <div class="min-w-0">
            <div class="truncate text-sm text-secondary">{{ item.title }}</div>
            <div class="mt-8 flex items-end gap-4 text-xl text-main font-700">
              <NumberTicker :value="item.value" />
              <span v-if="item.suffix" class="pb-3 text-xs text-secondary">
                {{ item.suffix }}
              </span>
            </div>
          </div>
          <span
            :class="[
              'h-36 w-36 flex shrink-0 items-center justify-center rounded-8',
              toneClassMap[item.tone],
            ]"
          >
            <Icon :name="item.icon" :size="18" />
          </span>
        </div>
        <div class="mt-12 flex items-center justify-between gap-10">
          <span class="min-w-0 truncate text-xs text-secondary">
            {{ item.description }}
          </span>
          <span
            :class="[
              'shrink-0 rounded-999 px-8 py-3 text-xs',
              toneClassMap[item.tone],
            ]"
          >
            {{ item.trend }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>
