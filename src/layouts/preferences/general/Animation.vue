<template>
  <div>
    <a-divider>动画</a-divider>
    <ConfigItem title="页面切换进度条">
      <a-switch v-model:checked="animation.enableProgressBar" />
    </ConfigItem>
    <ConfigItem title="页面切换 Loading">
      <a-switch v-model:checked="animation.enablePageLoading" />
    </ConfigItem>
    <ConfigItem title="Loading 动画">
      <a-select
        v-model:value="animation.loadingAnimation"
        :options="loadingOptions"
        class="w-180!"
      />
    </ConfigItem>
    <ConfigItem title="页面切换动画">
      <a-select
        v-model:value="animation.pageAnimation"
        :options="options"
        class="w-180!"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import ConfigItem from '../ConfigItem.vue'

const options = [
  {
    label: '从左滑动',
    value: 'slide-left',
  },
  {
    label: '从右滑动',
    value: 'slide-right',
  },
  {
    label: '从上滑动',
    value: 'slide-up',
  },
  {
    label: '从下滑动',
    value: 'slide-down',
  },
  {
    label: '淡入淡出',
    value: 'fade',
  },
  {
    label: '放大',
    value: 'fade-scale',
  },
  {
    label: '横向反转',
    value: 'flip-x',
  },
  {
    label: '竖向反转',
    value: 'flip-y',
  },
]

const loadingOptions = [
  {
    label: '跳动',
    value: 'beat',
  },
  {
    label: '轨道旋转',
    value: 'orbit',
  },
  {
    label: '脉冲扩散',
    value: 'pulse',
  },
  {
    label: '柱状跳动',
    value: 'bars',
  },
  {
    label: '圆环旋转',
    value: 'ring',
  },
]

const { animation } = useAppStore()
</script>
