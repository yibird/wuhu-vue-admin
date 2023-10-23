<template>
  <a-tooltip>
    <template #title> {{ isFullscreen ? '退出' : '进入' }}全屏</template>
    <li @click="toggle">
      <icon
        :size="18"
        :name="isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"
      />
    </li>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { useFullscreen } from '@vueuse/core';
  const { isFullscreen, toggle } = useFullscreen(document.body);
</script>
