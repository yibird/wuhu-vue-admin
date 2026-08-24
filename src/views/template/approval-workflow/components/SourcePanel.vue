<script setup lang="ts">
import { CodeEditor } from '@/components/code-editor'
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'

defineProps<{
  error: string
  open: boolean
  sourceCode: string
}>()

const emit = defineEmits<{
  close: []
  sourceChange: [value: string]
}>()
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    :width="760"
    class="approval-source-modal"
    title="审批流 Schema"
    @cancel="emit('close')"
  >
    <div
      class="grid h-[72vh] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-12"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.source"
    >
      <header
        class="flex items-start justify-between gap-12 rounded-8 border-1 border-color-2 border-solid bg-fill px-12 py-10"
      >
        <div class="min-w-0 flex items-start gap-10">
          <span
            class="size-36 inline-flex shrink-0 items-center justify-center rounded-8 bg-primary/12 text-primary"
          >
            <Icon name="i-lucide:file-json-2" :size="18" />
          </span>
          <div class="min-w-0">
            <h3 class="m-0 truncate text-14px font-800 text-primary">
              流程 Schema 源码
            </h3>
            <p class="m-0 mt-3 text-12px text-secondary">
              可用于后端保存、版本回放和发布审计，编辑后实时同步画布。
            </p>
          </div>
        </div>
        <a-button size="small" @click="emit('close')">关闭</a-button>
      </header>

      <CodeEditor
        :model-value="sourceCode"
        data-approval-source-input
        language="json"
        @update:model-value="emit('sourceChange', $event)"
      />

      <footer
        class="rounded-7 px-10 py-8 text-12px"
        :class="error ? 'bg-error/10 text-error' : 'bg-success/10 text-success'"
      >
        {{ error || 'Schema 可解析，当前配置已同步到画布。' }}
      </footer>
    </div>
  </a-modal>
</template>
