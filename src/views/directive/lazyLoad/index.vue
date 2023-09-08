<template>
  <div>
    <img v-lazyLoad="src" class="image" />
  </div>
</template>
<script setup lang="ts">
  const src = "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png";
</script>
<style scoped>
  .image {
    width: 300px;
    height: 200px;
    margin-top: 1000px;
    border: 1px solid red;
  }
</style>
