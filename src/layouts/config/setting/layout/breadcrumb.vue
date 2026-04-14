<template>
  <div>
    <n-divider>面包屑</n-divider>
    <ConfigItem title="启用收缩/展开侧边栏">
      <n-switch v-model:value="sider.collapsed" :round="false" />
    </ConfigItem>
    <ConfigItem title="开启面包屑导航">
      <n-switch v-model:value="header.showBreadcrumb" :round="false" />
    </ConfigItem>
    <ConfigItem title="显示面包屑图标">
      <n-switch v-model:value="header.showBreadCrumbIcon" :round="false" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import ConfigItem from '../config-item.vue'
import { appStore } from '@/store'

const { app, sider, header } = storeToRefs(appStore())
</script>
