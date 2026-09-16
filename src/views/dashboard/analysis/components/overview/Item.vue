<script lang="ts" setup>
import { WCard } from '@/components'
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
  <WCard
    v-if="item"
    variant="outlined"
    size="small"
    class="page-enter analysis-overview-card group overflow-hidden rounded-8 shadow-[var(--w-shadow-card)] transition-[border-color,transform] duration-motion-base ease-motion-standard hover:(-translate-y-2 border-primary) focus-visible:(-translate-y-2 border-primary outline-2 outline-primary/48 outline-offset-2) motion-reduce:(transform-none transition-none)"
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
        <div
          class="tabular-nums text-3xl text-main font-800 leading-none tracking-tight"
        >
          <NumberTicker :value="item.value ?? 0" />
        </div>
        <div class="mt-10 flex items-center gap-6 text-xs text-secondary">
          <span>累计</span>
          <span class="tabular-nums text-sm text-main font-700">
            <NumberTicker :value="item.totalValue" />
          </span>
        </div>
      </div>
      <div
        class="analysis-overview-icon size-44 flex shrink-0 items-center justify-center rounded-10 border-1 border-primary/15 border-solid transition-[transform] duration-motion-base ease-motion-standard group-hover:(-translate-y-1 scale-104) group-focus-visible:(-translate-y-1 scale-104) motion-reduce:transition-none motion-reduce:group-hover:transform-none motion-reduce:group-focus-visible:transform-none"
      >
        <img :src="item.icon" alt="" class="size-26" />
      </div>
    </div>
  </WCard>
</template>

<style lang="less" scoped>
.analysis-overview-card {
  position: relative;
}

.analysis-overview-icon {
  background: linear-gradient(
    135deg,
    rgb(var(--w-color-primary) / 12%),
    rgb(var(--w-color-primary) / 4%)
  );
}
</style>
