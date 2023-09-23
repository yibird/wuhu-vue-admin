<template>
  <div class="h-full bg-white flex-row-center">
    <a-empty
      :image="image"
      :image-style="{
        height: '200px',
        width: '500px',
        margin: 'auto',
      }"
      class="pt-[80px]"
    >
      <template #description>
        <div class="mt-[20px]">抱歉，你访问的页面不存在</div>
      </template>
      <a-button type="primary">回到首页</a-button>
    </a-empty>
  </div>
</template>
<script setup lang="ts">
  import image from '/@/assets/images/status/404.svg';
</script>
