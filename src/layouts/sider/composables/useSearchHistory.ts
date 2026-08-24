import { computed, shallowRef } from 'vue'

interface SiderSearchHistoryOptions {
  storageKey: string
  collapsedCount?: number
  maxCount?: number
}

export function useSearchHistory(options: SiderSearchHistoryOptions) {
  const { storageKey, collapsedCount = 5, maxCount = 20 } = options

  const records = shallowRef<string[]>(readStoredRecords())
  const expanded = shallowRef(false)

  const visibleRecords = computed(() =>
    expanded.value ? records.value : records.value.slice(0, collapsedCount)
  )
  const canToggle = computed(() => records.value.length > collapsedCount)

  function readStoredRecords() {
    if (typeof window === 'undefined') return []

    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) return []
      const parsed: unknown = JSON.parse(stored)
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : []
    } catch {
      return []
    }
  }

  function persist(nextRecords: string[]) {
    records.value = nextRecords
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextRecords))
    } catch {
      // Storage can be unavailable in private browsing or when the quota is full.
    }
  }

  function addRecord(keyword: string) {
    const normalized = keyword.trim()
    if (!normalized) return

    const nextRecords = records.value.filter(
      (record) => record.toLowerCase() !== normalized.toLowerCase()
    )
    persist([normalized, ...nextRecords].slice(0, maxCount))
  }

  function removeRecord(keyword: string) {
    persist(records.value.filter((record) => record !== keyword))
  }

  function clearRecords() {
    persist([])
    expanded.value = false
  }

  function toggleExpanded() {
    expanded.value = !expanded.value
  }

  return {
    visibleRecords,
    expanded,
    canToggle,
    addRecord,
    removeRecord,
    clearRecords,
    toggleExpanded,
  }
}
