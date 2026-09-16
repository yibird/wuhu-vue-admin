<template>
  <a-modal
    :open="open"
    title="应用源码（Schema）"
    :width="860"
    :footer="null"
    :destroy-on-close="true"
    @cancel="emit('close')"
  >
    <div class="grid gap-10">
      <div class="flex-between-center">
        <span class="text-xs text-secondary">
          Schema 是低代码平台的唯一事实来源，可导出 / 导入 / 版本管理
        </span>
        <div class="flex gap-6">
          <a-button @click="format">格式化</a-button>
          <a-button @click="copy">复制</a-button>
          <a-button @click="download">下载</a-button>
          <a-button type="primary" @click="apply">应用到设计器</a-button>
        </div>
      </div>
      <div
        class="h-560px overflow-hidden rounded-8 border-1 border-color-2 border-solid"
      >
        <CodeEditor v-model="code" language="json" />
      </div>
      <div v-if="error" class="text-xs text-error">{{ error }}</div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { ref, watch } from 'vue'
import { CodeEditor } from '@/components'
import { useDesignerContext } from '../composables'
import type { ApplicationSchema } from '../core/schema/types'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()
const code = ref('')
const error = ref('')

watch(
  () => props.open,
  (open) => {
    if (!open) return
    error.value = ''
    code.value = JSON.stringify(designer.schema, null, 2)
  }
)

function format() {
  try {
    code.value = JSON.stringify(JSON.parse(code.value), null, 2)
    error.value = ''
  } catch {
    error.value = 'JSON 格式不正确'
  }
}

async function copy() {
  await navigator.clipboard.writeText(code.value)
  message.success('已复制 Schema')
}

function download() {
  const blob = new Blob([code.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${designer.schema.app.id}.schema.json`
  link.click()
  URL.revokeObjectURL(url)
}

function apply() {
  try {
    const parsed = JSON.parse(code.value) as ApplicationSchema
    if (!parsed.app || !Array.isArray(parsed.pages)) {
      error.value = 'Schema 缺少 app / pages 字段'
      return
    }
    designer.restoreVersion(parsed)
    error.value = ''
    message.success('Schema 已应用')
    emit('close')
  } catch {
    error.value = 'JSON 格式不正确'
  }
}
</script>
