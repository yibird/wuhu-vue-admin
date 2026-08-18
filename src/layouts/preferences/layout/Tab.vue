<template>
  <div>
    <a-divider>选项卡</a-divider>
    <ConfigItem title="显示标签页">
      <a-switch v-model:checked="tab.show" />
    </ConfigItem>
    <ConfigItem title="持久化标签页">
      <a-switch :disabled="!tab.show" v-model:checked="tab.enablePersist" />
    </ConfigItem>
    <ConfigItem title="启动拖拽排序">
      <a-switch :disabled="!tab.show" v-model:checked="tab.enableDrag" />
    </ConfigItem>
    <ConfigItem title="显示标签栏图标">
      <a-switch :disabled="!tab.show" v-model:checked="tab.showIcon" />
    </ConfigItem>
    <ConfigItem title="标签页主题">
      <a-select
        :options="themeOptions"
        :disabled="!tab.show"
        v-model:value="tab.theme"
        class="w-160"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { ConfigItem } from '../components'
import { TabsTheme } from '@/constants'

const { tab } = useAppStore()

const themeOptions = [
  {
    label: '块',
    value: TabsTheme.Block,
  },
  {
    label: '卡片',
    value: TabsTheme.Card,
  },
  {
    label: '谷歌',
    value: TabsTheme.Google,
  },
]
</script>
