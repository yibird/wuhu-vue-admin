<template>
  <a-tooltip>
    <template #title>锁屏</template>
    <li @click="gotoLockScreen">
      <icon :size="18" name="ri-lock-line" />
    </li>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';
  const { push } = useRouter();
  const gotoLockScreen = () => {
    push('/lockScreen');
  };
</script>
