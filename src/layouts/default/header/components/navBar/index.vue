<template>
  <ul class="flex-col-center">
    <li @click="setCollapsed"><icon :size="18" name="ri-align-justify" /></li>
    <li @click="reloadPageHandle"
      ><icon :size="18" name="ri-restart-line"
    /></li>
    <Breadcrumb />
  </ul>
</template>
<script setup lang="ts">
  import { useAppStore } from '/@/store';
  import Breadcrumb from './Breadcrumb.vue';

  const appStore = useAppStore();
  const setCollapsed = () => {
    const { setMenuSetting, getMenuSetting } = appStore;
    const { collapsed } = getMenuSetting;
    setMenuSetting({ ...getMenuSetting, collapsed: !collapsed });
  };
  const reloadPageHandle = () => {};
</script>
<style scoped>
  li {
    @apply inline-block hover:bg-[#f6f6f6] px-8 cursor-pointer;
  }
  li .icon {
    @apply text-[18px];
  }
</style>
