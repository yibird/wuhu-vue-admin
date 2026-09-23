import { computed, shallowRef, watch } from 'vue'
import { getProviderLabel } from '../data'
import type {
  ModelCreateInput,
  ModelItem,
  ModelProvider,
  ModelSort,
  ModelStatus,
} from '../types'

export type ModelStatusFilter = ModelStatus | 'all'
export type ModelProviderFilter = ModelProvider | 'all'

export function useModelList(source: ModelItem[]) {
  const items = shallowRef<ModelItem[]>(source.map(cloneModel))
  const keyword = shallowRef('')
  const providerFilter = shallowRef<ModelProviderFilter>('all')
  const statusFilter = shallowRef<ModelStatusFilter>('all')
  const sortBy = shallowRef<ModelSort>('updated-desc')
  const currentPage = shallowRef(1)
  const pageSize = shallowRef(10)

  const filteredItems = computed(() => {
    const text = keyword.value.trim().toLowerCase()
    const result = items.value.filter((item) => {
      const matchesKeyword =
        !text ||
        [
          item.name,
          item.modelId,
          item.providerName,
          item.description,
          item.endpoint,
          ...item.capabilities,
        ].some((value) => value.toLowerCase().includes(text))
      const matchesProvider =
        providerFilter.value === 'all' || item.provider === providerFilter.value
      const matchesStatus =
        statusFilter.value === 'all' || item.status === statusFilter.value

      return matchesKeyword && matchesProvider && matchesStatus
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
  const providerCount = computed(
    () => new Set(items.value.map((item) => item.providerName)).size
  )
  const configuredCount = computed(
    () => items.value.filter((item) => item.apiKeyConfigured).length
  )

  watch([keyword, providerFilter, statusFilter, sortBy], () => {
    currentPage.value = 1
  })
  watch(totalPages, (total) => {
    if (currentPage.value > total) currentPage.value = total
  })

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function createItem(input: ModelCreateInput) {
    const item = createModel(input)
    items.value = [item, ...items.value]
    resetFilters()
    sortBy.value = 'created-desc'
    return item
  }

  function updateItem(id: string, input: ModelCreateInput) {
    const sourceItem = items.value.find((item) => item.id === id)
    if (!sourceItem) return undefined

    const item = createModel(input, sourceItem)
    items.value = items.value.map((current) =>
      current.id === id ? item : current
    )
    return item
  }

  function duplicateItem(id: string) {
    const sourceItem = items.value.find((item) => item.id === id)
    if (!sourceItem) return undefined

    const now = formatDateTime(new Date())
    const item = {
      ...cloneModel(sourceItem),
      id: `${sourceItem.id}-copy-${Date.now().toString(36)}`,
      name: `${sourceItem.name} - 副本`,
      monthlyCalls: '—',
      avgLatency: '—',
      createdAt: now,
      updatedAt: now,
    }
    items.value = [item, ...items.value]
    currentPage.value = 1
    return item
  }

  function toggleItem(id: string) {
    items.value = items.value.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        status: item.status === 'online' ? 'offline' : 'online',
        updatedAt: formatDateTime(new Date()),
      }
    })
  }

  function resetFilters() {
    keyword.value = ''
    providerFilter.value = 'all'
    statusFilter.value = 'all'
    currentPage.value = 1
  }

  return {
    configuredCount,
    currentPage,
    filteredItems,
    items,
    keyword,
    onlineCount,
    pageSize,
    paginatedItems,
    providerCount,
    providerFilter,
    sortBy,
    statusFilter,
    createItem,
    duplicateItem,
    removeItem,
    resetFilters,
    toggleItem,
    updateItem,
  }
}

function createModel(input: ModelCreateInput, source?: ModelItem): ModelItem {
  const now = formatDateTime(new Date())
  const apiKey = input.apiKey.trim()
  const providerName =
    input.providerName.trim() || getProviderLabel(input.provider)

  return {
    id: source?.id ?? `model-${Date.now().toString(36)}`,
    kind: 'llm-model',
    provider: input.provider,
    providerName,
    name: input.name.trim(),
    modelId: input.modelId.trim(),
    description: input.description.trim(),
    protocol: input.protocol,
    endpoint: input.endpoint.trim().replace(/\/$/, ''),
    apiKeyConfigured: Boolean(apiKey) || Boolean(source?.apiKeyConfigured),
    apiKeyMasked: apiKey
      ? maskApiKey(apiKey)
      : (source?.apiKeyMasked ?? '未配置'),
    contextWindow: input.contextWindow,
    maxOutputTokens: input.maxOutputTokens,
    capabilities: [...input.capabilities],
    inputPrice: input.inputPrice,
    outputPrice: input.outputPrice,
    status: source?.status ?? 'draft',
    monthlyCalls: source?.monthlyCalls ?? '—',
    avgLatency: source?.avgLatency ?? '—',
    createdAt: source?.createdAt ?? now,
    updatedAt: now,
  }
}

function formatDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function maskApiKey(value: string) {
  const normalized = value.trim()
  if (normalized.length <= 8) return '••••••••'
  return `${normalized.slice(0, 4)}••••••••${normalized.slice(-4)}`
}

function cloneModel(item: ModelItem): ModelItem {
  return {
    ...item,
    capabilities: [...item.capabilities],
  }
}
