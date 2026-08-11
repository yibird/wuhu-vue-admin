<script setup lang="ts">
import { JsonView } from '@/components/jsonView'
import { Scrollbar } from '@/components/scrollbar'
import type { JsonValue } from '@/components/jsonView'

const jsonData: JsonValue = {
  project: 'wuhu-admin',
  runtime: {
    framework: 'Vue 3.5',
    language: 'TypeScript',
    bundler: 'Vite 8',
  },
  modules: [
    { name: 'dashboard', enabled: true },
    { name: 'workflow', enabled: true },
    { name: 'low-code', enabled: true },
  ],
}
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
            <h1 class="m-0 text-xl text-main font-600">JsonView</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              支持折叠、复制、选择和编辑的 JSON 视图。
            </p>
          </div>
          <a-tag color="blue">src/components/jsonView</a-tag>
        </header>

        <div class="max-h-480 overflow-auto rounded-6">
          <JsonView
            :data="jsonData"
            :deep="3"
            editable
            highlight-selected-node
            select-on-click-node
            show-select-controller
          />
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
