<template>
  <a-border-beam :duration="6" :line-width="3">
    <Card
      class="overflow-hidden rounded-8 b-1-regular shadow-card transition-[border-color,box-shadow,transform] duration-motion-moderate ease-motion-enter hover:(-translate-y-2 shadow-overlay) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      variant="borderless"
      :body-class="bodyClass"
      :styles="cardStyles"
    >
      <template #title>
        <div class="relative z-1 min-w-0 flex items-center gap-10">
          <span
            class="size-30 flex shrink-0 items-center justify-center rounded-8 primary-tinted"
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
        <div class="relative z-1 flex items-center">
          <slot name="extra" />
        </div>
      </template>

      <slot />
    </Card>
  </a-border-beam>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { Card } from '@/components'

const props = withDefaults(
  defineProps<{
    title: string
    icon?: string
    bodyClass?: string
    description?: string
  }>(),
  {
    icon: 'i-lucide:activity',
    bodyClass: undefined,
    description: '',
  }
)

const cardStyles = computed<Record<string, CSSProperties>>(() => ({
  header: {
    minHeight: '52px',
    borderBottom: '0',
    background:
      'linear-gradient(135deg, rgb(var(--w-color-primary) / 5%) 0%, transparent 68%)',
  },
  body: {
    padding: props.bodyClass ? undefined : '16px',
  },
}))
</script>
