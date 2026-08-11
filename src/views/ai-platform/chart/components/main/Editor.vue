<template>
  <div
    class="min-w-0 rounded-12 transition-colors"
    :class="isDragging ? 'bg-primary-tint' : ''"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <textarea
      ref="textareaRef"
      v-model="model"
      data-testid="agent-prompt-input"
      class="box-border block max-h-160 min-h-34 w-full resize-none overflow-y-auto border-0 bg-transparent px-2 py-5 text-15px text-main leading-24px outline-0 placeholder:text-placeholder disabled:cursor-not-allowed disabled:text-disabled"
      :disabled="disabled"
      aria-label="Agent 输入框"
      aria-multiline="true"
      placeholder="给 Agent 发送消息"
      rows="1"
      @keydown.enter.exact="handleEnter"
      @paste="handlePaste"
    />
  </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emit = defineEmits<{
  addFiles: [files: File[]]
  submit: []
}>()

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef')
const isDragging = shallowRef(false)
const dragDepth = shallowRef(0)

useTextareaAutosize({
  element: textareaRef,
  input: model,
})

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus })

function emitFiles(files: File[]) {
  if (!files.length) return
  emit('addFiles', files)
}

function handleEnter(event: KeyboardEvent) {
  if (event.isComposing) return
  event.preventDefault()
  emit('submit')
}

function handleDragEnter() {
  dragDepth.value += 1
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  const currentTarget = event.currentTarget
  const relatedTarget = event.relatedTarget
  if (
    currentTarget instanceof HTMLElement &&
    relatedTarget instanceof Node &&
    currentTarget.contains(relatedTarget)
  ) {
    return
  }

  dragDepth.value = Math.max(0, dragDepth.value - 1)
  isDragging.value = dragDepth.value > 0
}

function handleDrop(event: DragEvent) {
  dragDepth.value = 0
  isDragging.value = false
  emitFiles(Array.from(event.dataTransfer?.files ?? []))
}

function handlePaste(event: ClipboardEvent) {
  emitFiles(Array.from(event.clipboardData?.files ?? []))
}
</script>
