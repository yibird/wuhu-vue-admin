<template>
  <div>
    <n-divider>其他</n-divider>
    <ConfigItem title="圆角">
      <n-input-number disabled :min="0" :max="20" />
    </ConfigItem>
    <ConfigItem title="色弱模式">
      <n-switch disabled :round="false" />
    </ConfigItem>
    <ConfigItem title="灰色模式">
      <n-switch disabled :round="false" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import ConfigItem from '../config-item.vue'
</script>
