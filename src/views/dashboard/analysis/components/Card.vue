<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { WCard } from '@/components'

withDefaults(
  defineProps<{
    title: string
    icon?: string
    description?: string
    bodyClass?: string
  }>(),
  {
    icon: 'i-lucide:chart-no-axes-combined',
    description: '',
    bodyClass: undefined,
  }
)

const cardStyles: Record<string, CSSProperties> = {
  header: {
    minHeight: '52px',
    borderBottom: '0',
    background:
      'linear-gradient(135deg, rgb(var(--w-color-primary) / 5%) 0%, transparent 68%)',
  },
}
</script>

<template>
  <WCard
    class="overflow-hidden rounded-8 border-1 border-solid border-color-2 transition-[transform] duration-motion-base ease-motion-standard hover:(-translate-y-1) motion-reduce:(transform-none transition-none)"
    variant="borderless"
    :body-class="bodyClass"
    :styles="cardStyles"
  >
    <template #title>
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-30 flex shrink-0 items-center justify-center rounded-8 icon-primary-soft"
        >
          <Icon :name="icon" :size="16" />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm text-main font-700">{{
            title
          }}</span>
          <span
            v-if="description"
            class="mt-1 block truncate text-xs text-secondary font-400"
          >
            {{ description }}
          </span>
        </span>
      </div>
    </template>

    <template v-if="$slots.extra" #extra>
      <div class="flex items-center">
        <slot name="extra" />
      </div>
    </template>

    <slot />
  </WCard>
</template>
