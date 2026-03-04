<template>
  <div>
    <n-divider>底栏</n-divider>
    <ConfigItem title="显示底栏">
      <n-switch v-model:value="footer.show" />
    </ConfigItem>
    <ConfigItem title="固定底栏">
      <n-switch v-model:value="footer.fixed" :disabled="!footer.show" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { appStore } from '@/store';
import ConfigItem from '../config-item.vue';
const { footer } = storeToRefs(appStore());
</script>
