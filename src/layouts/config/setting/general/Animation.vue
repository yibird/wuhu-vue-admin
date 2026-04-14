<template>
  <div>
    <n-divider>动画</n-divider>
    <ConfigItem title="页面切换进度条">
      <n-switch v-model:value="animation.enableProgressBar" :round="false" />
    </ConfigItem>
    <ConfigItem title="页面切换 Loading">
      <n-switch v-model:value="animation.enablePageLoading" :round="false" />
    </ConfigItem>
    <ConfigItem title="页面切换动画">
      <n-select
        v-model:value="animation.pageAnimation"
        :options="animationOptions"
        class="w-180!"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { appStore } from '@/store'
import ConfigItem from '../config-item.vue'
import { storeToRefs } from 'pinia'

const animationOptions = [
  {
    label: '无',
    value: '',
  },
  {
    label: '淡入淡出',
    value: 'fade',
  },
]

const { animation } = storeToRefs(appStore())
</script>
