<template>
  <div>
    <n-divider>全局快捷键</n-divider>
    <ConfigItem title="快捷键">
      <n-switch v-model:value="shortcutKey.enabled" :round="false" />
    </ConfigItem>
    <ConfigItem title="全局搜索">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Ctrl K</span>
        <n-switch
          v-model:value="shortcutKey.search"
          :disabled="!shortcutKey.enabled"
          :round="false"
        />
      </div>
    </ConfigItem>
    <ConfigItem title="退出登录">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Alt Q</span>
        <n-switch
          v-model:value="shortcutKey.logout"
          :disabled="!shortcutKey.enabled"
          :round="false"
        />
      </div>
    </ConfigItem>
    <ConfigItem title="锁定屏幕">
      <div class="flex items-center gap-10">
        <span class="text-xs text-secondary">Alt L</span>
        <n-switch
          v-model:value="shortcutKey.lockScreen"
          :disabled="!shortcutKey.enabled"
          :round="false"
        />
      </div>
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import ConfigItem from '../config-item.vue'

const { shortcutKey } = storeToRefs(appStore())
</script>
