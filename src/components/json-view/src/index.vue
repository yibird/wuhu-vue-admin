<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { message } from 'antdv-next'
import { CodeEditor } from '@/components/code-editor'
import type { JsonValue, JsonViewEmits, JsonViewProps } from './types'

const props = withDefaults(defineProps<JsonViewProps>(), {
  data: () => ({}),
  readonly: true,
  indent: 2,
  height: 320,
  bordered: true,
  showCopy: true,
})

const emit = defineEmits<JsonViewEmits>()
const sourceCode = shallowRef(formatJson(props.data, props.indent))
const { copy, isSupported } = useClipboard()

const editorHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

function normalizeIndent(indent: number) {
  return Math.min(10, Math.max(0, Math.floor(indent)))
}

function formatJson(value: JsonValue, indent: number) {
  return JSON.stringify(value, null, normalizeIndent(indent))
}

function syncSourceCode(value: JsonValue) {
  const nextValue = formatJson(value, props.indent)
  if (nextValue !== sourceCode.value) sourceCode.value = nextValue
}

watch(
  () => [props.data, props.indent, props.version] as const,
  ([value]) => syncSourceCode(value)
)

function onSourceCodeChange(value: string) {
  sourceCode.value = value
  if (props.readonly) return

  try {
    const parsed = JSON.parse(value) as JsonValue
    emit('update:data', parsed)
  } catch {
    // 保留编辑中的非法 JSON，等待用户继续输入完成后再同步数据。
  }
}

async function onCopy() {
  if (!isSupported.value) {
    message.warning('当前环境不支持剪贴板操作')
    return
  }

  try {
    await copy(sourceCode.value)
    message.success('复制成功')
    emit('copy', props.data)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    message.error(`复制失败：${errorMessage}`)
  }
}
</script>

<template>
  <div
    class="relative min-h-0 overflow-hidden rounded-8"
    :class="{ 'border-1 border-color-2 border-solid': props.bordered }"
    :style="{ height: editorHeight }"
  >
    <a-tooltip v-if="props.showCopy" title="复制 JSON">
      <a-button
        class="absolute right-10 top-10 z-1"
        type="text"
        size="small"
        aria-label="复制 JSON"
        :disabled="!isSupported"
        @click.stop="onCopy"
      >
        <template #icon>
          <Icon name="i-lucide:copy" :size="18" />
        </template>
      </a-button>
    </a-tooltip>

    <CodeEditor
      :model-value="sourceCode"
      language="json"
      :readonly="props.readonly"
      class="h-full min-h-0"
      :style="{ border: 'none', borderRadius: 0 }"
      @update:model-value="onSourceCodeChange"
    />
  </div>
</template>
