<template>
  <div class="absolute top-20 left-20 z-10 flex items-center gap-10">
    <img
      alt="logo"
      class="size-40"
      height="{40}"
      src="https://max.naiveadmin.com/assets/logo-Co29R00y.png"
      width="{40}"
    />
    <span class="font-medium text-xl">{{ appName }}</span>
  </div>
</template>
<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME
</script>
