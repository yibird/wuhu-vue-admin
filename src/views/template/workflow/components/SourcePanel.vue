<script setup lang="ts">
import { CodeEditor } from '@/components/codeEditor'

defineProps<{
  error?: string
  open: boolean
  sourceCode: string
}>()

defineEmits<{
  apply: []
  close: []
  copy: []
  download: []
  format: []
  'source-change': [value: string]
}>()
</script>

<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="920"
    class="workflow-source-modal"
    title="JSONSchema 源码"
    @cancel="$emit('close')"
  >
    <div class="grid h-[70vh] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
      <header
        class="mb-12 flex items-start justify-between gap-14 rounded-8 border-1 border-color-2 border-solid bg-fill-quaternary px-12 py-10"
      >
        <div class="min-w-0 flex items-start gap-10">
          <span
            class="size-36 inline-flex shrink-0 items-center justify-center rounded-8 icon-primary-soft"
          >
            <Icon name="i-lucide:file-json" :size="18" />
          </span>
          <div class="min-w-0">
            <div class="truncate text-sm text-main font-600">
              工作流 JSONSchema
            </div>
            <div class="mt-2 text-xs text-muted">
              支持 JSON 语法高亮，编辑源码后会实时渲染流程图。
            </div>
          </div>
        </div>
        <div
          class="shrink-0 rounded-full border-1 border-color-secondary border-solid bg-main px-8 py-4 text-xs"
          :class="error ? 'text-error' : 'text-success'"
        >
          {{ error ? '解析失败' : '校验通过' }}
        </div>
      </header>

      <CodeEditor
        :model-value="sourceCode"
        data-workflow-source-input
        language="json"
        @update:model-value="$emit('source-change', $event)"
      />

      <footer
        class="mt-12 flex flex-wrap items-center justify-between gap-10 border-t-1 border-t-solid border-color-2 pt-12"
      >
        <div
          class="min-h-24 min-w-0 flex-1 truncate text-xs leading-18px"
          :class="error ? 'text-error' : 'text-muted'"
        >
          {{ error || 'Schema 校验通过，画布已同步更新。' }}
        </div>
        <div class="flex shrink-0 items-center gap-8">
          <a-button size="small" class="!h-34" @click="$emit('format')">
            <Icon name="i-lucide:braces" :size="15" />
            格式化
          </a-button>
          <a-button size="small" class="!h-34" @click="$emit('copy')">
            <Icon name="i-lucide:copy" :size="15" />
            复制
          </a-button>
          <a-button size="small" class="!h-34" @click="$emit('download')">
            <Icon name="i-lucide:download" :size="15" />
            导出
          </a-button>
          <a-button
            type="primary"
            size="small"
            class="!h-34"
            @click="$emit('apply')"
          >
            <Icon name="i-lucide:check" :size="15" />
            应用
          </a-button>
        </div>
      </footer>
    </div>
  </a-modal>
</template>
