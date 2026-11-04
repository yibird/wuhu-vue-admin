<script setup lang="ts">
import { LazyContainer } from '@/components/container'
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
    <template #placeholder="{ visible }">
      <component :is="skeleton" :class="{ 'skeleton-paused': !visible }" />
    </template>
    <Suspense>
      <component :is="section" />
      <template #fallback>
        <component :is="skeleton" />
      </template>
    </Suspense>
  </LazyContainer>
</template>

<style scoped>
/* 离屏骨架暂停 pulse 动画,避免大量无限动画持续占用低性能设备的渲染资源 */
.skeleton-paused,
.skeleton-paused :deep(*) {
  animation-play-state: paused;
}
</style>
