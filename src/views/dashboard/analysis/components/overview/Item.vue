<script lang="ts" setup>
import { NumberTicker } from '@/components/number-ticker'
import ItemExtra from './ItemExtra.vue'
import type { CardItemProps, CardItemEmits } from '../types.ts'

const { item, index } = defineProps<CardItemProps>()
const emits = defineEmits<CardItemEmits>()
const onChange = (val: string) => {
  emits('change', val, index)
}
</script>

<template>
  <a-card
    v-if="item"
    variant="outlined"
    size="small"
    class="analysis-overview-card overflow-hidden rounded-8 shadow-[var(--w-shadow-card)]"
    tabindex="0"
    :styles="{ body: { padding: '14px' } }"
  >
    <div class="flex items-start justify-between gap-12">
      <div class="min-w-0">
        <div class="truncate text-sm text-main font-700">{{ item.title }}</div>
        <div class="mt-4 text-xs text-secondary">{{ item.description }}</div>
      </div>
      <ItemExtra @change="onChange" />
    </div>

    <div class="mt-16 flex items-end justify-between gap-12">
      <div class="min-w-0">
        <div class="text-2xl text-main font-800 leading-none">
          <NumberTicker :value="item.value ?? 0" />
        </div>
        <div class="mt-10 flex items-center gap-6 text-xs text-secondary">
          <span>累计</span>
          <span class="text-sm text-main font-700">
            <NumberTicker :value="item.totalValue" />
          </span>
        </div>
      </div>
      <div
        class="analysis-overview-icon size-44 flex shrink-0 items-center justify-center rounded-10 bg-primary/8 border-1 border-primary/15 border-solid"
      >
        <img :src="item.icon" alt="" class="size-26" />
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.analysis-overview-card {
  cursor: default;
  transition:
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.analysis-overview-card:hover,
.analysis-overview-card:focus-visible {
  border-color: rgb(var(--w-color-primary) / 34%);
  box-shadow: 0 12px 28px rgb(var(--w-shadow-color) / 14%);
  transform: translateY(-2px);
}

.analysis-overview-card:focus-visible {
  outline: 2px solid rgb(var(--w-color-primary) / 48%);
  outline-offset: 2px;
}

.analysis-overview-icon {
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.analysis-overview-card:hover .analysis-overview-icon,
.analysis-overview-card:focus-visible .analysis-overview-icon {
  background-color: rgb(var(--w-color-primary) / 18%);
  transform: translateY(-1px) scale(1.04);
}

@media (prefers-reduced-motion: reduce) {
  .analysis-overview-card,
  .analysis-overview-icon {
    transition: none;
  }

  .analysis-overview-card:hover,
  .analysis-overview-card:focus-visible,
  .analysis-overview-card:hover .analysis-overview-icon,
  .analysis-overview-card:focus-visible .analysis-overview-icon {
    transform: none;
  }
}
</style>
