<template>
  <div>
    <n-divider>侧边栏</n-divider>
    <ConfigItem title="显示侧边栏">
      <n-switch v-model:value="sider.show" :round="false" />
    </ConfigItem>
    <ConfigItem title="折叠菜单">
      <n-switch :round="false" />
    </ConfigItem>
    <ConfigItem title="折叠显示菜单名">
      <n-switch :round="false" />
    </ConfigItem>
    <ConfigItem title="宽度">
      <n-input-number
        :min="100"
        :max="300"
        v-model:value="sider.width"
        :round="false"
      />
    </ConfigItem>
    <ConfigItem title="收缩宽度">
      <n-input-number
        :min="50"
        :max="80"
        v-model:value="sider.collapsedWidth"
        :round="false"
      />
    </ConfigItem>
    <ConfigItem title="显示Logo">
      <n-switch v-model:value="sider.showLogo" :round="false" />
    </ConfigItem>
    <ConfigItem title="启用菜单搜索">
      <n-switch v-model:value="sider.showSearch" :round="false" />
    </ConfigItem>
    <ConfigItem title="启用高级导航">
      <n-switch v-model:value="sider.showAdvancedNav" :round="false" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import ConfigItem from '../config-item.vue'

const { app, sider } = storeToRefs(appStore())
</script>
