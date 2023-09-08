<template>
  <a-layout-sider :collapsed="getCollapsed" collapsible :collapsedWidth="60" :trigger="null">
    <Logo v-if="getShowLogo" :collapsed="getCollapsed" />
    <Menu />
  </a-layout-sider>
</template>
<script setup lang="ts">
  import Logo from './components/Logo.vue';
  import Menu from '../menu/index.vue';
  import { useRootSetting } from '/@/hooks/setting';
  const { getShowLogo, getCollapsed } = useRootSetting();
</script>
