import { computed, ref, shallowRef } from 'vue'

interface UseSearchHistoryOptions {
  /** LocalStorage 存储 key */
  storageKey: string

  /** 无存储数据时使用的初始记录 */
  initialRecords?: string[]

  /** 折叠状态下最多显示的记录数 */
  collapsedCount?: number

  /** 最多保留的历史记录数 */
  maxCount?: number
}

export function useSearchHistory(options: UseSearchHistoryOptions) {
  const {
    storageKey,
    initialRecords = [],
    collapsedCount = 5,
    maxCount = 20,
  } = options

  /**
   * 从 LocalStorage 读取搜索历史。
   *
   * 非浏览器环境或存储数据异常时回退为初始记录。
   */
  function readStoredRecords(): string[] {
    if (typeof window === 'undefined') return [...initialRecords]

    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) return [...initialRecords]

      const parsed: unknown = JSON.parse(stored)
      if (!Array.isArray(parsed)) return [...initialRecords]

      return parsed.filter((item): item is string => typeof item === 'string')
    } catch {
      return [...initialRecords]
    }
  }

  const records = shallowRef<string[]>(readStoredRecords())
  const expanded = ref(false)

  /**
   * 当前应该展示的搜索历史。
   *
   * - 展开：显示全部
   * - 折叠：最多显示 collapsedCount 条
   */
  const visibleRecords = computed(() =>
    expanded.value ? records.value : records.value.slice(0, collapsedCount)
  )

  /**
   * 是否存在展开/收起操作的必要。
   */
  const canToggle = computed(() => records.value.length > collapsedCount)

  /**
   * 更新历史记录并持久化到 LocalStorage。
   */
  function persist(nextRecords: string[]) {
    if (records.value.length === nextRecords.length) {
      const unchanged = records.value.every(
        (record, index) => record === nextRecords[index]
      )

      if (unchanged) return
    }

    records.value = nextRecords

    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextRecords))
    } catch {
      // LocalStorage 可能不可用，或存储空间已满。
    }
  }

  /**
   * 添加一条搜索记录。
   *
   * 相同记录不区分大小写，新的记录会移动到列表顶部。
   */
  function addRecord(keyword: string) {
    const normalized = keyword.trim()
    if (!normalized) return

    const normalizedKeyword = normalized.toLowerCase()
    const nextRecords = records.value.filter(
      (record) => record.toLowerCase() !== normalizedKeyword
    )

    persist([normalized, ...nextRecords].slice(0, maxCount))
  }

  /**
   * 删除指定的搜索记录。
   *
   * 删除时同样不区分大小写，保持与添加记录一致。
   */
  function removeRecord(keyword: string) {
    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword) return

    const nextRecords = records.value.filter(
      (record) => record.toLowerCase() !== normalizedKeyword
    )

    persist(nextRecords)
  }

  /**
   * 清空全部搜索历史。
   */
  function clearRecords() {
    persist([])
    expanded.value = false
  }

  /**
   * 切换历史记录的展开/折叠状态。
   */
  function toggleExpanded() {
    expanded.value = !expanded.value
  }

  return {
    records,
    visibleRecords,
    expanded,
    canToggle,
    addRecord,
    removeRecord,
    clearRecords,
    toggleExpanded,
  }
}
