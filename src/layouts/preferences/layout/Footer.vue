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
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import ConfigItem from '../ConfigItem.vue'
const { footer } = storeToRefs(appStore())
</script>
