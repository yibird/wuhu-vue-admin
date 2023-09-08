<template>
  <div>
    <ThemeBlock :themes="themes" />
  </div>
</template>
<script setup lang="ts">
  import ThemeBlock from "./components/ThemeBlock.vue";
  const themes = [
    "red",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
  ];
</script>
