<template>
  <button
    type="button"
    class="size-34 inline-flex items-center justify-center rounded-full b-1-transparent bg-transparent text-regular cursor-pointer transition-colors hover:(border-muted bg-hover text-main) disabled:(cursor-not-allowed text-disabled)"
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
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emits = defineEmits<{
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
    emits('select', files)
  }
  target.value = ''
}
</script>
