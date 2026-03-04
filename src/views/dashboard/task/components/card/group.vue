<template>
  <div class="max-h-full flex flex-col bg-white rounded-4 overflow-hidden">
    <div class="flex justify-between items-center p-10">
      <n-tag size="small" :bordered="false" :color="{ color, textColor }" class="cursor-pointer">
        {{ text }}
      </n-tag>
      <span class="text-secondary">{{ items.length }}个任务</span>
    </div>
    <VueDraggable
      v-model="items"
      group="group"
      :animation="150"
      :key="items.length"
      class="flex-1 relative p-10 flex flex-col gap-10 overflow-y-auto overflow-x-hidden"
    >
      <Item
        v-if="items.length > 0"
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :item="item"
      />
      <div v-else class="min-h-200 flex justify-center items-center">
        <n-empty />
      </div>
    </VueDraggable>
  </div>
</template>
<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';
import Item from './item.vue';
import type { CardTaskGroupProps, Task } from '../types';

const items = defineModel<Task[]>('items', { default: () => [] });
const { text, color, textColor } = defineProps<CardTaskGroupProps>();
</script>
