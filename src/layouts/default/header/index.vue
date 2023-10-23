<template>
  <a-layout-header style="height: auto; padding: 0 !important; z-index: 10">
    <div class="layout-header">
      <HeaderNavBar />
      <HeaderNavMenu />
    </div>
    <LayoutMultiTabs />
  </a-layout-header>
</template>
<script setup lang="ts">
  import HeaderNavBar from './components/navBar/index.vue';
  import HeaderNavMenu from './components/navMenu/index.vue';
  import LayoutMultiTabs from '../multiTabs/index.vue';
</script>
<style scoped>
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 50px;
    border-bottom: 1px solid #f5f5f5;
  }
</style>
