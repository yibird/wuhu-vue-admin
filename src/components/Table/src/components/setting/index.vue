<!-- 列设置 -->
<template>
  <div class="flex items-center">
    <StripeSetting />
    <a-divider type="vertical" />
    <SizeSetting />
    <a-divider type="vertical" />
    <ColumnDisplaySetting />
    <a-divider type="vertical" />
    <ColumnExportSetting />
    <a-divider type="vertical" />
    <FullScreenSetting />
  </div>
</template>
<script setup lang="ts">
  import StripeSetting from './StripeSetting.vue';
  import SizeSetting from './SizeSetting.vue';
  import ColumnDisplaySetting from './ColumnDisplaySetting.vue';
  import ColumnExportSetting from './ColumnExportSetting.vue';
  import FullScreenSetting from './FullScreenSetting.vue';
</script>
