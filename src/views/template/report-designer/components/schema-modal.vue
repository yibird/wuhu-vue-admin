<script setup lang="ts">
import { CodeEditor } from '@/components/code-editor'

defineProps<{
  error: string
  open: boolean
  sourceCode: string
}>()

defineEmits<{
  apply: []
  close: []
  copy: []
  export: []
  format: []
  'source-change': [value: string]
}>()
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    :width="980"
    destroy-on-hidden
    title="报表 Schema 源码"
    @cancel="$emit('close')"
    @update:open="(value: boolean) => !value && $emit('close')"
  >
    <div
      class="grid h-[72vh] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-12px"
    >
      <header
        class="flex flex-wrap items-start justify-between gap-12px rounded-8px border-1 border-color-2 border-solid bg-page p-12px"
      >
        <div class="min-w-0 flex items-start gap-10px">
          <span
            class="size-38px inline-flex shrink-0 items-center justify-center rounded-8px bg-fill text-info"
          >
            <Icon name="i-lucide:file-json-2" :size="20" />
          </span>
          <div class="min-w-0">
            <strong class="block truncate text-14px text-primary font-700">
              企业报表 JSONSchema
            </strong>
            <span class="mt-3px block text-12px text-tertiary leading-18px">
              包含数据源、字段、打印、导出、权限和性能策略，应用后会同步到当前设计器。
            </span>
          </div>
        </div>
        <span
          class="rounded-full border-1 border-solid px-10px py-4px text-12px"
          :class="
            error
              ? 'border-error bg-container text-error'
              : 'border-success bg-container text-success'
          "
        >
          {{ error ? '解析失败' : '可编辑' }}
        </span>
      </header>

      <CodeEditor
        :model-value="sourceCode"
        language="json"
        @update:model-value="$emit('source-change', $event)"
      />

      <footer
        class="flex flex-wrap items-center justify-between gap-10px border-t-1 border-t-solid border-color-2 pt-12px"
      >
        <div
          class="min-h-24px min-w-0 flex-1 truncate text-12px leading-18px"
          :class="error ? 'text-error' : 'text-tertiary'"
        >
          {{ error || 'Schema 校验通过后可应用到当前报表设计器。' }}
        </div>
        <div class="flex shrink-0 items-center gap-8px">
          <a-button @click="$emit('format')">
            <template #icon>
              <Icon name="i-lucide:braces" />
            </template>
            格式化
          </a-button>
          <a-button @click="$emit('copy')">
            <template #icon>
              <Icon name="i-lucide:copy" />
            </template>
            复制
          </a-button>
          <a-button @click="$emit('export')">
            <template #icon>
              <Icon name="i-lucide:download" />
            </template>
            导出
          </a-button>
          <a-button type="primary" @click="$emit('apply')">
            <template #icon>
              <Icon name="i-lucide:check" />
            </template>
            应用
          </a-button>
        </div>
      </footer>
    </div>
  </a-modal>
</template>
