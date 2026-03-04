<template>
  <div>
    <n-divider>全局快捷键</n-divider>
    <ConfigItem title="快捷键">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="全局搜索">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Ctrl K</span>
        <n-switch />
      </div>
    </ConfigItem>
    <ConfigItem title="退出登录">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Alt Q</span>
        <n-switch />
      </div>
    </ConfigItem>
    <ConfigItem title="锁定屏幕">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Alt L</span>
        <n-switch />
      </div>
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import ConfigItem from '../config-item.vue'
</script>
