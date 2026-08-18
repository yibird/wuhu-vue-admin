<script setup lang="ts">
import { shallowRef } from 'vue'
import { Draggable } from '@/components/draggable'
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'

const sortableItems = shallowRef([
  { id: 'research', title: '需求分析', icon: 'i-lucide:search' },
  { id: 'design', title: '交互设计', icon: 'i-lucide:panels-top-left' },
  { id: 'develop', title: '功能开发', icon: 'i-lucide:code-2' },
  { id: 'verify', title: '质量验证', icon: 'i-lucide:badge-check' },
])
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Draggable</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              基于 dnd-kit 的可排序列表组件。
            </p>
          </div>
          <a-tag color="blue">src/components/draggable</a-tag>
        </header>

        <Draggable
          v-model="sortableItems"
          item-key="id"
          class="grid max-w-680 gap-8"
          type="component-demo-item"
        >
          <template #item="{ element: item, index, isDragging, isDropTarget }">
            <div
              class="h-54 flex items-center gap-10 rounded-6 border-1 border-color-2 border-solid bg-container px-12 transition-[border-color,box-shadow,transform]"
              :class="{
                'z-100 shadow-all-lg scale-[1.01]': isDragging,
                'border-primary bg-primary/5': isDropTarget,
              }"
            >
              <Icon
                name="i-lucide:grip-vertical"
                :size="18"
                class="cursor-grab text-muted active:cursor-grabbing"
              />
              <Icon :name="item.icon" :size="17" class="text-primary" />
              <span class="flex-1 text-sm text-main">{{ item.title }}</span>
              <span class="text-xs text-muted">{{ index + 1 }}</span>
            </div>
          </template>
        </Draggable>
      </section>
    </Scrollbar>
  </WView>
</template>
