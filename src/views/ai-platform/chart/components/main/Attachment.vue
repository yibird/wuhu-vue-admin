<template>
  <button
    type="button"
    class="size-34 inline-flex items-center justify-center rounded-full border-1 border-transparent border-solid bg-transparent text-regular cursor-pointer transition-colors hover:border-color-muted hover:bg-hover hover:text-main disabled:cursor-not-allowed disabled:text-disabled"
    title="添加附件"
    :disabled="disabled"
    @click="openFilePicker"
  >
    <Icon name="i-lucide:paperclip" :size="18" />
  </button>
  <input
    ref="fileInput"
    class="hidden"
    multiple
    type="file"
    @change="handleFileChange"
  />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emit = defineEmits<{
  select: [files: File[]]
}>()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')

function openFilePicker() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  const files = Array.from(target.files ?? [])
  if (files.length) {
    emit('select', files)
  }
  target.value = ''
}
</script>
