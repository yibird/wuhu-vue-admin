<script setup lang="ts">
import { CodeEditor } from '@/components/code-editor'
import type { WorkflowSourceStatus } from '../types'

const props = defineProps<{
  error?: string
  open: boolean
  sourceCode: string
  sourceStatus: WorkflowSourceStatus
}>()

defineEmits<{
  apply: []
  close: []
  copy: []
  download: []
  format: []
  'source-change': [value: string]
}>()

const sourceStats = computed(() => {
  const lineCount = props.sourceCode
    ? props.sourceCode.split(/\r?\n/).length
    : 0
  return lineCount + ' 行 · ' + props.sourceCode.length + ' 字符'
})

const statusLabel = computed(() => {
  if (props.error) return '需要检查'
  if (props.sourceStatus === 'formatted') return '已格式化'
  return '已同步'
})

const statusClass = computed(() => {
  if (props.error) return 'bg-error-tint text-error'
  if (props.sourceStatus === 'formatted') return 'bg-warning-tint text-warning'
  return 'bg-success-tint text-success'
})
</script>

<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="960"
    :title="null"
    :closable="false"
    aria-label="JSONSchema 源码"
    class="workflow-source-modal"
    @cancel="$emit('close')"
  >
    <div
      class="grid h-[70vh] min-h-[480px] max-h-[760px] grid-rows-[auto_minmax(0,1fr)_auto] gap-12"
    >
      <header
        class="flex items-center justify-between gap-14 rounded-10 border-1 border-color-2 border-solid bg-fill-quaternary px-14 py-12"
      >
        <div class="min-w-0 flex items-center gap-10">
          <span
            class="size-40 inline-flex shrink-0 items-center justify-center rounded-10 bg-primary-tint text-primary"
          >
            <Icon name="i-lucide:file-code-2" :size="19" />
          </span>
          <div class="min-w-0 flex flex-col gap-3">
            <div class="truncate text-15px text-main font-700">
              工作流 JSONSchema
            </div>
            <div class="truncate text-xs text-muted">
              workflow.json · DSL 0.0.1
            </div>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-8">
          <span
            class="inline-flex items-center gap-5 rounded-full px-8 py-4 text-xs font-600"
            :class="statusClass"
          >
            <i class="size-6 rounded-full bg-current" />
            {{ statusLabel }}
          </span>
          <a-button
            type="text"
            class="!size-32 !p-0 text-secondary hover:text-main"
            aria-label="关闭源码编辑器"
            title="关闭"
            @click="$emit('close')"
          >
            <Icon name="i-lucide:x" :size="17" />
          </a-button>
        </div>
      </header>

      <section
        class="workflow-source-editor min-h-0 flex flex-col overflow-hidden rounded-10 border-1 border-color-2 border-solid bg-container shadow-card"
      >
        <div
          class="flex flex-none items-center justify-between gap-10 border-b-1 border-color-2 border-b-solid bg-fill-quaternary px-12 py-8"
        >
          <div class="min-w-0 flex items-center gap-7 text-xs text-secondary">
            <Icon name="i-lucide:braces" :size="14" class="text-primary" />
            <span class="truncate">source.json</span>
          </div>
          <span class="shrink-0 text-11px text-placeholder">{{
            sourceStats
          }}</span>
        </div>
        <CodeEditor
          :model-value="sourceCode"
          data-workflow-source-input
          language="json"
          class="min-h-0 flex-1 !rounded-0 !border-0 [&_.cm-editor]:rounded-0"
          @update:model-value="$emit('source-change', $event)"
        />
      </section>

      <footer
        class="flex flex-wrap items-center justify-between gap-10 border-t-1 border-t-solid border-color-2 pt-12"
      >
        <div
          class="min-w-0 flex-1 break-words text-xs leading-18px"
          :class="error ? 'text-error' : 'text-muted'"
        >
          <span v-if="error">{{ error }}</span>
          <span v-else-if="sourceStatus === 'formatted'">
            JSON 已格式化，点击应用时才会校验 DSL。
          </span>
          <span v-else>源码已与画布同步。</span>
        </div>
        <div class="flex shrink-0 items-center gap-8">
          <a-button
            size="small"
            class="!h-34"
            title="格式化 JSON 文本"
            @click="$emit('format')"
          >
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
