<script lang="ts" setup>
import Card from './Card.vue'
import type { MonitorTone, RecommendAppEmits, RecommendAppProps } from './types'

const { items = [], loading = false } = defineProps<RecommendAppProps>()
const emit = defineEmits<RecommendAppEmits>()

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
    v-if="loading"
    title="应用中心"
    icon="i-lucide:package-plus"
    description="常用运维应用与可安装组件"
  >
    <div class="flex flex-col gap-8">
      <div
        v-for="item in 4"
        :key="item"
        class="rounded-8 border-1 border-solid border-color-2 p-10"
      >
        <a-skeleton active avatar :paragraph="{ rows: 1 }" />
        <div class="mt-10 flex justify-between gap-8">
          <a-skeleton-button active size="small" />
          <a-skeleton-button active size="small" />
        </div>
      </div>
    </div>
  </Card>
  <Card
    v-else
    title="应用中心"
    icon="i-lucide:package-plus"
    description="常用运维应用与可安装组件"
  >
    <div class="flex flex-col gap-8">
      <div
        v-for="item in items"
        :key="item.id"
        class="min-w-0 rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-10 transition-[border-color,background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-2 border-color-primary bg-hover shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]) active:(translate-y-0 scale-[0.995]) motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      >
        <div class="flex items-center gap-10">
          <div
            :class="[
              'h-40 w-40 shrink-0 flex items-center justify-center rounded-8',
              toneClassMap[item.tone],
            ]"
          >
            <Icon :name="item.icon" :size="18" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-6">
              <div class="truncate text-sm text-main font-700">
                {{ item.title }}
              </div>
              <span
                class="shrink-0 rounded-999 bg-fill-quaternary px-6 py-2 text-xs text-secondary"
              >
                {{ item.version }}
              </span>
            </div>
            <div class="mt-3 truncate text-xs text-secondary">
              {{ item.description }}
            </div>
          </div>
        </div>
        <div class="mt-10 flex items-center justify-between gap-8">
          <span
            :class="[
              'rounded-999 px-8 py-3 text-xs',
              item.status === 'installed'
                ? 'bg-success-tint text-success'
                : 'bg-primary-tint text-primary',
            ]"
          >
            {{ item.status === 'installed' ? '已安装' : '可安装' }}
          </span>
          <div class="flex items-center gap-6">
            <a-button size="small" @click="emit('open', item)">详情</a-button>
            <a-button
              v-if="item.status === 'available'"
              size="small"
              type="primary"
              @click="emit('install', item)"
            >
              安装
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
