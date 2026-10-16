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
      class="flex-1"
      content-class="px-10 py-8"
      role="listbox"
    >
      <SlidingHighlight
        ref="highlightRef"
        @mouseleave="clearHoveredIndex"
        :inset="4"
        pill-class-name="rounded-6 bg-primary-tint"
        class="flex flex-col gap-4"
        role="presentation"
      >
        <button
          v-for="({ item, segments }, index) in renderItems"
          :key="item.id"
          type="button"
          role="option"
          data-testid="search-modal-item"
          :aria-selected="activeIndex === index"
          :class="[
            'content-auto-52 group relative min-h-52 w-full min-w-0 flex cursor-pointer items-center gap-10 overflow-hidden rounded-6 border-1 border-transparent border-solid bg-transparent px-9 py-7 text-left text-main transition-[border-color] duration-motion-base hover:border-primary',
            activeIndex === index && 'border-primary',
          ]"
          :title="`${item.title} · ${item.path}`"
          @mouseenter="onItemHover(index)"
          @click="onSelect(item, index)"
        >
          <span
            class="size-32 flex shrink-0 items-center justify-center rounded-6 transition-colors duration-motion-base"
            :class="
              activeIndex === index
                ? 'bg-primary [color:#fff]'
                : 'bg-fill-4 text-secondary group-hover:(bg-primary [color:#fff])'
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
            class="shrink-0 transition-[opacity,translate,color] duration-motion-base"
            :class="
              activeIndex === index
                ? 'translate-x-0 text-primary opacity-100'
                : '-translate-x-2 text-muted opacity-0 group-hover:(translate-x-0 text-primary opacity-100)'
            "
          />
        </button>
      </SlidingHighlight>
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
import { Scrollbar, type ScrollbarInstance } from '@/components/scrollbar'
import {
  SlidingHighlight,
  type SlidingHighlightInstance,
} from '@/components/sliding-highlight'
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
const highlightRef = useTemplateRef<SlidingHighlightInstance>('highlightRef')
const activeIndex = ref(0)

/**
 * 指针悬停到的行索引
 *
 * 只用于回车选中（键鼠混用时的目标行），刻意不放进响应式状态：
 * 列表最多有几十行，悬停若触发响应式更新会让整列表重渲染 + 多处过渡重新开始
 */
let hoveredIndex = -1

function onItemHover(index: number) {
  hoveredIndex = index
}

/**
 * 键盘导航会改写 activeIndex，此时指针位置不再代表目标行
 */
function clearHoveredIndex() {
  hoveredIndex = -1
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
  if (renderItems.value.length === 0) return
  stopKeyboardEvent(event)
  clearHoveredIndex()
  activeIndex.value = (activeIndex.value + 1) % renderItems.value.length
})

onKeyStroke('ArrowUp', (event) => {
  if (renderItems.value.length === 0) return
  stopKeyboardEvent(event)
  clearHoveredIndex()
  const count = renderItems.value.length
  activeIndex.value = (activeIndex.value - 1 + count) % count
})

onKeyStroke('Enter', (event) => {
  stopKeyboardEvent(event)
  const index = hoveredIndex >= 0 ? hoveredIndex : activeIndex.value
  const result = renderItems.value[index]
  if (result) {
    onSelect(result.item, index)
  }
})

watch(renderItems, (items) => {
  clearHoveredIndex()
  activeIndex.value = items.length > 0 ? 0 : -1
})

/** 同步激活项的高亮块，并在必要时滚动到可视区域 */
const syncActiveHighlight = async () => {
  await nextTick()

  const container = scrollbarRef.value?.getScrollElement()
  const content = scrollbarRef.value?.getContentElement()
  const activeItem =
    content?.querySelectorAll<HTMLElement>('[role="option"]')[activeIndex.value]

  if (!activeItem) {
    highlightRef.value?.clear()
    return
  }

  highlightRef.value?.highlight(activeItem)

  if (!container || container.clientHeight === 0) return

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

watch([activeIndex, renderItems], syncActiveHighlight)

/**
 * 弹窗以 v-show 常驻挂载，隐藏时无法测量高亮位置；
 * 容器可见后（尺寸由 0 恢复）重新同步一次激活项高亮。
 */
let visibilityObserver: ResizeObserver | undefined

onMounted(() => {
  const container = scrollbarRef.value?.getScrollElement()
  if (!container || typeof ResizeObserver === 'undefined') return

  visibilityObserver = new ResizeObserver(() => {
    if (!container.clientHeight) return
    void syncActiveHighlight()
  })
  visibilityObserver.observe(container)
})

onBeforeUnmount(() => {
  visibilityObserver?.disconnect()
})
</script>
