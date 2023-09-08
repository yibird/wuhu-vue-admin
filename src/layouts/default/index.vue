<template>
  <a-layout class="h-full layout">
    <LayoutSider />
    <a-layout>
      <LayoutHeader />
      <LayoutContent />
      <LayoutFooter />
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import LayoutSider from "./sider/index.vue";
import LayoutHeader from "./header/index.vue";
import LayoutContent from "./content/index.vue";
import LayoutFooter from "./footer/index.vue";
</script>
