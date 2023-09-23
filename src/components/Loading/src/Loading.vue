<!-- <template>
  <section
    :class="[fullscreen ? 'full-loading' : 'container-loading', 'loading']"
    :style="[background ? `background-color: ${background}` : '']"
    v-show="loading"
  >
    <a-spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" style="margin: auto" />
  </section>
</template>
<script setup lang="ts">
  import type { LoadingProps } from "./types";
  const {
    tip = "",
    size = "default",
    fullscreen = false,
    loading = false,
    background,
    theme,
  } = defineProps<LoadingProps>();
</script>
<style scoped>
  .loading {
    display: flex;
    z-index: 200;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgb(240 242 245 / 40%);
  }
  .container-loading {
    position: absolute;
  }
  .full-loading {
    position: fixed;
  }
</style> -->

<template></template>
