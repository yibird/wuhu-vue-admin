<template>
  <div
    class="flex items-center justify-between p-10 rounded-4 cursor-pointer transition hover:bg-[#f5f5f4] dark:hover:bg-[#1a1a1a]"
    @click="emits('click')"
  >
    <span v-if="title" class="text-main dark:text-[#f5f5f4]">
      {{ title }}
    </span>
    <slot />
  </div>
</template>
<script lang="ts" setup>
const { title } = defineProps<{ title?: string }>()
const emits = defineEmits<{
  (e: 'click'): void
}>()
</script>
