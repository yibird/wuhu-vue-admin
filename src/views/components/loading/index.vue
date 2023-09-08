<template>
  <div>
    <div>
      <a-button @click="clickHandler01">容器loading</a-button>
      <a-button @click="clickHandler02">全屏loading</a-button>
    </div>
    <div class="container" ref="containerRef">container</div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  import { useLoading } from "/@/components/Loading";
  const containerRef = ref<HTMLElement | null>(null);
  const [open1, close1] = useLoading({ target: containerRef, props: { tip: "loading..." } });
  const [open2, close2] = useLoading({ tip: "加载中...", fullscreen: true });

  const clickHandler01 = () => {
    open1();
    setTimeout(() => {
      close1();
    }, 2000);
  };
  const clickHandler02 = () => {
    open2();
    setTimeout(() => {
      close2();
    }, 2000);
  };
</script>
<style>
  .container {
    position: relative;
    width: 200px;
    height: 200px;
    display: grid;
    place-items: center;
    border: 1px solid red;
  }
</style>
