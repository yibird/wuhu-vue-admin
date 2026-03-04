<template>
  <div
    class="group flex gap-10 [&_.toolbar-item]:(span-button size-32 flex-center rounded-8 cursor-pointer bg-[#f5f5f5]) [&.toolbar-item:hover]:(bg-[#e8e8e8] text-theme)"
  >
    <Setting />
    <Refresh />
    <Fullscreen />
    <ColumnSetting />
  </div>
</template>
<script lang="ts" setup>
import Setting from './setting.vue'
import Refresh from './refresh.vue'
import Fullscreen from './fullscreen.vue'
import ColumnSetting from './columnSetting.vue'
</script>
