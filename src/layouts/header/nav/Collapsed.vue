<template>
  <button
    class="span-button size-32 group flex items-center justify-center p-8 cursor-pointer rounded-4 hover:bg-hover"
    data-testid="sider-collapse-trigger"
    @click="toggleCollapsed"
  >
    <Icon
      name="i-lucide:align-justify"
      :size="20"
      class="transition-transform group-hover:scale-110"
    />
  </button>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
const { toggleCollapsed } = useAppStore()
</script>
