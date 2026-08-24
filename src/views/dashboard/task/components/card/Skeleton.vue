<script setup lang="ts">
import type { ScrollbarProps } from '@/components/scrollbar'

const scrollbarOptions = {
  overflow: { x: 'hidden', y: 'scroll' },
} satisfies ScrollbarProps['options']
</script>

<template>
  <div
    class="grid h-full min-h-0 grid-cols-1 gap-10 overflow-y-auto md:grid-cols-3 xl:grid-cols-4 xl:overflow-hidden 2xl:grid-cols-6"
    aria-label="任务看板加载中"
    aria-busy="true"
  >
    <div
      v-for="group in 4"
      :key="group"
      class="min-h-0 min-w-0 xl:overflow-hidden"
    >
      <div
        class="max-h-full min-h-0 flex flex-col overflow-hidden rounded-4 bg-container"
      >
        <div class="shrink-0 flex items-center justify-between gap-10 p-10">
          <a-skeleton-button active size="small" class="!w-74" />
          <a-skeleton-input active size="small" class="!w-64" />
        </div>
        <Scrollbar
          class="min-w-0 flex-1 overflow-hidden"
          :options="scrollbarOptions"
        >
          <div class="min-h-200 flex flex-col gap-10 p-10">
            <div
              v-for="item in group === 4 ? 2 : 3"
              :key="item"
              class="min-h-176 rounded-6 border-1 border-color-2 border-solid p-10"
            >
              <div class="flex justify-between gap-8">
                <a-skeleton-input active size="small" class="!w-136" />
                <a-skeleton-button active size="small" class="!w-54" />
              </div>
              <a-skeleton
                active
                class="mt-10"
                :title="false"
                :paragraph="{ rows: 2 }"
              />
              <div class="mt-10 flex items-center gap-8">
                <a-skeleton-avatar active size="small" />
                <a-skeleton-input active size="small" class="!w-72" />
              </div>
              <a-skeleton-input active size="small" class="mt-16 !w-full" />
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  </div>
</template>
