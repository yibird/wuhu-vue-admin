<template>
  <a-layout-header
    class="w-layout-header transition-[background-color,border-color,color] duration-motion-moderate ease-motion-enter motion-reduce:transition-none"
  >
    <HeaderNav />
    <HeaderToolbar />
  </a-layout-header>
</template>
<script lang="ts" setup>
import HeaderNav from './nav/index.vue'
import HeaderToolbar from './toolbar/index.vue'
</script>

<style scoped>
.ant-layout-header.w-layout-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 10px;
  background-color: var(--w-header-bg);
  border-bottom: 1px solid rgb(var(--w-header-border-color));
  backdrop-filter: var(--w-header-filter);
}
</style>
