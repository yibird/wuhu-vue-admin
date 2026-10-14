<script setup lang="ts">
defineSlots<{
  default?: () => VNode | VNode[]
}>()
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
