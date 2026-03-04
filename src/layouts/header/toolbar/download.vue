<template>
  <n-tooltip>
    <template #trigger>
      <button @click="show = true">
        <Icon name="i-lucide:circle-arrow-down" :size="20" />
      </button>
    </template>
    <span>下载中心</span>
  </n-tooltip>
  <DownloadCenter v-model:show="show" />
</template>
<script lang="ts" setup>
import { DownloadCenter } from '@/layouts/config';
const show = ref(false);
</script>
