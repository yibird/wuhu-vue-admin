<template>
  <div class="flex-1 overflow-x-hidden overflow-y-auto">
    <div
      v-if="items.length === 0"
      class="h-full flex items-center justify-center"
    >
      <div class="text-center">
        <div>暂无对话记录</div>
        <div>点击上方按钮开始新对话</div>
      </div>
    </div>
    <div v-else class="p-10">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-10 rounded-6 cursor-pointer truncate hover:bg-[#f2f2f2]"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ListProps } from '../types'

const { items = [] } = defineProps<ListProps>()
</script>
