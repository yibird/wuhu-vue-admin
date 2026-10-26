<template>
  <div
    v-if="renderItems.length > 0"
    class="h-360 flex flex-col overflow-hidden"
  >
    <div
      class="h-38 flex items-center justify-between b-b-1-muted bg-secondary px-14 text-xs text-muted"
    >
      <span>菜单</span>
      <span>{{ renderItems.length }} 个结果</span>
    </div>
    <Scrollbar
      ref="scrollbarRef"
      aria-label="菜单搜索结果"
      class="flex-1"
      content-class="px-10 py-8"
      role="listbox"
    >
      <SlidingHighlight
        @mouseleave="clearHoveredIndex"
        :inset="4"
        pill-class-name="rounded-6 bg-primary/10"
        class="flex flex-col gap-4"
        role="presentation"
      >
        <button
          v-for="({ item, segments }, index) in renderItems"
          :key="item.id"
          type="button"
          role="option"
          data-testid="search-modal-item"
          :aria-selected="
            hoveredIndex === index ||
            (hoveredIndex < 0 && activeIndex === index)
          "
          :class="[
            'content-auto-52 relative min-h-52 w-full min-w-0 flex cursor-pointer items-center gap-10 overflow-hidden rounded-6 bg-transparent px-9 py-7 text-left text-main transition-colors duration-motion-base',
            activeIndex === index && hoveredIndex !== index && 'bg-muted',
          ]"
          :title="`${item.title} · ${item.path}`"
          @mouseenter="onItemPointerMove(index)"
          @pointermove="onItemPointerMove(index)"
          @click="onSelect(item, index)"
        >
          <span
            class="size-32 flex shrink-0 items-center justify-center rounded-6 transition-colors duration-motion-base"
            :class="
              hoveredIndex === index
                ? 'bg-primary [color:#fff]'
                : activeIndex === index
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-secondary'
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
        </button>
      </SlidingHighlight>
    </Scrollbar>
  </div>
  <div
    v-else
    class="h-260 flex flex-col items-center justify-center overflow-hidden px-24 text-center"
  >
    <div
      class="size-44 flex items-center justify-center rounded-full bg-muted text-muted"
    >
      <Icon name="i-lucide:search-x" :size="20" />
    </div>
    <div class="mt-12 text-sm text-main font-500">没有找到匹配菜单</div>
    <div class="mt-5 text-xs text-muted">尝试缩短关键词或更换搜索内容</div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { Scrollbar, type ScrollbarInstance } from '@/components/scrollbar'
import { SlidingHighlight } from '@/components/sliding-highlight'
import {
  getSearchMatch,
  getSearchTextSegments,
  normalizeSearchKeyword,
  type SearchTextSegment,
} from '@/utils'
import type { ListEmits, ListProps } from './types'
import type { IMenu } from '#/config'

const { items = [], searchValue = '' } = defineProps<ListProps>()
const emits = defineEmits<ListEmits>()
const scrollbarRef = ref<ScrollbarInstance | null>(null)
/** 键盘导航选中的行索引,-1 表示尚未使用键盘选择 */
const activeIndex = ref(-1)
/** 指针悬停到的行索引,-1 表示指针不在任何行上 */
const hoveredIndex = ref(-1)

/**
 * 指针悬浮优先级高于键盘选择
 *
 * 两个索引同时存在时,悬浮行显示强高亮,键盘行显示弱高亮;
 * 两者重合时只保留悬浮强高亮。
 */
function onItemPointerMove(index: number) {
  if (hoveredIndex.value === index) return
  hoveredIndex.value = index
}

/** 指针离开列表只清除悬浮高亮,键盘选择结果保留 */
function clearHoveredIndex() {
  hoveredIndex.value = -1
}

interface SearchResult {
  index: number
  item: IMenu
  score: number
  segments: SearchTextSegment[]
}

const renderItems = computed(() => {
  const keyword = normalizeSearchKeyword(searchValue)
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
    const match = getSearchMatch(item.title, keyword)
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
  const count = renderItems.value.length
  if (count === 0) return
  stopKeyboardEvent(event)
  activeIndex.value =
    activeIndex.value < 0 ? 0 : (activeIndex.value + 1) % count
})

onKeyStroke('ArrowUp', (event) => {
  const count = renderItems.value.length
  if (count === 0) return
  stopKeyboardEvent(event)
  activeIndex.value =
    activeIndex.value < 0 ? count - 1 : (activeIndex.value - 1 + count) % count
})

onKeyStroke('Enter', (event) => {
  stopKeyboardEvent(event)
  const count = renderItems.value.length
  if (count === 0) return
  // 悬浮优先;没有悬浮且未键盘选择时,回车默认打开第一条结果
  const index =
    hoveredIndex.value >= 0
      ? hoveredIndex.value
      : activeIndex.value >= 0
        ? activeIndex.value
        : 0
  const result = renderItems.value[index]
  if (result) {
    onSelect(result.item, index)
  }
})

watch(renderItems, () => {
  hoveredIndex.value = -1
  activeIndex.value = -1
})

/** 键盘选择变化时,把选中项滚动到可视区域 */
const scrollActiveIntoView = async () => {
  await nextTick()

  const index = activeIndex.value
  if (index < 0) return

  const container = scrollbarRef.value?.getScrollElement()
  const content = scrollbarRef.value?.getContentElement()
  const activeItem =
    content?.querySelectorAll<HTMLElement>('[role="option"]')[index]

  if (!activeItem || !container || container.clientHeight === 0) return

  const containerRect = container.getBoundingClientRect()
  const itemRect = activeItem.getBoundingClientRect()
  const itemTop = itemRect.top - containerRect.top + container.scrollTop
  const itemBottom = itemTop + itemRect.height
  const containerScrollTop = container.scrollTop
  const containerHeight = container.clientHeight
  if (itemTop < containerScrollTop) {
    container.scrollTo({ top: itemTop })
  } else if (itemBottom > containerScrollTop + containerHeight) {
    container.scrollTo({ top: itemBottom - containerHeight })
  }
}

watch([activeIndex, renderItems], scrollActiveIntoView)

/**
 * 弹窗以 v-show 常驻挂载，隐藏时无法测量位置；
 * 容器可见后（尺寸由 0 恢复）重新同步一次键盘选中项的滚动位置。
 */
let visibilityObserver: ResizeObserver | undefined

onMounted(() => {
  const container = scrollbarRef.value?.getScrollElement()
  if (!container || typeof ResizeObserver === 'undefined') return

  visibilityObserver = new ResizeObserver(() => {
    if (!container.clientHeight) return
    void scrollActiveIntoView()
  })
  visibilityObserver.observe(container)
})

onBeforeUnmount(() => {
  visibilityObserver?.disconnect()
})
</script>
