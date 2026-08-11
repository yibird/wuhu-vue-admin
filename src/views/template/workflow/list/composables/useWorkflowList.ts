import { computed, shallowRef, watch } from 'vue'
import { initialWorkflowDefinitions } from '../../management/data'
import type {
  WorkflowDefinition,
  WorkflowDefinitionStatus,
} from '../../management/types'

export type WorkflowListStatusFilter = WorkflowDefinitionStatus | 'all'
export type WorkflowListSort = 'created-desc' | 'runs-desc' | 'updated-desc'

export function useWorkflowList() {
  const workflows = shallowRef<WorkflowDefinition[]>(
    initialWorkflowDefinitions.map((item) => ({ ...item }))
  )
  const keyword = shallowRef('')
  const statusFilter = shallowRef<WorkflowListStatusFilter>('all')
  const ownerFilter = shallowRef('all')
  const sortBy = shallowRef<WorkflowListSort>('updated-desc')
  const currentPage = shallowRef(1)
  const pageSize = shallowRef(12)

  const owners = computed(() => {
    const result = new Map<string, string>()
    workflows.value.forEach((item) =>
      result.set(item.owner.id, item.owner.name)
    )
    return [...result].map(([value, label]) => ({ label, value }))
  })

  const filteredWorkflows = computed(() => {
    const text = keyword.value.trim().toLowerCase()
    const result = workflows.value.filter((item) => {
      const matchesKeyword =
        !text ||
        [item.name, item.description, item.category, item.owner.name].some(
          (value) => value.toLowerCase().includes(text)
        )
      const matchesStatus =
        statusFilter.value === 'all' || item.status === statusFilter.value
      const matchesOwner =
        ownerFilter.value === 'all' || item.owner.id === ownerFilter.value
      return matchesKeyword && matchesStatus && matchesOwner
    })

    return [...result].sort((a, b) => {
      if (sortBy.value === 'runs-desc') return b.runCount - a.runCount
      if (sortBy.value === 'created-desc') {
        return b.createdAt.localeCompare(a.createdAt)
      }
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredWorkflows.value.length / pageSize.value))
  )
  const paginatedWorkflows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredWorkflows.value.slice(start, start + pageSize.value)
  })
  const publishedCount = computed(
    () => workflows.value.filter((item) => item.status === 'published').length
  )
  const draftCount = computed(
    () => workflows.value.filter((item) => item.status === 'draft').length
  )

  watch([keyword, statusFilter, ownerFilter, sortBy], () => {
    currentPage.value = 1
  })
  watch(totalPages, (total) => {
    if (currentPage.value > total) currentPage.value = total
  })

  function removeWorkflow(id: string) {
    workflows.value = workflows.value.filter((item) => item.id !== id)
  }

  function duplicateWorkflow(id: string) {
    const source = workflows.value.find((item) => item.id === id)
    if (!source) return
    const now = '2026-08-04 10:30'
    workflows.value = [
      {
        ...source,
        id: `${source.id}-copy-${Date.now().toString(36)}`,
        name: `${source.name} - 副本`,
        status: 'draft',
        version: 'v0.1.0',
        runCount: 0,
        successRate: 0,
        createdAt: now,
        updatedAt: now,
        lastRunAt: undefined,
      },
      ...workflows.value,
    ]
    currentPage.value = 1
  }

  function toggleWorkflow(id: string) {
    workflows.value = workflows.value.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        status: item.status === 'disabled' ? 'published' : 'disabled',
      }
    })
  }

  return {
    currentPage,
    draftCount,
    filteredWorkflows,
    keyword,
    ownerFilter,
    owners,
    pageSize,
    paginatedWorkflows,
    publishedCount,
    sortBy,
    statusFilter,
    workflows,
    duplicateWorkflow,
    removeWorkflow,
    toggleWorkflow,
  }
}
