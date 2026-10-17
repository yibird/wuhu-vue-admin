<template>
  <footer class="w-view-footer">
    <slot />
  </footer>
</template>

<script setup lang="ts">
defineSlots<{
  default?: () => VNode | VNode[]
}>()
defineOptions({ name: 'WViewFooter' })
</script>

<style lang="less" scoped>
.w-view-footer {
  box-sizing: border-box;
  flex: 0 0 auto;
  min-width: 0;
}
</style>
