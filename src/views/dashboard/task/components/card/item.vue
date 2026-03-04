<template>
  <div
    class="bg-white border-1 border-solid border-[#f2f2f2] rounded-4 transition-shadow hover:(shadow-b-md)"
  >
    <div class="p-10">{{ item.title }}</div>
    <div class="px-10 text-xs text-secondary line-clamp-2">{{ item.description }}</div>
    <div class="my-10 px-10 flex justify-between items-center">
      <n-avatar-group
        :max-count="2"
        :size="25"
        :max-style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#f56a00',
          backgroundColor: '#fde3cf',
          fontSize: '14px',
        }"
      >
        <n-avatar
          v-for="n in 3"
          :key="n"
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          :size="25"
        />
      </n-avatar-group>
      <span class="text-xs text-secondary">{{ item.createTime }}</span>
    </div>
    <div class="p-10 flex items-center border-t-1 border-t-solid border-[#f2f2f2]">
      <span class="flex-1 text-center text-xs text-placeholder cursor-pointer hover:text-theme"
        >修改</span
      >
      <n-divider vertical />
      <span class="flex-1 text-center text-xs text-placeholder cursor-pointer hover:text-red"
        >删除</span
      >
      <n-divider vertical />
      <span class="flex-1 text-center text-xs text-placeholder cursor-pointer">
        <Icon name="i-lucide:ellipsis" :size="15" />
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CardTaskItemProps } from '../types';
const { item } = defineProps<CardTaskItemProps>();
</script>
