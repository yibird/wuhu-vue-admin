<script lang="ts" setup>
import type { CSSProperties } from 'vue'

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
      'linear-gradient(135deg, rgb(var(--w-color-primary) / 6%) 0%, rgb(var(--w-bg-container)) 68%)',
  },
  body: {
    background: 'rgb(var(--w-bg-container))',
  },
}
</script>

<template>
  <a-card
    class="analysis-card overflow-hidden rounded-8 border-1 border-solid border-color-2 shadow-[var(--w-shadow-card)]"
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
  </a-card>
</template>

<style scoped>
.analysis-card {
  transition:
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.analysis-card:hover {
  border-color: rgb(var(--w-color-primary) / 22%);
  box-shadow: 0 10px 28px rgb(var(--w-shadow-color) / 12%);
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .analysis-card {
    transition: none;
  }

  .analysis-card:hover {
    transform: none;
  }
}
</style>
