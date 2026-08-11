<script setup lang="ts">
import type { SummaryCard } from '../types'

defineProps<{
  items: SummaryCard[]
}>()
</script>

<template>
  <div class="grid grid-cols-4 gap-12 max-lg:grid-cols-2 max-sm:grid-cols-1">
    <article
      v-for="item in items"
      :key="item.label"
      class="group min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container p-14 text-main shadow-[var(--w-shadow-elevated)] transition-[transform,border-color] duration-220 hover:(-translate-y-1 border-primary/40) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div class="flex items-start justify-between gap-10">
        <div class="min-w-0">
          <div class="text-xs text-secondary">{{ item.label }}</div>
          <div class="mt-6 text-24px font-800 leading-[1.1] tabular-nums">
            {{ item.value }}
          </div>
        </div>
        <span
          class="size-34 flex shrink-0 items-center justify-center rounded-6 bg-primary/10 text-primary transition-transform duration-220 group-hover:scale-105"
        >
          <Icon :name="item.icon" :size="18" />
        </span>
      </div>
      <div class="mt-10 truncate text-xs text-secondary">
        {{ item.description }}
      </div>
    </article>
  </div>
</template>
