<script lang="ts" setup>
import { usePreferences } from '@/layouts/preferences/composables'

const { openPreferences } = usePreferences()
</script>

<template>
  <button
    type="button"
    class="w-layout-toolbar-item max-sm:hidden"
    data-motion="spin"
    aria-label="打开项目设置"
    title="项目设置"
    @click="openPreferences"
  >
    <Icon name="i-lucide:settings" :size="20" />
  </button>
</template>
