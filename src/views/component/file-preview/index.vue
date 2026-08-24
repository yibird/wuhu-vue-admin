<script setup lang="ts">
import { shallowRef } from 'vue'
import { FilePreview } from '@/components/file-preview'
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'
import type { FilePreviewSource } from '@/components/file-preview'
import type { JsonValue } from '@/components/json-view'

const previewOpen = shallowRef(false)
const previewData: JsonValue = {
  project: 'wuhu-admin',
  runtime: 'Vue 3.5',
  enabled: true,
}
const previewFile: FilePreviewSource = {
  filename: 'component-config.json',
  kind: 'text',
  mimeType: 'application/json',
  url: `data:application/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(previewData, null, 2)
  )}`,
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
            <h1 class="m-0 text-xl text-main font-600">FilePreview</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              按文件类型分派图片、媒体、文本和文档预览。
            </p>
          </div>
          <a-tag color="blue">src/components/file-preview</a-tag>
        </header>

        <div class="grid gap-14">
          <div
            class="flex flex-wrap items-center justify-between gap-12 rounded-6 border-1 border-color-1 border-solid bg-fill-1 p-16"
          >
            <div class="min-w-0 flex items-center gap-12">
              <div
                class="size-40 shrink-0 flex items-center justify-center rounded-6 bg-primary/10 text-primary"
              >
                <Icon name="i-lucide:file-json-2" :size="21" />
              </div>
              <div class="min-w-0">
                <p class="m-0 truncate text-sm text-main font-500">
                  {{ previewFile.filename }}
                </p>
                <p class="mb-0 mt-3 text-xs text-muted">JSON · 内存示例文件</p>
              </div>
            </div>
            <a-button type="primary" @click="previewOpen = true">
              <template #icon><Icon name="i-lucide:eye" /></template>
              打开预览
            </a-button>
          </div>
          <a-alert
            show-icon
            type="info"
            message="FilePreview 会根据扩展名和 MIME 类型选择对应预览器。"
          />
          <FilePreview v-model:open="previewOpen" :file="previewFile" />
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
