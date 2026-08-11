<script setup lang="ts">
import type { KnowledgeDetailSectionKey, KnowledgeNavItem } from '../types'

const props = defineProps<{
  activeKey: KnowledgeDetailSectionKey
  description: string
  sections: KnowledgeNavItem[]
  title: string
}>()

const emit = defineEmits<{
  'update:activeKey': [key: KnowledgeDetailSectionKey]
}>()

function selectSection(key: KnowledgeDetailSectionKey) {
  emit('update:activeKey', key)
}
</script>

<template>
  <aside
    class="h-full w-260 flex flex-none flex-col border-r-1 border-color-2 border-r-solid bg-container"
  >
    <div class="flex-none border-b-1 border-color-2 border-b-solid p-14">
      <div class="mb-10 flex items-center gap-10">
        <span
          class="size-40 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:library-big" :size="21" />
        </span>
        <div class="min-w-0">
          <h2 class="m-0 truncate text-md text-main font-700">
            {{ props.title }}
          </h2>
          <p class="m-0 mt-3 line-clamp-2 text-xs text-secondary">
            {{ props.description }}
          </p>
        </div>
      </div>
      <div
        class="rounded-8 border-1 border-color-2 border-solid bg-page px-10 py-8"
      >
        <div class="flex items-center justify-between text-xs">
          <span class="text-secondary">索引健康度</span>
          <strong class="text-success">96%</strong>
        </div>
        <div class="mt-6 h-6 overflow-hidden rounded-full bg-fill-tertiary">
          <div class="h-full w-[96%] rounded-full bg-success" />
        </div>
      </div>
    </div>

    <nav class="min-h-0 flex-1 overflow-y-auto p-8">
      <button
        v-for="section in props.sections"
        :key="section.key"
        type="button"
        :class="[
          'mb-6 w-full min-w-0 rounded-8 border-1 border-solid px-10 py-9 text-left transition-[background-color,border-color,transform] duration-200 hover:(-translate-y-1 border-primary/45 bg-primary/6)',
          section.key === props.activeKey
            ? 'border-primary/55 bg-primary/10 shadow-[0_8px_24px_rgb(var(--w-color-primary)_/_12%)]'
            : 'border-transparent bg-transparent',
        ]"
        @click="selectSection(section.key)"
      >
        <div class="flex items-center gap-9">
          <span
            :class="[
              'size-30 flex flex-none items-center justify-center rounded-7',
              section.key === props.activeKey
                ? 'bg-primary text-white'
                : 'bg-fill-tertiary text-secondary',
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
          <a-tag v-if="section.badge" class="m-0" :bordered="false">
            {{ section.badge }}
          </a-tag>
        </div>
      </button>
    </nav>
  </aside>
</template>
