<template>
  <div>
    <a-divider>头部</a-divider>
    <ConfigItem title="显示头部">
      <a-switch v-model:checked="header.show" />
    </ConfigItem>
    <ConfigItem title="固定头部">
      <a-switch v-model:checked="header.fixed" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import ConfigItem from '../ConfigItem.vue'
const { header } = useAppStore()
</script>
