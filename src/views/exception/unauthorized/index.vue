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
        <div class="mt-[20px]">抱歉，访问资源未授权</div>
      </template>
      <a-button type="primary">回到首页</a-button>
    </a-empty>
  </div>
</template>
<script setup lang="ts">
  import image from '/@/assets/images/status/401.svg';
</script>
