<template>
  <a-tooltip placement="top">
    <template #title>斑马线</template>
    <a-switch :checked="false" @change="handleChange" />
  </a-tooltip>
</template>
<script setup lang="ts">
  import { inject } from 'vue';
  const handleChange = (stripe: boolean) => {
    console.log('stripe:', stripe);
  };
</script>
