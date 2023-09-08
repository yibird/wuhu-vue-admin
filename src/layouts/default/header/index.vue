<template>
  <a-layout-header class="layout-header">
    <HeaderNavBar />
    <HeaderNavMenu />
  </a-layout-header>
</template>
<script setup lang="ts">
import HeaderNavBar from "./components/navBar/index.vue";
import HeaderNavMenu from "./components/navMenu/index.vue";
</script>
<style scoped>
.layout-header {
  @apply !bg-white !h-[45px] !leading-[45px] 
    !px-0 flex justify-between;
}
</style>
