<script setup lang="ts">
import { Scrollbar } from '@/components/scrollbar'
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Scrollbar</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              OverlayScrollbars 的项目级容器封装。
            </p>
          </div>
          <a-tag color="blue">src/components/scrollbar</a-tag>
        </header>

        <div
          class="h-340 overflow-hidden rounded-6 border-1 border-color-2 border-solid"
        >
          <Scrollbar content-class="grid gap-10 p-14">
            <div
              v-for="index in 18"
              :key="index"
              class="h-44 flex items-center justify-between rounded-6 bg-fill-1 px-14"
            >
              <span class="text-sm text-main">滚动内容 {{ index }}</span>
              <span class="text-xs text-muted">
                #{{ String(index).padStart(2, '0') }}
              </span>
            </div>
          </Scrollbar>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
