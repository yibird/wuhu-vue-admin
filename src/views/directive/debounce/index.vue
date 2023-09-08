<template>
  <div>
    <a-button v-debounce:1000="handler">button</a-button>
  </div>
</template>
<script setup lang="ts">
  const handler = () => {
    console.log("click button...");
  };
</script>
