<template>
  <div
    v-if="items.length > 0"
    ref="scrollContainer"
    class="h-300 px-10 py-5 overflow-auto"
  >
    <div
      v-for="(item, index) in renderItems"
      :key="item.id"
      :class="[
        'p-10 flex items-center rounded-4 cursor-pointer overflow-hidden hover:(bg-[#eee])',
        {
          'bg-[#f5f5f5]': activeIndex === index,
        },
      ]"
    >
      <Icon name="i-lucide:search" :size="18" />
      <span
        class="shrink-0 mx-5"
        v-html="highlight(item.title, searchValue)"
      ></span>
    </div>
  </div>
  <div v-else class="h-200 flex items-center justify-center">
    <n-empty />
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import type { ListEmits, ListProps } from './types'
import type { IMenu } from '#/config'

const { items = [], searchValue = '' } = defineProps<ListProps>()
const emits = defineEmits<ListEmits>()
const scrollContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const renderItems = computed(() => {
  if (!searchValue.trim()) return items
  console.log('Asdasd:', searchValue)
  return items.filter((item) =>
    item.title.toLowerCase().includes(searchValue.trim().toLowerCase())
  )
})

const highlight = (text: string, keyword: string) => {
  if (!keyword) return text
  // 使用正则进行不区分大小写的替换
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark class="bg-primary text-black">$1</mark>')
}

const onSelect = (item: IMenu, index: number) => {
  emits('select', { item, index })
}

// 监听键盘下键
onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
  activeIndex.value = (activeIndex.value + 1) % renderItems.value.length
})

// 监听键盘上键
onKeyStroke('ArrowUp', (e) => {
  e.preventDefault()
  const count = renderItems.value.length
  activeIndex.value = (activeIndex.value - 1 + count) % count
})

// 监听回车键
onKeyStroke('Enter', () => {
  if (activeIndex.value !== -1) {
    onSelect(renderItems.value[activeIndex.value]!, activeIndex.value)
  }
})

watch(activeIndex, async () => {
  await nextTick()
  const container = scrollContainer.value
  if (!container) return

  const activeItem = container.children[activeIndex.value] as HTMLElement
  if (!activeItem) return
  // 计算滚动位置
  const itemTop = activeItem.offsetTop
  const itemBottom = itemTop + activeItem.offsetHeight
  const containerScrollTop = container.scrollTop
  const containerHeight = container.offsetHeight
  if (itemTop < containerScrollTop) {
    // 向上超出：滚动到项的顶部
    container.scrollTo({ top: itemTop })
  } else if (itemBottom > containerScrollTop + containerHeight) {
    // 向下超出：滚动到项的底部
    container.scrollTo({ top: itemBottom - containerHeight })
  }
})
</script>
