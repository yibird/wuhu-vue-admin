<template>
  <div>
    <n-divider>小部件</n-divider>
    <ConfigItem title="启用全局搜索">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用下载中心">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用主题切换">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用语言切换">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用全屏">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用通知">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用锁屏">
      <n-switch />
    </ConfigItem>
    <ConfigItem title="启用AI助手">
      <n-switch />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
  import ConfigItem from '../config-item.vue'
</script>
