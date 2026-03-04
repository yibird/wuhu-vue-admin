<template>
  <div>
    <n-divider>动画</n-divider>
    <ConfigItem title="页面切换进度条">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="页面切换 Loading">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="页面切换动画">
      <n-select :options="animationOptions" class="w-180!" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import ConfigItem from '../config-item.vue';

const animationOptions = [
  {
    label: '无',
    value: '',
  },
  {
    label: '淡入淡出',
    value: 'fade',
  },
];
</script>
