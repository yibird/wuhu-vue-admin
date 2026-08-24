<script setup lang="ts">
import type { CapabilityStatus, ReportCapabilityGroup } from '../types'

const props = defineProps<{
  fieldCount: number
  groups: ReportCapabilityGroup[]
  rowCount: number
  schemaVersion: string
}>()

const statusMeta: Record<
  CapabilityStatus,
  { label: string; class: string; icon: string }
> = {
  partial: {
    class: 'border-warning bg-container text-warning',
    icon: 'i-lucide:circle-dot-dashed',
    label: '部分支持',
  },
  planned: {
    class: 'border-color-2 bg-page text-tertiary',
    icon: 'i-lucide:clock-3',
    label: '规划中',
  },
  ready: {
    class: 'border-success bg-container text-success',
    icon: 'i-lucide:circle-check',
    label: '已就绪',
  },
}

const totals = computed(() => {
  const items = props.groups.flatMap((group) => group.items)
  const ready = items.filter((item) => item.status === 'ready').length
  const partial = items.filter((item) => item.status === 'partial').length
  const planned = items.filter((item) => item.status === 'planned').length
  const score = items.length
    ? Math.round(((ready + partial * 0.5) / items.length) * 100)
    : 0

  return {
    partial,
    planned,
    ready,
    score,
    total: items.length,
  }
})
</script>

<template>
  <section class="grid min-h-full gap-12px">
    <header
      class="grid gap-10px rounded-8px border-1 border-color-2 border-solid bg-container p-12px"
    >
      <div class="flex items-center justify-between gap-10px">
        <div class="min-w-0">
          <span class="block text-11px text-tertiary font-800 uppercase">
            Enterprise Readiness
          </span>
          <strong class="mt-3px block text-16px text-primary font-750">
            生产可用度 {{ totals.score }}%
          </strong>
        </div>
        <span
          class="size-42px inline-flex items-center justify-center rounded-8px border-1 border-primary border-solid bg-page text-primary"
        >
          <Icon name="i-lucide:shield-check" :size="21" />
        </span>
      </div>
      <a-progress
        :percent="totals.score"
        :show-info="false"
        :size="['100%', 7]"
      />
      <div class="grid grid-cols-3 gap-8px">
        <div class="rounded-8px bg-page p-8px">
          <span class="block text-11px text-tertiary">已就绪</span>
          <strong class="text-16px text-success">{{ totals.ready }}</strong>
        </div>
        <div class="rounded-8px bg-page p-8px">
          <span class="block text-11px text-tertiary">部分</span>
          <strong class="text-16px text-warning">{{ totals.partial }}</strong>
        </div>
        <div class="rounded-8px bg-page p-8px">
          <span class="block text-11px text-tertiary">规划</span>
          <strong class="text-16px text-secondary">{{ totals.planned }}</strong>
        </div>
      </div>
    </header>

    <section
      class="grid gap-8px rounded-8px border-1 border-color-2 border-solid bg-container p-12px"
    >
      <div class="flex items-center justify-between gap-8px">
        <span class="text-12px text-tertiary font-700">Schema</span>
        <code class="rounded-6px bg-page px-7px py-3px text-12px text-info">
          v{{ schemaVersion }}
        </code>
      </div>
      <div class="grid grid-cols-2 gap-8px">
        <div class="rounded-8px bg-page p-9px">
          <span class="block text-11px text-tertiary">字段</span>
          <strong class="text-15px text-primary">{{ fieldCount }}</strong>
        </div>
        <div class="rounded-8px bg-page p-9px">
          <span class="block text-11px text-tertiary">数据行</span>
          <strong class="text-15px text-primary">
            {{ rowCount.toLocaleString('zh-CN') }}
          </strong>
        </div>
      </div>
    </section>

    <article
      v-for="group in groups"
      :key="group.title"
      class="grid gap-10px rounded-8px border-1 border-color-2 border-solid bg-container p-12px"
    >
      <div class="flex min-w-0 items-start gap-9px">
        <span
          class="size-32px inline-flex shrink-0 items-center justify-center rounded-8px bg-page text-info"
        >
          <Icon :name="group.icon" :size="17" />
        </span>
        <div class="min-w-0">
          <strong class="block text-14px text-primary">{{
            group.title
          }}</strong>
          <span class="mt-3px block text-12px text-tertiary leading-18px">
            {{ group.description }}
          </span>
        </div>
      </div>

      <div class="grid gap-8px">
        <div
          v-for="item in group.items"
          :key="item.label"
          class="grid gap-7px rounded-8px border-1 border-color-1 border-solid bg-page p-10px"
        >
          <div class="flex min-w-0 items-center gap-8px">
            <Icon :name="item.icon" :size="15" class="shrink-0 text-info" />
            <strong class="min-w-0 flex-1 truncate text-13px text-primary">
              {{ item.label }}
            </strong>
            <span
              class="inline-flex shrink-0 items-center gap-4px rounded-full border-1 border-solid px-7px py-2px text-11px"
              :class="statusMeta[item.status].class"
            >
              <Icon :name="statusMeta[item.status].icon" :size="12" />
              {{ statusMeta[item.status].label }}
            </span>
          </div>
          <p class="m-0 text-12px text-tertiary leading-18px">
            {{ item.description }}
          </p>
        </div>
      </div>
    </article>
  </section>
</template>
