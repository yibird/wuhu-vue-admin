import { computed, shallowRef, watch } from 'vue'
import type {
  KnowledgeBaseCreateInput,
  KnowledgeBaseItem,
  KnowledgeBaseSort,
  KnowledgeBaseStatus,
} from '../../types'

export type KnowledgeBaseStatusFilter = KnowledgeBaseStatus | 'all'

export function useKnowledgeBaseList(source: KnowledgeBaseItem[]) {
  const items = shallowRef<KnowledgeBaseItem[]>(source.map(cloneKnowledgeBase))
  const keyword = shallowRef('')
  const statusFilter = shallowRef<KnowledgeBaseStatusFilter>('all')
  const sortBy = shallowRef<KnowledgeBaseSort>('updated-desc')
  const currentPage = shallowRef(1)
  const pageSize = shallowRef(12)

  const filteredItems = computed(() => {
    const text = keyword.value.trim().toLowerCase()
    const result = items.value.filter((item) => {
      const matchesKeyword =
        !text ||
        [
          item.name,
          item.description,
          item.creator.name,
          item.creator.role,
          ...item.tags,
        ].some((value) => value.toLowerCase().includes(text))
      const matchesStatus =
        statusFilter.value === 'all' || item.status === statusFilter.value

      return matchesKeyword && matchesStatus
    })

    return [...result].sort((a, b) => {
      if (sortBy.value === 'created-desc') {
        return b.createdAt.localeCompare(a.createdAt)
      }
      if (sortBy.value === 'name-asc') return a.name.localeCompare(b.name)
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredItems.value.length / pageSize.value))
  )
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredItems.value.slice(start, start + pageSize.value)
  })
  const onlineCount = computed(
    () => items.value.filter((item) => item.status === 'online').length
  )
  const draftCount = computed(
    () => items.value.filter((item) => item.status === 'draft').length
  )

  watch([keyword, statusFilter, sortBy], () => {
    currentPage.value = 1
  })
  watch(totalPages, (total) => {
    if (currentPage.value > total) currentPage.value = total
  })

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function createItem(input: KnowledgeBaseCreateInput) {
    const now = formatDateTime(new Date())
    const item: KnowledgeBaseItem = {
      id: `knowledge-base-${Date.now().toString(36)}`,
      kind: 'knowledge-base',
      name: input.name.trim(),
      description: input.description.trim(),
      tags: normalizeTags(input.tags),
      creator: { name: '当前用户', role: '知识库管理员' },
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      icon: input.icon,
      iconBackground: input.iconBackground,
      metrics: [],
    }

    items.value = [item, ...items.value]
    keyword.value = ''
    statusFilter.value = 'all'
    sortBy.value = 'created-desc'
    currentPage.value = 1

    return item
  }

  function duplicateItem(id: string) {
    const sourceItem = items.value.find((item) => item.id === id)
    if (!sourceItem) return

    const now = '2026-08-04 10:30'
    items.value = [
      {
        ...cloneKnowledgeBase(sourceItem),
        id: `${sourceItem.id}-copy-${Date.now().toString(36)}`,
        name: `${sourceItem.name} - 副本`,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      },
      ...items.value,
    ]
    currentPage.value = 1
  }

  function toggleItem(id: string) {
    items.value = items.value.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        status: item.status === 'online' ? 'offline' : 'online',
        updatedAt: '2026-08-04 10:30',
      }
    })
  }

  return {
    currentPage,
    draftCount,
    filteredItems,
    items,
    keyword,
    onlineCount,
    pageSize,
    paginatedItems,
    sortBy,
    statusFilter,
    createItem,
    duplicateItem,
    removeItem,
    toggleItem,
  }
}

function formatDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function normalizeTags(tags: string[]) {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))]
}

function cloneKnowledgeBase(item: KnowledgeBaseItem): KnowledgeBaseItem {
  return {
    ...item,
    creator: { ...item.creator },
    metrics: item.metrics.map((metric) => ({ ...metric })),
    tags: [...item.tags],
  }
}
