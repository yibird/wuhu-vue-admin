<template>
  <a-tooltip placement="top">
    <template #title>斑马线</template>
    <a-switch v-model:checked="config.stripe" @change="handleChange" />
  </a-tooltip>
</template>
<script setup lang="ts">
  import { inject } from "vue";
  import { contextKey } from "../../context";
  const { config = { stripe: false }, changeConfig } = inject(contextKey)!;
  const handleChange = (stripe: boolean) => {
    console.log("stripe:", stripe);
    changeConfig({ ...config, stripe });
  };
</script>
