<script lang="ts" setup>
import { message } from 'antdv-next'
import { useLoading } from '@/composables'
import {
  Overview,
  Statistics,
  VisitStatistics,
  ConversionFunnel,
  HotSearch,
  HotItems,
} from './components'
import Skeleton from './components/Skeleton.vue'
import { cards } from './config'

const { isLoading } = useLoading()
const exporting = shallowRef(false)
let exportTimer: ReturnType<typeof setTimeout> | undefined

function handleExport() {
  if (exporting.value) return

  exporting.value = true
  exportTimer = setTimeout(() => {
    exporting.value = false
    message.success('分析报表已生成')
  }, 680)
}

onBeforeUnmount(() => {
  if (exportTimer) clearTimeout(exportTimer)
})
</script>

<template>
  <WView :full="false" class="overflow-hidden bg-page">
    <Skeleton v-if="isLoading" />
    <div v-else class="analysis-page w-full flex flex-col gap-12">
      <section
        class="page-enter page-enter--1 analysis-hero overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container px-14 py-14 shadow-[var(--w-shadow-card)] transition-[border-color,box-shadow,transform] duration-180 ease-out sm:px-18 sm:py-16 hover:(-translate-y-1 border-primary/30 shadow-[0_10px_30px_rgb(var(--w-shadow-color)_/_12%)])"
      >
        <div class="flex flex-wrap items-center justify-between gap-12">
          <div class="min-w-0">
            <h1 class="text-md text-main font-700 sm:text-lg">数据分析</h1>
            <p class="mt-4 text-xs text-secondary">
              关键指标、访问趋势与热门内容概览
            </p>
          </div>
          <div class="flex items-center gap-8">
            <span
              class="inline-flex items-center gap-5 rounded-999 bg-success-tint px-10 py-5 text-xs text-success"
            >
              <Icon
                name="i-lucide:activity"
                :size="13"
                class="animate-pulse motion-reduce:animate-none"
              />
              实时更新
            </span>
            <a-button size="small" :loading="exporting" @click="handleExport">
              <template #icon>
                <Icon name="i-lucide:download" />
              </template>
              导出
            </a-button>
          </div>
        </div>
      </section>

      <Overview class="page-enter page-enter--2" :items="cards" />
      <Statistics class="page-enter page-enter--3" />

      <div
        class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
      >
        <main class="min-w-0 flex flex-col gap-12">
          <VisitStatistics class="page-enter page-enter--4" />
          <ConversionFunnel class="page-enter page-enter--5" />
        </main>
        <aside class="min-w-0 flex flex-col gap-12">
          <HotSearch class="page-enter page-enter--4" />
          <HotItems class="page-enter page-enter--5" />
        </aside>
      </div>
    </div>
  </WView>
</template>
