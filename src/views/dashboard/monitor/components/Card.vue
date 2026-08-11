<script setup lang="ts">
import type { CSSProperties } from 'vue'

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
      'linear-gradient(135deg, rgb(var(--w-color-primary) / 8%) 0%, rgb(var(--w-color-info) / 5%) 48%, rgb(var(--w-bg-container)) 100%)',
  },
  body: {
    padding: props.bodyClass ? undefined : '16px',
    background: 'rgb(var(--w-bg-container))',
  },
}))
</script>

<template>
  <a-card
    class="overflow-hidden rounded-8 border-1 border-solid border-color-2 shadow-[var(--w-shadow-card)] transition-[border-color,box-shadow,transform] duration-220 ease-out hover:(-translate-y-2 shadow-[var(--w-shadow-elevated)]) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    variant="borderless"
    :body-class="bodyClass"
    :styles="cardStyles"
  >
    <template #title>
      <div class="relative z-1 min-w-0 flex items-center gap-10">
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
      <div class="relative z-1 flex items-center">
        <slot name="extra" />
      </div>
    </template>

    <slot />
  </a-card>
</template>
