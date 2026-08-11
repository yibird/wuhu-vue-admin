<template>
  <aside
    class="h-full min-h-0 shrink-0 flex flex-col overflow-hidden border-0 border-r-1 border-solid border-color-2 bg-container transition-[width,min-width,max-height] duration-200 ease-out will-change-[width] max-xl:h-auto max-xl:max-h-260 max-xl:w-full max-xl:min-w-0 max-xl:border-r-0 max-xl:border-b-1 max-md:max-h-230"
    :class="
      collapsed
        ? 'w-72 min-w-72 max-xl:max-h-56'
        : 'w-320 min-w-320 max-2xl:w-300 max-2xl:min-w-300'
    "
  >
    <Header v-model:collapsed="collapsed" @create="emit('create')" />
    <div
      class="overflow-hidden px-10 transition-[max-height,opacity,padding] duration-150 ease-out"
      :class="
        collapsed
          ? 'max-h-0 pb-0 opacity-0 pointer-events-none'
          : 'max-h-94 pb-8 opacity-100'
      "
      :aria-hidden="collapsed"
      :inert="collapsed"
    >
      <a-input v-model:value="keyword" allow-clear placeholder="搜索会话">
        <template #prefix>
          <Icon name="i-lucide:search" :size="14" class="text-muted" />
        </template>
      </a-input>

      <div class="mt-8 grid grid-cols-3 gap-4 rounded-10 bg-fill-tertiary p-3">
        <button
          v-for="view in viewOptions"
          :key="view.key"
          type="button"
          class="h-28 min-w-0 rounded-7 border-0 bg-transparent px-4 text-12px text-secondary cursor-pointer transition-colors hover:text-main"
          :class="
            activeView === view.key ? 'bg-container text-main shadow-sm' : ''
          "
          @click="activeView = view.key"
        >
          <span
            class="inline-flex max-w-full items-center justify-center gap-4"
          >
            <Icon :name="view.icon" :size="13" />
            <span class="truncate">{{ view.label }}</span>
            <span class="text-11px text-muted">{{ view.count }}</span>
          </span>
        </button>
      </div>
    </div>
    <List
      :items="filteredItems"
      :active-id="activeId"
      :collapsed="collapsed"
      :empty-text="emptyText"
      :empty-hint="emptyHint"
      @change="emit('change', $event)"
      @archive="emit('archive', $event)"
      @delete="emit('delete', $event)"
      @pin="emit('pin', $event)"
      @rename="emit('rename', $event)"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { SiderEmits, SiderProps } from '../types'
import Header from './Header.vue'
import List from './List.vue'

const props = withDefaults(defineProps<SiderProps>(), {
  items: () => [],
  activeId: '',
})

const emit = defineEmits<SiderEmits>()
const collapsed = shallowRef(false)
const keyword = shallowRef('')
type SiderView = 'all' | 'pinned' | 'archived'

const activeView = shallowRef<SiderView>('all')

const viewOptions = computed(() => [
  {
    key: 'all' as const,
    label: '全部',
    icon: 'i-lucide:message-square',
    count: props.items.filter((item) => !item.archived).length,
  },
  {
    key: 'pinned' as const,
    label: '置顶',
    icon: 'i-lucide:pin',
    count: props.items.filter((item) => item.pinned && !item.archived).length,
  },
  {
    key: 'archived' as const,
    label: '归档',
    icon: 'i-lucide:archive',
    count: props.items.filter((item) => item.archived).length,
  },
])

const emptyText = computed(() => {
  if (keyword.value.trim()) return '没有匹配的会话'
  if (activeView.value === 'pinned') return '暂无置顶会话'
  if (activeView.value === 'archived') return '暂无归档会话'
  return '暂无会话记录'
})

const emptyHint = computed(() => {
  if (keyword.value.trim()) return '换个关键词试试'
  return activeView.value === 'archived'
    ? '归档的会话会显示在这里'
    : '点击上方按钮开始新会话'
})

const filteredItems = computed(() => {
  const value = keyword.value.trim().toLowerCase()

  return props.items
    .filter((item) => {
      if (activeView.value === 'pinned') return item.pinned && !item.archived
      if (activeView.value === 'archived') return item.archived
      return !item.archived
    })
    .filter((item) => {
      if (!value) return true

      return [item.title, item.description, item.tag]
        .filter(Boolean)
        .some((text) => text!.toLowerCase().includes(value))
    })
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
})
</script>
