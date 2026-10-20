<script setup lang="ts">
import { LazyContainer } from '@/components'
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    /**
     * @desc 懒加载的区块组件
     */
    section: Component
    /**
     * @desc 骨架屏组件,同时用作进入视口前的占位与 Suspense 兜底
     */
    skeleton: Component
    /**
     * @desc 提前触发加载的视口边距
     */
    rootMargin?: string
  }>(),
  { rootMargin: '0px 0px 96px' }
)
</script>

<template>
  <LazyContainer :root-margin="rootMargin">
    <template #placeholder>
      <component :is="skeleton" />
    </template>
    <Suspense>
      <component :is="section" />
      <template #fallback>
        <component :is="skeleton" />
      </template>
    </Suspense>
  </LazyContainer>
</template>
