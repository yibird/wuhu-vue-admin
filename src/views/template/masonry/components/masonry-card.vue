<template>
  <article
    role="button"
    tabindex="0"
    aria-label="查看作品详情"
    class="group min-w-0 cursor-pointer overflow-hidden rounded-8 b-1-muted bg-container shadow-sm outline-none transition-[border-color,box-shadow,transform] duration-300 ease-[var(--w-motion-ease)] hover:(-translate-y-2 border-primary/25 shadow-lg) focus-visible:(border-primary shadow-lg) active:translate-y-0 motion-reduce:(transform-none transition-none)"
    @click="emits('select', card)"
    @keydown.enter.prevent="emits('select', card)"
    @keydown.space.prevent="emits('select', card)"
  >
    <div
      class="relative w-full overflow-hidden bg-muted"
      :style="{ height: `${card.height}px` }"
    >
      <div
        class="size-full bg-gradient-to-br"
        :class="card.tone"
        aria-hidden="true"
      />
      <img
        :src="card.image"
        :alt="card.title"
        loading="lazy"
        class="absolute inset-0 size-full object-cover transition-transform duration-300 ease-[var(--w-motion-ease)] group-hover:scale-104 motion-reduce:transform-none"
      />
      <span
        class="absolute left-10 top-10 rounded-full bg-black/45 px-8 py-3 text-xs text-white backdrop-blur-sm"
      >
        {{ card.tag }}
      </span>
    </div>

    <div class="p-12">
      <h3 class="m-0 truncate text-sm text-main font-700" :title="card.title">
        {{ card.title }}
      </h3>
      <p class="mb-0 mt-6 line-clamp-2 text-xs text-secondary leading-18px">
        {{ card.description }}
      </p>

      <div class="mt-10 flex items-center justify-between gap-8">
        <span class="min-w-0 flex items-center gap-6">
          <a-avatar :src="card.avatar" :size="22" round />
          <span class="truncate text-xs text-secondary">{{ card.author }}</span>
        </span>
        <span class="shrink-0 flex items-center gap-3 text-xs text-secondary">
          <Icon name="i-lucide:heart" :size="13" class="text-error/70" />
          {{ card.likes }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import type { MasonryCard } from '../types'

const { card } = defineProps<{
  card: MasonryCard
}>()

const emits = defineEmits<{
  /**
   * @desc 点击或键盘选中卡片
   * @param card 当前卡片数据
   */
  select: [card: MasonryCard]
}>()
</script>
