<template>
  <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏'">
    <button
      type="button"
      class="w-layout-toolbar-item"
      data-motion="expand"
      @click="toggle"
    >
      <Icon
        :name="isFullscreen ? 'i-lucide:minimize' : 'i-lucide:maximize'"
        :size="20"
      />
    </button>
  </a-tooltip>
</template>
<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>
