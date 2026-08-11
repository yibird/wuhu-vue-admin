<template>
  <div>
    <a-divider>面包屑</a-divider>
    <ConfigItem title="启用收缩/展开侧边栏">
      <a-switch v-model:checked="sider.collapsed" :disabled="!header.show" />
    </ConfigItem>
    <ConfigItem title="开启面包屑导航">
      <a-switch
        v-model:checked="header.showBreadcrumb"
        :disabled="!header.show"
      />
    </ConfigItem>
    <ConfigItem title="显示面包屑图标">
      <a-switch
        v-model:checked="header.showBreadCrumbIcon"
        :disabled="!header.show"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import ConfigItem from '../ConfigItem.vue'
import { useAppStore } from '@/store'

const { sider, header } = useAppStore()
</script>
