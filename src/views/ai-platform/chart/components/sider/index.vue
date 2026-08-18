<template>
  <aside
    class="h-full min-h-0 shrink-0 flex flex-col overflow-hidden border-0 border-r-1 border-solid border-color-2 bg-container transition-[width,min-width,max-height] duration-motion-base ease-motion-enter will-change-[width] motion-reduce:transition-none max-xl:h-auto max-xl:max-h-260 max-xl:w-full max-xl:min-w-0 max-xl:border-r-0 max-xl:border-b-1 max-md:max-h-230"
    :class="
      collapsed
        ? 'w-72 min-w-72 max-xl:max-h-56'
        : 'w-320 min-w-320 max-2xl:w-300 max-2xl:min-w-300'
    "
  >
    <Header v-model:collapsed="collapsed" @create="emit('create')" />
    <div
      class="overflow-hidden px-10 transition-[max-height,opacity,padding] duration-motion-fast ease-motion-enter motion-reduce:transition-none"
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

      <div class="mt-8">
        <a-segmented
          v-model:value="activeView"
          :options="viewOptions"
          block
          size="large"
        >
          <template #labelRender="{ value }">
            <div
              class="flex-center gap-4 transition-colors duration-motion-fast"
            >
              <Icon
                :name="getViewOption(value).iconName"
                :size="13"
                class="shrink-0 transition-colors duration-motion-fast"
                :class="activeView === value ? 'text-primary' : ''"
              />
              <span class="truncate">{{ getViewOption(value).label }}</span>
              <span
                class="min-w-16 rounded-full bg-fill-tertiary px-4 text-10px text-muted leading-16px transition-[background-color,color] duration-motion-fast"
                :class="
                  activeView === value ? 'bg-primary/10 text-primary' : ''
                "
              >
                {{ getViewOption(value).count }}
              </span>
            </div>
          </template>
        </a-segmented>
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
import Header from './Header.vue'
import List from './List.vue'
import type { SiderEmits, SiderProps } from '../types'

const props = withDefaults(defineProps<SiderProps>(), {
  items: () => [],
  activeId: '',
})

const emit = defineEmits<SiderEmits>()
const collapsed = shallowRef(false)
const keyword = shallowRef('')
type SiderView = 'all' | 'pinned' | 'archived'

const activeView = shallowRef<SiderView>('all')

const viewCounts = computed(() =>
  props.items.reduce(
    (counts, item) => {
      if (item.archived) {
        counts.archived += 1
        return counts
      }

      counts.all += 1
      if (item.pinned) counts.pinned += 1
      return counts
    },
    { all: 0, pinned: 0, archived: 0 } satisfies Record<SiderView, number>
  )
)

const viewOptions = computed(() => [
  {
    value: 'all',
    label: '全部',
    iconName: 'i-lucide:message-square',
    count: viewCounts.value.all,
  },
  {
    value: 'pinned',
    label: '置顶',
    iconName: 'i-lucide:pin',
    count: viewCounts.value.pinned,
  },
  {
    value: 'archived',
    label: '归档',
    iconName: 'i-lucide:archive',
    count: viewCounts.value.archived,
  },
])

function getViewOption(value: string | number) {
  return (
    viewOptions.value.find((item) => item.value === value) ??
    viewOptions.value[0]
  )
}

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
