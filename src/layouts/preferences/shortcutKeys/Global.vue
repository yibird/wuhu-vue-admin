<template>
  <div>
    <a-divider>全局快捷键</a-divider>
    <ConfigItem title="快捷键">
      <a-switch v-model:checked="enabled" />
    </ConfigItem>
    <ConfigItem title="全局搜索">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Ctrl K</span>
        <a-switch v-model:checked="search" :disabled="!enabled" />
      </div>
    </ConfigItem>
    <ConfigItem title="退出登录">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Alt Q</span>
        <a-switch v-model:checked="logout" :disabled="!enabled" />
      </div>
    </ConfigItem>
    <ConfigItem title="锁定屏幕">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Alt L</span>
        <a-switch v-model:checked="lockScreen" :disabled="!enabled" />
      </div>
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useShortcuts } from '@/layouts/shortcuts'
import ConfigItem from '../ConfigItem.vue'

const { enabled, search, logout, lockScreen } = useShortcuts()
</script>
