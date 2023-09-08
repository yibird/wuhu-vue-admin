<template>
  <div>
    <a-button v-longPress="handler">button</a-button>
  </div>
</template>
<script setup lang="ts">
  const handler = (e: MouseEvent) => {
    console.log("longPress event: ", e);
  };
</script>
