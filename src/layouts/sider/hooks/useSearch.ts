import {
  computed,
  nextTick,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { useTabs } from '@/hooks'
import { isSearchableMenu } from '@/router/utils'
import { useAppStore, usePermissionStore } from '@/store'
import { loadPinyinMatch, normalizeSearchKeyword } from '@/utils'
import { getMenuSearchScore } from '../components/search/util'
import { useSearchHistory } from './useSearchHistory'

import type { IMenu } from '#/config'

interface UseSearchOptions {
  value: Ref<string>
  collapsed?: MaybeRefOrGetter<boolean | undefined>
}

export function useSearch(options: UseSearchOptions) {
  const { sider, setCollapsed } = useAppStore()
  const { flatMenus, menuCache } = usePermissionStore()
  const { openTab } = useTabs()
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

  const searchableMenus = computed(() =>
    flatMenus.value.filter(isSearchableMenu)
  )

  const getBreadcrumb = (item: IMenu) => {
    const ids = item.level?.split('-') ?? []
    return ids
      .slice(0, -1)
      .map((id) => Reflect.get(menuCache.value.idMap, id)?.title)
      .filter((title): title is string => Boolean(title))
      .join(' / ')
  }

  const allResults = computed(() => {
    const keyword = normalizeSearchKeyword(options.value.value)
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
    panelOpen.value = true
  }

  const onClear = () => {
    options.value.value = ''
    inputRef.value?.focus()
  }

  const openPanel = async () => {
    if (isCollapsed.value) setCollapsed(false)
    panelOpen.value = true
    // 打开面板后用户很快开始输入,这里先把拼音匹配库预热,避免首个关键词漏掉拼音命中
    void loadPinyinMatch()
    await nextTick()
    inputRef.value?.focus()
  }

  const closePanel = () => {
    panelOpen.value = false
  }

  const onSelect = (item: IMenu) => {
    addRecord(options.value.value)
    openTab(item.id)
    options.value.value = ''
    closePanel()
  }

  const onSelectHistory = async (keyword: string) => {
    options.value.value = keyword
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
      let currentIndex = activeIndex.value
      if (currentIndex < 0) {
        // 未选中时：向下从第一条开始，向上从最后一条开始
        currentIndex = direction > 0 ? -1 : 0
      }
      activeIndex.value =
        (currentIndex + direction + results.value.length) % results.value.length
    }

    if (event.key === 'Enter') {
      if (event.isComposing) return
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
