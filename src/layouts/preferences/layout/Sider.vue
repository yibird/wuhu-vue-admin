<template>
  <div>
    <a-divider>侧边栏</a-divider>
    <ConfigItem title="显示侧边栏">
      <a-switch v-model:checked="sider.show" />
    </ConfigItem>
    <ConfigItem title="折叠菜单">
      <a-switch v-model:checked="sider.collapsed" />
    </ConfigItem>
    <ConfigItem title="宽度">
      <a-input-number :min="100" :max="360" v-model:value="sider.width" />
    </ConfigItem>
    <ConfigItem title="收缩宽度">
      <a-input-number
        :min="50"
        :max="80"
        v-model:value="sider.collapsedWidth"
      />
    </ConfigItem>
    <ConfigItem title="显示Logo">
      <a-switch v-model:checked="sider.showLogo" />
    </ConfigItem>
    <ConfigItem title="启用菜单搜索">
      <a-switch v-model:checked="sider.showSearch" />
    </ConfigItem>
    <ConfigItem title="启用高级导航">
      <a-switch v-model:checked="sider.showAdvancedNav" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import ConfigItem from '../ConfigItem.vue'

const { sider } = useAppStore()
</script>
