<template>
  <div class="max-w-200">
    <button
      type="button"
      class="block max-w-full border-0 bg-transparent p-0 cursor-pointer hover:opacity-90 focus-visible:(outline-2 outline-primary outline-offset-2)"
      aria-label="预览图片"
      @click="$emit('preview', content)"
    >
      <img
        :src="content"
        alt="聊天图片"
        class="block max-w-full rounded-6 transition-opacity"
        loading="lazy"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

defineProps<Props>()

defineEmits<{
  preview: [url: string]
}>()
</script>
