<template>
  <li @click="open = true">
    <icon :size="18" name="ri-settings-line" />
  </li>
  <AppSetting v-model:open="open" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import AppSetting from '/@/views/setting/appSetting/index.vue';

  const open = ref(false);
</script>
