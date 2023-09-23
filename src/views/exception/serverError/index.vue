<template>
  <div class="h-full bg-white flex-row-center">
    <a-empty
      :image="image"
      :image-style="{
        height: '200px',
        width: '500px',
      }"
      class="pt-[80px]"
    >
      <template #description>
        <div class="mt-[20px]">抱歉，服务器出错了</div>
      </template>
      <a-button type="primary">回到首页</a-button>
    </a-empty>
  </div>
</template>
<script setup lang="ts">
  import image from '/@/assets/images/status/500.svg';
</script>
