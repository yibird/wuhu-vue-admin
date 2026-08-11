import { computed, shallowRef } from 'vue'

interface UseSearchHistoryOptions {
  storageKey: string
  initialRecords?: string[]
  collapsedCount?: number
  maxCount?: number
}

export function useSearchHistory(options: UseSearchHistoryOptions) {
  const {
    storageKey,
    initialRecords = [],
    collapsedCount = 5,
    maxCount = 20,
  } = options

  const records = shallowRef<string[]>(readStoredRecords())
  const expanded = shallowRef(false)

  const visibleRecords = computed(() =>
    expanded.value ? records.value : records.value.slice(0, collapsedCount)
  )
  const canToggle = computed(() => records.value.length > collapsedCount)

  function readStoredRecords() {
    if (typeof window === 'undefined') return [...initialRecords]

    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) return [...initialRecords]
      const parsed: unknown = JSON.parse(stored)
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [...initialRecords]
    } catch {
      return [...initialRecords]
    }
  }

  function updateRecords(nextRecords: string[]) {
    records.value = nextRecords
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(nextRecords))
  }

  function addRecord(keyword: string) {
    const normalized = keyword.trim()
    if (!normalized) return

    const nextRecords = records.value.filter(
      (record) => record.toLowerCase() !== normalized.toLowerCase()
    )
    updateRecords([normalized, ...nextRecords].slice(0, maxCount))
  }

  function removeRecord(keyword: string) {
    updateRecords(records.value.filter((record) => record !== keyword))
  }

  function clearRecords() {
    updateRecords([])
    expanded.value = false
  }

  function toggleExpanded() {
    expanded.value = !expanded.value
  }

  return {
    records,
    expanded,
    visibleRecords,
    canToggle,
    addRecord,
    removeRecord,
    clearRecords,
    toggleExpanded,
  }
}
