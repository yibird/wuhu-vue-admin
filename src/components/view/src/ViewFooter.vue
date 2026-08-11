<script setup lang="ts">
import type { ViewFooterSlots } from './types'

defineSlots<ViewFooterSlots>()
defineOptions({ name: 'WViewFooter' })
</script>

<template>
  <footer class="w-view-footer">
    <slot />
  </footer>
</template>

<style lang="less" scoped>
.w-view-footer {
  box-sizing: border-box;
  flex: 0 0 auto;
  min-width: 0;
}
</style>
