<template>
  <a-layout-header
    class="w-layout-header transition-[background-color,border-color,color] duration-240 ease-out motion-reduce:transition-none"
  >
    <HeaderNav />
    <HeaderToolbar />
  </a-layout-header>
</template>
<script lang="ts" setup>
import HeaderNav from './nav/index.vue'
import HeaderToolbar from './toolbar/index.vue'
</script>

<style>
.w-layout-header {
  @apply relative h-50! px-10! flex items-center justify-between z-10;

  background-color: var(--w-header-bg);
  border-bottom: 1px solid rgb(var(--w-header-border-color));
  backdrop-filter: var(--w-header-filter);
}
</style>
