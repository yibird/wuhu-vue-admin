<template>
  <n-tooltip>
    <template #trigger>
      <button @click="toggle">
        <Icon :name="isFullscreen ? 'i-lucide:minimize' : 'i-lucide:maximize'" :size="20" />
      </button>
    </template>
    <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
  </n-tooltip>
</template>
<script lang="ts" setup>
  import { useFullscreen } from '@vueuse/core'
  const { isFullscreen, toggle } = useFullscreen()
</script>
