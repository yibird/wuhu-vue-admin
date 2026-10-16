<script setup lang="ts">
import { CodeEditor } from '@/components/code-editor'

defineProps<{
  error: string
}>()

const open = defineModel<boolean>('open', { required: true })
const draft = defineModel<string>('draft', { required: true })

defineEmits<{
  copy: []
  export: []
  format: []
}>()
</script>

<template>
  <a-modal v-model:open="open" :footer="null" title="Schema 源码" width="980px">
    <div class="h-[72vh] min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-10">
      <div class="flex flex-wrap items-center justify-between gap-8">
        <p
          class="m-0 text-12px"
          :class="error ? 'text-error' : 'text-secondary'"
        >
          {{ error || '编辑合法 JSON 后会实时渲染到画布。' }}
        </p>
        <div class="flex items-center gap-8">
          <a-button @click="$emit('format')">
            <template #icon>
              <Icon name="i-lucide:align-left" :size="14" />
            </template>
            格式化
          </a-button>
          <a-button @click="$emit('copy')">
            <template #icon>
              <Icon name="i-lucide:copy" :size="14" />
            </template>
            复制
          </a-button>
          <a-button type="primary" @click="$emit('export')">
            <template #icon>
              <Icon name="i-lucide:download" :size="14" />
            </template>
            导出
          </a-button>
        </div>
      </div>
      <div
        class="min-h-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid"
      >
        <CodeEditor v-model="draft" language="json" />
      </div>
    </div>
  </a-modal>
</template>
