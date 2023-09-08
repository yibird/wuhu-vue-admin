<template>
  <div v-loading.fullscreen="state.fullscreenLoading">
    <div>
      <a-button @click="handleContainerLoading(true)">容器loading</a-button>
      <a-button @click="handleContainerLoading(false)">取消容器loading</a-button>
      <a-button @click="handleFullscreenLoading">全屏loading</a-button>
    </div>
    {{ state.containerLoading }}
    <div v-loading="state.containerLoading" class="container">container</div>
  </div>
</template>
<script setup lang="ts">
  import { reactive } from "vue";
  const state = reactive({
    containerLoading: false,
    fullscreenLoading: false,
  });
  const handleContainerLoading = (containerLoading: boolean) => {
    Object.assign(state, { containerLoading });
  };
  const handleFullscreenLoading = () => {
    state.fullscreenLoading = true;
    setTimeout(() => (state.fullscreenLoading = false), 2000);
  };
</script>
<style scoped>
  .container {
    width: 200px;
    height: 200px;
    display: grid;
    place-items: center;
    border: 1px solid red;
  }
</style>
