<script setup lang="ts">
import type {
  ChartDataSource,
  ChartDesignerStats,
  ChartScreenConfig,
} from '../types'
import CanvasToolbar from './CanvasToolbar.vue'

defineProps<{
  activeSourceId: string
  dataSources: readonly ChartDataSource[]
  screenConfig: ChartScreenConfig
  stats: ChartDesignerStats
}>()

defineEmits<{
  openDataSource: []
  selectSource: [id: string]
  updateScreen: [patch: Partial<ChartScreenConfig>]
}>()
</script>

<template>
  <header
    class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-12 border-b border-color-2 px-14 py-12"
  >
    <div class="min-w-0">
      <div class="flex items-center gap-8">
        <Icon name="i-lucide:monitor-dot" :size="18" class="text-primary" />
        <h2 class="m-0 truncate text-16px font-700 text-primary">
          {{ screenConfig.title }}
        </h2>
      </div>
      <p class="m-0 mt-4 truncate text-12px text-secondary">
        {{ screenConfig.subtitle }}
      </p>
    </div>
    <div class="min-w-0 flex flex-wrap items-center justify-end gap-8">
      <div class="hidden items-center gap-8 text-12px text-secondary 2xl:flex">
        <span class="rounded-6 bg-fill px-8 py-4"
          >{{ stats.widgetCount }} 组件</span
        >
        <span class="rounded-6 bg-fill px-8 py-4">
          {{ stats.onlineSourceCount }} 在线源
        </span>
        <span class="rounded-6 bg-fill px-8 py-4">{{
          stats.refreshLabel
        }}</span>
      </div>
      <CanvasToolbar
        :active-source-id="activeSourceId"
        :data-sources="dataSources"
        :screen-config="screenConfig"
        @open-data-source="$emit('openDataSource')"
        @select-source="$emit('selectSource', $event)"
        @update-screen="$emit('updateScreen', $event)"
      />
    </div>
  </header>
</template>
