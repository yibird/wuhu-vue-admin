<template>
  <div
    class="group min-h-48 flex items-center justify-between gap-12 rounded-7 px-10 py-8 transition-[background-color] duration-200 ease-[var(--w-motion-ease-enter)] hover:bg-hover"
  >
    <span
      v-if="title"
      class="text-sm text-main transition-colors duration-200 group-hover:text-primary"
    >
      {{ title }}
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
