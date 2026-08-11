import { computed, shallowRef, watch } from 'vue'
import type { ArticleItem, ArticleSort, ArticleStatus } from '../../types'

export type ArticleStatusFilter = ArticleStatus | 'all'

export function useArticleList(source: ArticleItem[]) {
  const items = shallowRef<ArticleItem[]>(source.map(cloneArticle))
  const keyword = shallowRef('')
  const statusFilter = shallowRef<ArticleStatusFilter>('all')
  const categoryFilter = shallowRef('all')
  const sortBy = shallowRef<ArticleSort>('updated-desc')
  const currentPage = shallowRef(1)
  const pageSize = shallowRef(12)

  const categories = computed(() => [
    ...new Set(items.value.map((item) => item.category)),
  ])
  const filteredItems = computed(() => {
    const text = keyword.value.trim().toLowerCase()
    const result = items.value.filter((item) => {
      const matchesKeyword =
        !text ||
        [
          item.title,
          item.summary,
          item.category,
          item.author.name,
          item.author.department,
          ...item.tags,
        ].some((value) => value.toLowerCase().includes(text))
      const matchesStatus =
        statusFilter.value === 'all' || item.status === statusFilter.value
      const matchesCategory =
        categoryFilter.value === 'all' || item.category === categoryFilter.value

      return matchesKeyword && matchesStatus && matchesCategory
    })

    return [...result].sort((a, b) => {
      if (sortBy.value === 'created-desc') {
        return b.createdAt.localeCompare(a.createdAt)
      }
      if (sortBy.value === 'title-asc') {
        return a.title.localeCompare(b.title, 'zh-CN')
      }
      if (sortBy.value === 'views-desc') return b.views - a.views
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
  const publishedCount = computed(
    () => items.value.filter((item) => item.status === 'published').length
  )
  const draftCount = computed(
    () => items.value.filter((item) => item.status === 'draft').length
  )

  watch([keyword, statusFilter, categoryFilter, sortBy], () => {
    currentPage.value = 1
  })
  watch(totalPages, (total) => {
    if (currentPage.value > total) currentPage.value = total
  })

  function clearFilters() {
    keyword.value = ''
    statusFilter.value = 'all'
    categoryFilter.value = 'all'
    sortBy.value = 'updated-desc'
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function duplicateItem(id: string) {
    const sourceItem = items.value.find((item) => item.id === id)
    if (!sourceItem) return

    const now = formatDateTime(new Date())
    const duplicate: ArticleItem = {
      ...cloneArticle(sourceItem),
      id: [sourceItem.id, 'copy', Date.now().toString(36)].join('-'),
      title: sourceItem.title + ' - 副本',
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      views: 0,
    }
    items.value = [duplicate, ...items.value]
    currentPage.value = 1
    return duplicate
  }

  function archiveItem(id: string) {
    updateItem(id, (item) => ({
      ...item,
      status: item.status === 'archived' ? 'draft' : 'archived',
      updatedAt: formatDateTime(new Date()),
    }))
  }

  function publishItem(id: string) {
    updateItem(id, (item) => ({
      ...item,
      status: 'published',
      updatedAt: formatDateTime(new Date()),
    }))
  }

  function updateItem(id: string, update: (item: ArticleItem) => ArticleItem) {
    items.value = items.value.map((item) =>
      item.id === id ? update(item) : item
    )
  }

  return {
    categories,
    categoryFilter,
    currentPage,
    draftCount,
    filteredItems,
    items,
    keyword,
    pageSize,
    paginatedItems,
    publishedCount,
    sortBy,
    statusFilter,
    archiveItem,
    clearFilters,
    duplicateItem,
    publishItem,
    removeItem,
  }
}

function cloneArticle(item: ArticleItem): ArticleItem {
  return {
    ...item,
    author: { ...item.author },
    tags: [...item.tags],
  }
}

function formatDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')
  const datePart = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-')
  const timePart = [pad(date.getHours()), pad(date.getMinutes())].join(':')
  return datePart + ' ' + timePart
}
