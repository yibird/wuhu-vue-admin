<template>
  <div
    v-if="renderItems.length > 0"
    class="h-360 flex flex-col overflow-hidden"
  >
    <div
      class="h-38 flex items-center justify-between border-b-1 border-color-1 border-b-solid bg-fill-1 px-14 text-xs text-muted"
    >
      <span>菜单</span>
      <span>{{ renderItems.length }} 个结果</span>
    </div>
    <Scrollbar
      ref="scrollbarRef"
      aria-label="菜单搜索结果"
      class="flex-1 overflow-hidden"
      content-class="px-10 py-8 flex flex-col gap-4"
      role="listbox"
    >
      <button
        v-for="({ item, segments }, index) in renderItems"
        :key="item.id"
        type="button"
        role="option"
        data-testid="search-modal-item"
        :aria-selected="activeIndex === index"
        :class="[
          'group relative min-h-52 w-full min-w-0 flex cursor-pointer items-center gap-10 overflow-hidden rounded-6 border-1 border-transparent border-solid bg-transparent px-9 py-7 text-left text-main transition-[background-color,border-color,box-shadow] duration-160',
          {
            'border-primary bg-primary-tint': activeIndex === index,
            'hover:(border-color-2 bg-hover-2)': activeIndex !== index,
          },
        ]"
        :title="`${item.title} · ${item.path}`"
        @mouseenter="activeIndex = index"
        @click="onSelect(item, index)"
      >
        <span
          class="size-32 flex shrink-0 items-center justify-center rounded-6 transition-colors duration-160"
          :class="
            activeIndex === index
              ? 'bg-primary [color:#fff]'
              : 'bg-fill-4 text-secondary group-hover:text-primary'
          "
        >
          <Icon :name="item.icon || 'i-lucide:search'" :size="20" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-500 leading-18px">
            <span
              v-for="(segment, segmentIndex) in segments"
              :key="`${segment.text}-${segmentIndex}`"
              :class="{
                'rounded-2 bg-primary px-2 font-600 [color:#fff]':
                  segment.matched,
              }"
            >
              {{ segment.text }}
            </span>
          </span>
          <span
            v-if="item.path"
            class="mt-3 block truncate text-xs text-muted leading-14px"
          >
            {{ item.path }}
          </span>
        </span>
        <Icon
          name="i-lucide:arrow-right"
          :size="20"
          class="shrink-0 transition-[opacity,transform,color] duration-160"
          :class="
            activeIndex === index
              ? 'translate-x-0 text-primary opacity-100'
              : '-translate-x-2 text-muted opacity-0 group-hover:(translate-x-0 opacity-100)'
          "
        />
      </button>
    </Scrollbar>
  </div>
  <div
    v-else
    class="h-260 flex flex-col items-center justify-center overflow-hidden px-24 text-center"
  >
    <div
      class="size-44 flex items-center justify-center rounded-full bg-fill-4 text-muted"
    >
      <Icon name="i-lucide:search-x" :size="20" />
    </div>
    <div class="mt-12 text-sm text-main font-500">没有找到匹配菜单</div>
    <div class="mt-5 text-xs text-muted">尝试缩短关键词或更换搜索内容</div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import {
  getPinyinSearchMatch,
  getSearchTextSegments,
  type SearchTextSegment,
} from './pinyin'
import type { ListEmits, ListProps } from './types'
import type { IMenu } from '#/config'
import type { ScrollbarInstance } from '@/components'

const { items = [], searchValue = '' } = defineProps<ListProps>()
const emits = defineEmits<ListEmits>()
const scrollbarRef = ref<ScrollbarInstance | null>(null)
const activeIndex = ref(0)

interface SearchResult {
  index: number
  item: IMenu
  score: number
  segments: SearchTextSegment[]
}

const renderItems = computed(() => {
  const keyword = searchValue.trim()
  if (!keyword) {
    return items.map<SearchResult>((item, index) => ({
      item,
      index,
      score: index,
      segments: getSearchTextSegments(item.title),
    }))
  }

  const results: SearchResult[] = []
  items.forEach((item, index) => {
    const match = getPinyinSearchMatch(item.title, keyword)
    if (!match) return

    results.push({
      item,
      index,
      score: match.score,
      segments: getSearchTextSegments(item.title, match),
    })
  })

  return results.sort((a, b) => a.score - b.score || a.index - b.index)
})

const stopKeyboardEvent = (event: KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()
}

const onSelect = (item: IMenu, index: number) => {
  emits('select', { item, index })
}

onKeyStroke('ArrowDown', (event) => {
  if (renderItems.value.length === 0) return
  stopKeyboardEvent(event)
  activeIndex.value = (activeIndex.value + 1) % renderItems.value.length
})

onKeyStroke('ArrowUp', (event) => {
  if (renderItems.value.length === 0) return
  stopKeyboardEvent(event)
  const count = renderItems.value.length
  activeIndex.value = (activeIndex.value - 1 + count) % count
})

onKeyStroke('Enter', (event) => {
  stopKeyboardEvent(event)
  const result = renderItems.value[activeIndex.value]
  if (result) {
    onSelect(result.item, activeIndex.value)
  }
})

watch(renderItems, (items) => {
  activeIndex.value = items.length > 0 ? 0 : -1
})

watch(activeIndex, async () => {
  await nextTick()
  const container = scrollbarRef.value?.getScrollElement()
  if (!container) return

  const content = scrollbarRef.value?.getContentElement()
  const activeItem = content?.children[activeIndex.value] as
    | HTMLElement
    | undefined
  if (!activeItem) return

  const itemTop = activeItem.offsetTop
  const itemBottom = itemTop + activeItem.offsetHeight
  const containerScrollTop = container.scrollTop
  const containerHeight = container.offsetHeight
  if (itemTop < containerScrollTop) {
    container.scrollTo({ top: itemTop })
  } else if (itemBottom > containerScrollTop + containerHeight) {
    container.scrollTo({ top: itemBottom - containerHeight })
  }
})
</script>
