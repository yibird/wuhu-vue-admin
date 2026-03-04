<template>
  <div data-swapy-slot="action">
    <n-card
      size="small"
      :segmented="{
        content: true,
      }"
      content-class="p-0!"
      data-swapy-item="action"
    >
      <template #header>
        <span class="text-md font-bold">快捷操作</span>
      </template>
      <template #header-extra>
        <n-button type="primary">更多</n-button>
      </template>
      <n-grid
        item-responsive
        responsive="screen"
        x-gap="10 xs:0 s:10 m:10 l:10 xl:10 xxl:10"
        y-gap="10"
        class="p-15 overflow-hidden"
      >
        <n-grid-item v-for="item in items" :key="item.id" span="24 xs:24 s:24 m:24 l:24 xl:6 xxl:3">
          <n-card hoverable content-class="p-0!">
            <div class="py-20 px-10 text-center cursor-pointer">
              <Icon :name="item.icon" :size="30" />
              <div class="mt-4 truncate">{{ item.name }}</div>
            </div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="24 xs:24 s:24 m:24 l:24 xl:6 xxl:3">
          <n-card hoverable content-class="p-0!" class="cursor-pointer">
            <div class="py-20 px-10 flex flex-col items-center justify-center">
              <Icon name="i-lucide:plus" :size="32" color="#e2e2e2" />
              <div class="mt-2">添加</div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import type { Action } from './types';

const items: Action[] = [
  {
    id: 1,
    icon: 'i-lucide:grid-3x3',
    name: '项目1',
  },
  {
    id: 2,
    icon: 'i-lucide:grid-3x3',
    name: '项目2',
  },
  {
    id: 3,
    icon: 'i-lucide:grid-3x3',
    name: '项目3',
  },
  {
    id: 4,
    icon: 'i-lucide:grid-3x3',
    name: '项目4',
  },
];
</script>
