<script setup lang="ts">
import type { ViewContentSlots } from './types'

defineSlots<ViewContentSlots>()
defineOptions({ name: 'WViewContent' })
</script>

<template>
  <main class="w-view-content">
    <slot />
  </main>
</template>

<style lang="less" scoped>
.w-view-content {
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}
</style>
