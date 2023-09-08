<!-- 列设置 -->
<template>
  <a-space>
    <StripeSetting />
    <SizeSetting />
    <ColumnDisplaySetting />
    <ColumnExportSetting />
    <FullScreenSetting />
  </a-space>
</template>
<script setup lang="ts">
  import StripeSetting from "./StripeSetting.vue";
  import SizeSetting from "./SizeSetting.vue";
  import ColumnDisplaySetting from "./ColumnDisplaySetting.vue";
  import ColumnExportSetting from "./ColumnExportSetting.vue";
  import FullScreenSetting from "./FullScreenSetting.vue";
</script>
