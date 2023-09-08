<template>
  <div class="page">
    <a-button @click="handleClick('content')">切换文字水印</a-button>
    <a-button @click="handleClick('image')">切换图片水印</a-button>
    <div class="block" v-waterMarker="{ content, image }"></div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  const randomNumber = (max: number) => Math.floor(Math.random() * max) + 1;
  const contents = ["你是一头猪", "你是一只狗", "你是一条蛇", "你是一个人", "你是一坨屎"];
  const content = ref(contents[0]);
  const image = ref("");
  const handleClick = (type: string) => {
    if (type === "content") {
      image.value = "";
      content.value = contents[randomNumber(4)];
      return;
    }
    image.value =
      "https://img11.360buyimg.com/imagetools/jfs/t1/57345/6/20069/8019/62b995cdEd96fef03/51d3302dfeccd1d2.png";
  };
</script>
<style scoped>
  .page {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .block {
    width: 100%;
    height: 100%;
  }
</style>
