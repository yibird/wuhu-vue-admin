<template>
  <section
    class="overflow-hidden rounded-16 b-1-muted bg-container shadow-xl shadow-ink/5"
    aria-label="功能对比"
  >
    <div class="flex items-center justify-between gap-12 b-b-1-muted p-20">
      <div>
        <span
          class="inline-flex items-center gap-8 rounded-full bg-primary/10 px-10 py-4 text-xs text-primary font-800 uppercase tracking-wider"
        >
          <Icon name="i-lucide:layers" :size="12" />
          Compare
        </span>
        <h2 class="mt-8 text-xl text-main font-900 leading-26">能力对比</h2>
      </div>
    </div>

    <div class="overflow-x-auto">
      <div class="min-w-760">
        <!-- 表头 -->
        <div
          class="grid grid-cols-[minmax(210px,1.35fr)_repeat(3,minmax(150px,1fr))]"
        >
          <div
            class="min-w-0 bg-muted/60 px-20 py-14 text-left text-sm text-main font-800"
          >
            能力模块
          </div>
          <div
            v-for="column in planColumns"
            :key="column.key"
            class="min-w-0 b-l-1-muted px-16 py-14 text-center text-sm font-900 transition-colors duration-200 ease-[var(--w-motion-ease)] motion-reduce:transition-none"
            :class="{
              'bg-gradient-to-b from-primary/12 to-primary/5 text-primary':
                props.activePlanKey === column.key,
              'bg-muted/60 text-main': props.activePlanKey !== column.key,
            }"
          >
            {{ column.label }}
          </div>
        </div>

        <!-- 表体 -->
        <div
          v-for="item in props.features"
          :key="`${item.group}-${item.name}`"
          class="group grid grid-cols-[minmax(210px,1.35fr)_repeat(3,minmax(150px,1fr))] b-t-1-muted transition-colors duration-200 ease-[var(--w-motion-ease)] hover:bg-primary/[0.025] motion-reduce:transition-none"
        >
          <div class="min-w-0 px-20 py-13 text-left">
            <small
              class="block text-[11px] text-secondary font-600 uppercase tracking-wide"
            >
              {{ item.group }}
            </small>
            <strong class="mt-3 block text-sm text-main font-700">
              {{ item.name }}
            </strong>
          </div>
          <div
            v-for="column in planColumns"
            :key="column.key"
            class="min-w-0 b-l-1-muted px-16 py-13 text-center text-sm transition-[background-color,color] duration-300 ease-[var(--w-motion-ease)] motion-reduce:transition-none"
            :class="{
              'bg-primary/[0.06] text-primary font-700':
                props.activePlanKey === column.key,
            }"
          >
            <template v-if="typeof item[column.key] === 'string'">
              {{ item[column.key] }}
            </template>
            <span
              v-else-if="item[column.key]"
              class="inline-flex items-center justify-center"
            >
              <Icon
                name="i-lucide:check-circle-2"
                :size="18"
                class="text-success"
              />
            </span>
            <span v-else class="text-placeholder">—</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CompareFeature, PlanKey } from '../types'

interface Props {
  features: CompareFeature[]
  activePlanKey: PlanKey
}

const props = defineProps<Props>()
const planColumns: { key: PlanKey; label: string }[] = [
  { key: 'launch', label: 'Launch' },
  { key: 'scale', label: 'Scale' },
  { key: 'enterprise', label: 'Enterprise' },
]
</script>
