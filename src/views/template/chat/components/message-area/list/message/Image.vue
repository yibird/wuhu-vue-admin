<template>
  <div class="max-w-200">
    <img
      :src="content"
      class="max-w-full rounded-6 cursor-pointer hover:opacity-90 transition-opacity"
      loading="lazy"
      @click="$emit('preview', content)"
    />
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
