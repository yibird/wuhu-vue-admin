<template>
  <div class="h-full flex flex-col">
    <ul class="flex-1 overflow-y-scroll" v-auto-animate>
      <li v-for="(item, index) in items" :key="index">
        <div class="p-10 flex justify-between">
          <span>哈哈哈哈哈{{ item }}</span>
          <span @click="removeItem(index)">删除</span>
        </div>
        <a-divider class="!m-0" v-if="index !== items.length - 1" />
      </li>
    </ul>
    <a-divider class="!m-0" />
    <div class="footer text-right px-15 py-12">
      <a-space>
        <a-button>取消</a-button>
        <a-button type="primary">确定</a-button>
      </a-space>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  const items = ref(['😏', '😐', '😑', '😒', '😕']);
  function removeItem(removeIndex: number) {
    items.value = items.value.filter((_, index) => index !== removeIndex);
  }
</script>
