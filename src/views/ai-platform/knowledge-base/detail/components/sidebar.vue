<template>
  <aside
    class="h-full w-260 flex flex-none flex-col b-r-1-secondary bg-container"
  >
    <div class="flex-none b-b-1-secondary p-14">
      <div class="flex items-start gap-10">
        <span
          class="size-40 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary inset-ring-1 inset-ring-primary/10"
        >
          <Icon name="i-lucide:library-big" :size="21" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="m-0 truncate text-md text-main font-700">
            {{ props.title }}
          </h2>
          <p class="m-0 mt-3 line-clamp-2 text-xs text-secondary">
            {{ props.description }}
          </p>
        </div>
      </div>
      <div class="mt-12 rounded-8 b-1-secondary bg-page px-10 py-9">
        <div class="flex items-center justify-between text-xs">
          <span class="text-secondary">索引健康度</span>
          <strong class="text-success tabular-nums">96%</strong>
        </div>
        <div class="mt-7 h-5 overflow-hidden rounded-full bg-success/12">
          <div class="h-full w-[96%] rounded-full bg-success" />
        </div>
      </div>
    </div>

    <nav class="min-h-0 flex-1 overflow-y-auto p-8">
      <button
        v-for="section in props.sections"
        :key="section.key"
        type="button"
        :aria-current="section.key === props.activeKey ? 'true' : undefined"
        :class="[
          'group relative mb-4 w-full min-w-0 flex items-center gap-9 overflow-hidden rounded-8 border-0 px-10 py-9 text-left outline-none transition-[background-color] duration-200 ease-[var(--w-motion-ease)] focus-visible:(ring-2 ring-primary/24)',
          section.key === props.activeKey
            ? 'bg-linear-to-r from-primary/20 to-primary/4'
            : 'bg-transparent hover:bg-hover',
        ]"
        @click="selectSection(section.key, $event)"
      >
        <span
          aria-hidden="true"
          :class="[
            'absolute left-0 top-1/2 h-18 w-3 -translate-y-1/2 rounded-r-full bg-primary transition-[transform,opacity] duration-200 ease-[var(--w-motion-ease)]',
            section.key === props.activeKey
              ? 'scale-y-100 opacity-100'
              : 'scale-y-0 opacity-0',
          ]"
        />
        <span
          :class="[
            'size-30 flex flex-none items-center justify-center rounded-7 transition-colors duration-200',
            section.key === props.activeKey
              ? 'bg-primary text-white'
              : 'bg-muted text-secondary group-hover:(bg-primary/10 text-primary)',
          ]"
        >
          <Icon :name="section.icon" :size="16" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm text-main font-700">
            {{ section.title }}
          </span>
          <span class="mt-2 block truncate text-xs text-secondary">
            {{ section.description }}
          </span>
        </span>
        <span
          v-if="section.badge"
          :class="[
            'shrink-0 rounded-full px-7 py-2 text-xs tabular-nums transition-colors duration-200',
            section.key === props.activeKey
              ? 'bg-primary/12 text-primary'
              : 'bg-muted text-secondary',
          ]"
        >
          {{ section.badge }}
        </span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { KnowledgeDetailSectionKey, KnowledgeNavItem } from '../types'

const props = defineProps<{
  activeKey: KnowledgeDetailSectionKey
  description: string
  sections: KnowledgeNavItem[]
  title: string
}>()

const emits = defineEmits<{
  'update:activeKey': [key: KnowledgeDetailSectionKey]
}>()

function selectSection(key: KnowledgeDetailSectionKey, event?: MouseEvent) {
  emits('update:activeKey', key)

  const el = event?.currentTarget
  if (!(el instanceof HTMLElement)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  el.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0.96)', offset: 0.32 },
      { transform: 'scale(1.015)', offset: 0.68 },
      { transform: 'scale(1)' },
    ],
    { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  )
}
</script>
