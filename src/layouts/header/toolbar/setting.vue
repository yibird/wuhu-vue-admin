<template>
  <button @click="value = true">
    <Icon name="i-lucide:settings" :size="20" />
  </button>
  <Setting v-model:open="value" @close="value = false" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Setting } from '@/layouts/config';
const value = ref(false);
</script>
