<template>
  <n-layout has-sider class="h-full">
    <layout-sider />
    <n-layout content-class="h-full flex flex-col">
      <layout-header class="shrink-0" />
      <layout-tabs class="shrink-0" />
      <div class="flex-1 flex flex-col overflow-hidden">
        <layout-content />
        <layout-footer />
      </div>
    </n-layout>
  </n-layout>
</template>
<script lang="ts" setup>
import LayoutSider from './sider/index.vue';
import LayoutHeader from './header/index.vue';
import LayoutTabs from './tabs/index.vue';
import LayoutContent from './content/index.vue';
import LayoutFooter from './footer/index.vue';
</script>
