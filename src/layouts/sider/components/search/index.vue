<template>
  <div class="relative h-48 flex items-center justify-center px-10">
    <div
      ref="triggerRef"
      :class="[
        'group h-34 flex-center overflow-hidden rounded-5 border-1 border-regular px-10 text-main outline-none transition-all duration-200 ease-[var(--w-motion-ease-enter)] active:scale-[0.99]',
        isCollapsed ? 'cursor-pointer' : '',
        panelOpen ? 'border-primary' : 'border-main',
      ]"
      role="combobox"
      :aria-expanded="panelOpen"
      aria-controls="layout-sider-search-panel"
      aria-haspopup="dialog"
      @click="panelOpen ? closePanel() : openPanel()"
    >
      <Icon
        name="i-lucide:search"
        :size="16"
        class="shrink-0 transition-[color,transform] duration-200 group-hover:text-primary"
        :class="panelOpen ? 'text-primary' : 'text-main'"
      />
      <div
        v-if="!isCollapsed"
        class="relative h-full min-w-0 flex-1 flex items-center overflow-hidden"
      >
        <input
          ref="inputRef"
          v-model="value"
          placeholder="搜索菜单"
          autocomplete="off"
          spellcheck="false"
          aria-label="搜索菜单"
          class="h-full w-full min-w-0 border-none bg-transparent px-8 text-sm text-main outline-none placeholder:text-placeholder"
          @input="onChange"
          @keydown="onKeydown"
        />
        <button
          v-if="value.length > 0"
          type="button"
          aria-label="清除搜索内容"
          class="size-26 flex shrink-0 cursor-pointer items-center justify-center rounded-5 border-0 bg-transparent p-0 text-muted transition-colors hover:(bg-hover text-main)"
          @mousedown.prevent
          @click.stop="onClear"
        >
          <Icon name="i-lucide:x" :size="15" />
        </button>
      </div>
      <span v-else class="sr-only"> 搜索菜单 </span>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="fade-zoom">
      <div
        v-if="panelOpen"
        ref="panelRef"
        :style="panelStyle"
        class="fixed z-10000 flex flex-col"
        role="dialog"
        aria-label="菜单搜索面板"
      >
        <SearchPanel
          :keyword="value"
          :results="results"
          :result-count="resultCount"
          :history="history"
          :history-expanded="historyExpanded"
          :can-toggle-history="canToggleHistory"
          :active-index="activeIndex"
          @select="onSelect"
          @select-history="onSelectHistory"
          @remove-history="removeHistory"
          @clear-history="clearHistory"
          @toggle-history="toggleHistory"
          @active-change="setActiveIndex"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { useElementBounding, useWindowSize, onClickOutside } from '@vueuse/core'
import { useSearch } from '../../hooks/index.ts'
import SearchPanel from './search-panel.vue'
import type { SearchProps } from '../types.ts'

const value = defineModel<string>('value', { default: '' })
const props = defineProps<SearchProps>()

const {
  isCollapsed,
  panelOpen,
  results,
  resultCount,
  history,
  historyExpanded,
  canToggleHistory,
  activeIndex,
  onChange,
  onClear,
  openPanel,
  closePanel,
  onSelect,
  onSelectHistory,
  onKeydown,
  removeHistory,
  clearHistory,
  toggleHistory,
  setActiveIndex,
} = useSearch({
  value,
  collapsed: () => props.collapsed,
})

const triggerRef = useTemplateRef<HTMLDivElement>('triggerRef')
const panelRef = useTemplateRef<HTMLElement>('panelRef')
const { left, bottom } = useElementBounding(triggerRef)
const { width: viewportWidth, height: viewportHeight } = useWindowSize()
const panelStyle = computed(() => {
  const panelWidth = Math.min(380, Math.max(280, viewportWidth.value - 24))
  const panelLeft = Math.min(
    Math.max(12, left.value),
    Math.max(12, viewportWidth.value - panelWidth - 12)
  )
  const panelTop = Math.min(
    Math.max(12, bottom.value + 8),
    viewportHeight.value - 12
  )

  return {
    left: `${panelLeft}px`,
    top: `${panelTop}px`,
    width: `${panelWidth}px`,
    maxHeight: `${Math.max(0, viewportHeight.value - panelTop - 12)}px`,
  }
})

onClickOutside(panelRef, closePanel, { ignore: [triggerRef] })
</script>
