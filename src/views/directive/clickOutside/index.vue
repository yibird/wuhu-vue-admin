<template>
  <div class="container">
    <div class="block" v-clickOutside="handle"> {{ text }} </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  const text = ref("click me...");
  const handle = (outside: boolean) => {
    text.value = outside ? "点击了外面" : "点击容器里面";
  };
</script>

<style scoped>
  .container {
    display: grid;
    place-items: center;
  }
  .block {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: grid;
    place-items: center;
  }
</style>
