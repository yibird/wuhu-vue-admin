<template>
  <div
    class="min-w-0 rounded-8 px-6 py-10 transition-[background-color,transform] hover:(-translate-y-1 bg-hover) sm:px-10 2xl:px-6"
    tabindex="0"
  >
    <div class="flex items-start gap-10">
      <span
        class="size-32 flex shrink-0 items-center justify-center rounded-8"
        :class="item.iconClass"
      >
        <Icon :name="item.icon" :size="16" />
      </span>
      <div class="min-w-0">
        <div class="truncate text-xs text-secondary">{{ item.label }}</div>
        <div class="mt-3 min-w-0">
          <span class="block text-lg text-main font-800">
            {{ item.value }}
          </span>
          <span class="mt-2 block truncate text-xs text-secondary">
            {{ item.description }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FunnelInsight } from './types'

const { item } = defineProps<{
  item: FunnelInsight
}>()
</script>
