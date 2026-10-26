<template>
  <header
    class="flex flex-wrap items-center justify-between gap-12 rounded-8 b-1-regular bg-container px-14 py-12 shadow-card"
  >
    <div class="min-w-0">
      <div class="flex items-center gap-8">
        <span
          class="size-34 flex items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:chart-no-axes-combined" :size="18" />
        </span>
        <div class="min-w-0">
          <h1 class="m-0 truncate text-17px font-800 text-primary">
            Chart Designer
          </h1>
          <p class="m-0 mt-2 truncate text-12px text-secondary">
            AI 生成数据大屏，绑定数据源后继续精修图表
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-8">
      <span class="rounded-6 bg-fill px-9 py-5 text-12px text-secondary">
        {{ stats.sourceCount }} 数据源
      </span>
      <span class="rounded-6 bg-fill px-9 py-5 text-12px text-secondary">
        {{ stats.widgetCount }} 组件
      </span>
      <a-button @click="emits('openSchema')">
        <template #icon>
          <Icon name="i-lucide:braces" :size="15" />
        </template>
        Schema 源码
      </a-button>
      <a-button @click="emits('openHistory')">
        <template #icon>
          <Icon name="i-lucide:history" :size="15" />
        </template>
        历史
      </a-button>
      <a-button @click="emits('openPreview')">
        <template #icon>
          <Icon name="i-lucide:play" :size="15" />
        </template>
        预览
      </a-button>
      <a-button @click="emits('openShare')">
        <template #icon>
          <Icon name="i-lucide:share-2" :size="15" />
        </template>
        分享
      </a-button>
      <a-button @click="emits('copySchema')">
        <template #icon>
          <Icon name="i-lucide:copy" :size="15" />
        </template>
        复制 Schema
      </a-button>
      <a-button type="primary" @click="emits('exportSchema')">
        <template #icon>
          <Icon name="i-lucide:download" :size="15" />
        </template>
        导出
      </a-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ChartDesignerStats } from '../types'

defineProps<{
  stats: ChartDesignerStats
}>()

const emits = defineEmits<{
  copySchema: []
  exportSchema: []
  openHistory: []
  openPreview: []
  openSchema: []
  openShare: []
}>()
</script>
