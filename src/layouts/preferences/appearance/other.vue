<template>
  <div class="flex flex-col gap-5">
    <a-divider>其他</a-divider>
    <ConfigItem title="圆角">
      <a-input-number v-model:value="app.borderRadius" :min="0" :max="20" />
    </ConfigItem>
    <ConfigItem title="色弱模式">
      <a-switch v-model:checked="app.colourWeakness" />
    </ConfigItem>
    <ConfigItem title="灰色模式">
      <a-switch v-model:checked="app.greyMode" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { ConfigItem } from '../components'

const { app } = useAppStore()
</script>
