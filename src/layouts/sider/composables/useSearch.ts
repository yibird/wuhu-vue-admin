import {
  computed,
  nextTick,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { useTabs } from '@/composables'
import { useAppStore } from '@/store'
import { getMenuSearchScore } from '../search'
import { useSearchHistory } from './useSearchHistory'

import type { IMenu } from '#/config'
import type { SiderSearchResult } from '../types'

interface UseSearchOptions {
  value: Ref<string>
  collapsed?: MaybeRefOrGetter<boolean | undefined>
  onChange?: (value: string) => void
  onClear?: () => void
}

export function useSearch(options: UseSearchOptions) {
  const { sider, setCollapsed } = useAppStore()
  const { flatMenus, openTab } = useTabs()
  const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
  const isCollapsed = computed(
    () => toValue(options.collapsed) ?? sider.value.collapsed
  )
  const panelOpen = shallowRef(false)
  const activeIndex = shallowRef(0)
  const {
    visibleRecords,
    expanded: historyExpanded,
    canToggle: canToggleHistory,
    addRecord,
    removeRecord,
    clearRecords,
    toggleExpanded: toggleHistory,
  } = useSearchHistory({
    storageKey: 'wuhu-layout-sider-search-history',
    collapsedCount: 5,
    maxCount: 20,
  })

  const menuMap = computed(
    () => new Map(flatMenus.value.map((item) => [String(item.id), item]))
  )

  const searchableMenus = computed(() =>
    flatMenus.value.filter(
      (item) => [1, 2].includes(item.type) && item.path && !item.disabled
    )
  )

  const getBreadcrumb = (item: IMenu) => {
    const ids = item.level?.split('-') ?? []
    return ids
      .slice(0, -1)
      .map((id) => menuMap.value.get(id)?.title)
      .filter((title): title is string => Boolean(title))
      .join(' / ')
  }

  const allResults = computed<SiderSearchResult[]>(() => {
    const keyword = options.value.value.trim().toLowerCase()
    if (!keyword) return []

    return searchableMenus.value
      .map((item) => {
        const breadcrumb = getBreadcrumb(item)
        const score = getMenuSearchScore(item, keyword, breadcrumb)

        return { item, breadcrumb, score }
      })
      .filter((result) => Number.isFinite(result.score))
      .sort(
        (a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title)
      )
      .map(({ item, breadcrumb }) => ({ item, breadcrumb }))
  })

  const results = computed(() => allResults.value.slice(0, 6))

  const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    options.value.value = target.value
    options.onChange?.(target.value)
    panelOpen.value = true
  }

  const onClear = () => {
    options.value.value = ''
    inputRef.value?.focus()
    options.onClear?.()
  }

  const openPanel = async () => {
    if (isCollapsed.value) setCollapsed(false)
    panelOpen.value = true
    await nextTick()
    inputRef.value?.focus()
  }

  const closePanel = () => {
    panelOpen.value = false
  }

  const onSelect = (item: IMenu) => {
    addRecord(options.value.value)
    openTab(String(item.id))
    options.value.value = ''
    closePanel()
    options.onClear?.()
  }

  const onSelectHistory = async (keyword: string) => {
    options.value.value = keyword
    options.onChange?.(keyword)
    panelOpen.value = true
    await nextTick()
    inputRef.value?.focus()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closePanel()
      return
    }

    if (!results.value.length) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const currentIndex =
        activeIndex.value < 0 ? (direction > 0 ? -1 : 0) : activeIndex.value
      activeIndex.value =
        (currentIndex + direction + results.value.length) % results.value.length
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const result = results.value[activeIndex.value]
      if (result) onSelect(result.item)
    }
  }

  watch(results, (nextResults) => {
    activeIndex.value = nextResults.length ? 0 : -1
  })

  return {
    isCollapsed,
    panelOpen,
    results,
    resultCount: computed(() => allResults.value.length),
    history: visibleRecords,
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
    removeHistory: removeRecord,
    clearHistory: clearRecords,
    toggleHistory,
    setActiveIndex: (index: number) => {
      activeIndex.value = index
    },
  }
}
