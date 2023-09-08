<template>
  <!-- <a-card title="123123"> </a-card> -->
  <a-row :gutter="12">
    <a-col v-for="(item, index) in items" :span="6" :key="index">
      <a-card :title="item.title" :bordered="false" :bodyStyle="{ padding: '20px' }">
        <template #extra>
          <a-tag :color="item.tagColor">{{ item.tagTitle }}</a-tag>
        </template>
        <div class="h-[60px]">
          <div class="text-[24px]">{{ item.value }}</div>
          <a-progress :percent="30" v-if="item.progress" />
          <div v-else class="flex justify-between text-[14px]">
            <div>{{ item.footerTitle }}</div>
            <div>{{ item.footerValue }}</div>
          </div>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
  import type { CardItem } from '../types';
  const { items = [] } = defineProps<{ items: CardItem[] }>();
</script>
