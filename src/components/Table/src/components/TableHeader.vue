<template>
  <div class="header">
    <div class="header-title">12312312 </div>
    <TableSetting class="header-setting" />
  </div>
</template>
<script setup lang="ts">
  import { BasicTableProps } from "../types";
  import TableSetting from "./settings/index.vue";
</script>

<style scoped>
  .header {
    @apply flex justify-between items-center mb-[10px];
    border: 1px solid red;
  }
  .header-title {
    @apply inline-flex items-center;
  }
  .header-setting {
    @apply text-[16px] text-[#333] font-bold mr-[10px] cursor-pointer;
  }
</style>
