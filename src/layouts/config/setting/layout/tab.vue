<template>
  <div>
    <n-divider>选项卡</n-divider>
    <ConfigItem title="显示标签页">
      <n-switch v-model:value="tabs.show" :round="false" />
    </ConfigItem>
    <ConfigItem title="持久化标签页">
      <n-switch
        :disabled="!tabs.show"
        v-model:value="tabs.enablePersist"
        :round="false"
      />
    </ConfigItem>
    <ConfigItem title="启动拖拽排序">
      <n-switch
        :disabled="!tabs.show"
        v-model:value="tabs.enableDrag"
        :round="false"
      />
    </ConfigItem>
    <ConfigItem title="显示标签栏图标">
      <n-switch
        :disabled="!tabs.show"
        v-model:value="tabs.showIcon"
        :round="false"
      />
    </ConfigItem>
    <ConfigItem title="标签页主题">
      <n-select
        :options="themeOptions"
        :disabled="!tabs.show"
        v-model:value="tabs.theme"
        class="w-160"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import ConfigItem from '../config-item.vue'
import { TabsTheme } from '@/constant'

const { tabs } = storeToRefs(appStore())

const themeOptions = [
  {
    label: '卡片',
    value: TabsTheme.Block,
  },
  {
    label: '块',
    value: TabsTheme.Card,
  },
  {
    label: '谷歌',
    value: TabsTheme.Google,
  },
]
</script>
