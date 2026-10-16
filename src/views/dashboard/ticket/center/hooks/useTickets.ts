import dayjs from 'dayjs'
import { computed, reactive, shallowRef, watch } from 'vue'
import { CURRENT_REQUESTER, getTicketStatusMeta } from '../data'
import { useTicketStore } from '../store'
import { matchesFilters, matchesKeyword } from '../utils'
import type {
  TicketDraft,
  TicketFilters,
  TicketRecord,
  TicketStats,
  TicketStatus,
} from '../types'

export function useTickets() {
  const {
    tickets,
    addActivity,
    createTicket: createStoredTicket,
    updateTicket,
  } = useTicketStore()
  const createDrawerOpen = shallowRef(false)
  const detailDrawerOpen = shallowRef(false)
  const selectedTicketId = shallowRef('')
  const currentPage = shallowRef(1)
  const pageSize = shallowRef(8)
  const filters = reactive<TicketFilters>({
    keyword: '',
    status: 'all',
    category: 'all',
    priority: 'all',
  })

  const filteredTickets = computed(() => {
    const keyword = filters.keyword.trim().toLocaleLowerCase()

    return tickets.value
      .filter((ticket) => {
        const matchKeyword = matchesKeyword(ticket, keyword, [
          'id',
          'subject',
          'description',
          'reporter',
          'assignee',
        ])

        return matchKeyword && matchesFilters(ticket, filters)
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  })

  const selectedTicket = computed(() =>
    tickets.value.find((ticket) => ticket.id === selectedTicketId.value)
  )

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredTickets.value.length / pageSize.value))
  )

  const paginatedTickets = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredTickets.value.slice(start, start + pageSize.value)
  })

  const hasFilters = computed(
    () =>
      filters.keyword.trim() !== '' ||
      filters.status !== 'all' ||
      filters.category !== 'all' ||
      filters.priority !== 'all'
  )

  const stats = computed<TicketStats>(() => ({
    total: tickets.value.length,
    pending: tickets.value.filter((ticket) => ticket.status === 'pending')
      .length,
    processing: tickets.value.filter(
      (ticket) => ticket.status === 'processing' || ticket.status === 'waiting'
    ).length,
    resolved: tickets.value.filter(
      (ticket) => ticket.status === 'resolved' || ticket.status === 'closed'
    ).length,
  }))

  watch(
    () => [filters.keyword, filters.status, filters.category, filters.priority],
    () => {
      currentPage.value = 1
    }
  )

  watch(totalPages, (total) => {
    if (currentPage.value > total) currentPage.value = total
  })

  function resetFilters() {
    filters.keyword = ''
    filters.status = 'all'
    filters.category = 'all'
    filters.priority = 'all'
  }

  function openCreateDrawer() {
    createDrawerOpen.value = true
  }

  function openTicket(ticket: TicketRecord) {
    selectedTicketId.value = ticket.id
    detailDrawerOpen.value = true
  }

  function createTicket(draft: TicketDraft) {
    const ticket = createStoredTicket(draft)
    createDrawerOpen.value = false
    currentPage.value = 1
    selectedTicketId.value = ticket.id
    detailDrawerOpen.value = true
    return ticket
  }

  function updateStatus(id: string, status: TicketStatus) {
    const statusMeta = getTicketStatusMeta(status)
    const current = tickets.value.find((ticket) => ticket.id === id)
    if (!current || current.status === status) return

    let closedAt = current.closedAt
    let closingReason = current.closingReason
    if (status === 'closed') {
      closedAt = dayjs().format('YYYY-MM-DD HH:mm')
      closingReason = '提交人确认问题已解决'
    } else if (status === 'pending') {
      // 重新回到待受理时清空关闭信息
      closedAt = undefined
      closingReason = undefined
    }

    return updateTicket(
      id,
      { status, closedAt, closingReason },
      {
        type: 'status',
        actor: CURRENT_REQUESTER,
        content: `将工单状态更新为“${statusMeta.label}”`,
        visibility: 'public',
      }
    )
  }

  function addReply(id: string, content: string) {
    const reply = content.trim()
    if (!reply) return

    return addActivity(
      id,
      {
        type: 'reply',
        actor: CURRENT_REQUESTER,
        content: reply,
        visibility: 'public',
      },
      { countAsReply: true }
    )
  }

  return {
    createDrawerOpen,
    currentPage,
    detailDrawerOpen,
    filteredTickets,
    filters,
    hasFilters,
    selectedTicket,
    stats,
    tickets,
    addReply,
    createTicket,
    openCreateDrawer,
    openTicket,
    pageSize,
    paginatedTickets,
    resetFilters,
    updateStatus,
  }
}
