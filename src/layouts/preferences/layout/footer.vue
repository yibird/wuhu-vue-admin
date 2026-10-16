<template>
  <div>
    <a-divider>底栏</a-divider>
    <ConfigItem title="显示底栏">
      <a-switch v-model:checked="footer.show" />
    </ConfigItem>
    <ConfigItem title="固定底栏">
      <a-switch v-model:checked="footer.fixed" :disabled="!footer.show" />
    </ConfigItem>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
import { ConfigItem } from '../components'

const { footer } = useAppStore()
</script>
