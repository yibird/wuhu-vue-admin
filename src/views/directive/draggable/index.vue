<template>
  <div class="page">
    <div v-draggable class="block">block</div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
  .page {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .container {
    position: absolute;
    left: 0;
    top: 0;
  }
  .block {
    position: absolute;
    width: 100px;
    height: 100px;
    display: grid;
    place-items: center;
    border: 1px solid red;
  }
</style>
