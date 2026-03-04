<template>
  <div data-swapy-slot="dynamic">
    <n-card
      size="small"
      :segmented="{
        content: true,
      }"
      content-class="py-0!"
      data-swapy-item="dynamic"
    >
      <template #header>
        <span class="text-md font-bold">动态</span>
      </template>
      <template #header-extra>
        <n-button type="primary">更多</n-button>
      </template>
      <div class="divide-y divide-[rgba(5,5,5,0.06)]">
        <div v-for="item in items" :key="item.id" class="py-15">
          <div class="flex items-center">
            <n-avatar round :size="40" class="dark:bg-[#faad14]">{{ item.name }}</n-avatar>
            <div class="flex-1 px-16 overflow-hidden">
              <div class="text-base font-bold mb-10">{{ item.name }}</div>
              <div class="text-sm">{{ item.describe }}</div>
            </div>
          </div>
          <div class="mt-16 flex items-center gap-10">
            <div class="flex items-center gap-5 cursor-pointer hover:text-theme">
              <Icon name="i-lucide:thumbs-up" :size="16" />
              <span>12</span>
            </div>
            <n-divider vertical />
            <div class="flex items-center gap-5 cursor-pointer hover:text-red">
              <Icon name="i-lucide:heart" :size="16" />
              <span>12</span>
            </div>
            <n-divider vertical />
            <div class="flex items-center gap-5 cursor-pointer hover:text-[#18a058]">
              <Icon name="i-lucide:message-circle-more" :size="16" />
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import type { Dynamic } from './types';

const items: Dynamic[] = [
  {
    id: 1,
    avatar: 'https://picsum.photos/200/300',
    name: '张三',
    describe: '创建了项目1',
    createAt: '2023-01-01',
  },
  {
    id: 2,
    avatar: 'https://picsum.photos/200/300',
    name: '张三',
    describe: '创建了项目2221',
    createAt: '2023-01-01',
  },
  {
    id: 3,
    avatar: 'https://picsum.photos/200/300',
    name: '张三',
    describe: '创建了项目21',
    createAt: '2023-01-01',
  },
  {
    id: 4,
    avatar: 'https://picsum.photos/200/300',
    name: '张三1',
    describe: '创建了项目111',
    createAt: '2023-01-01',
  },
];
</script>
