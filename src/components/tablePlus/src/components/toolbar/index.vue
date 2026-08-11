<template>
  <div
    class="group flex gap-10 [&_.toolbar-item]:(span-button size-32 flex-center rounded-8 bg-hover cursor-pointer) [&_.toolbar-item:hover]:(bg-active text-primary)"
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
