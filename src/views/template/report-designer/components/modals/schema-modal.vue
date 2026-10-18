<template>
  <a-modal
    :open="open"
    title="Schema 导入 / 导出"
    :width="820"
    destroy-on-hidden
    @update:open="(value: boolean) => emits('update:open', value)"
  >
    <p class="m-0 mb-10 text-xs text-secondary">
      编辑下方 JSON 后点击「导入」；REST 数据集凭据会在导出时脱敏。
    </p>
    <a-textarea
      v-model:value="text"
      class="font-mono"
      :auto-size="{ minRows: 16, maxRows: 28 }"
      spellcheck="false"
    />
    <div class="mt-10 flex items-center justify-end gap-8">
      <a-button @click="copy">复制</a-button>
      <a-button @click="emits('download')">下载当前 Schema</a-button>
      <a-button type="primary" @click="apply">导入</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'

const props = withDefaults(
  defineProps<{
    open: boolean
    value: string
  }>(),
  {}
)

const emits = defineEmits<{
  'update:open': [value: boolean]
  apply: [json: string]
  download: []
}>()

const text = shallowRef(props.value)

watch(
  () => props.open,
  (open) => {
    if (!open) return
    text.value = props.value
  }
)

watch(
  () => props.value,
  (value) => {
    if (!props.open) text.value = value
  }
)

function apply() {
  emits('apply', text.value)
}

async function copy() {
  try {
    await navigator.clipboard.writeText(text.value)
    message.success('已复制')
  } catch {
    message.error('复制失败，请手动选择文本')
  }
}
</script>
