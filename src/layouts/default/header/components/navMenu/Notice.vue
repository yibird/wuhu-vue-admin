<template>
  <li @click="open = true">
    <icon :size="18" name="ri-notification-line" />
  </li>
  <MessagePannel v-model:open="open" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import MessagePannel from '/@/views/setting/messagePanel/index.vue';
  const open = ref(false);
</script>
