import dayjs from 'dayjs'
import { computed, reactive, shallowRef } from 'vue'
import { getTicketStatusMeta } from '../data'
import { useTicketStore } from '../store'
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
        const matchesKeyword =
          !keyword ||
          [
            ticket.id,
            ticket.subject,
            ticket.description,
            ticket.reporter,
            ticket.assignee,
          ].some((value) => value.toLocaleLowerCase().includes(keyword))
        const matchesStatus =
          filters.status === 'all' || ticket.status === filters.status
        const matchesCategory =
          filters.category === 'all' || ticket.category === filters.category
        const matchesPriority =
          filters.priority === 'all' || ticket.priority === filters.priority

        return (
          matchesKeyword && matchesStatus && matchesCategory && matchesPriority
        )
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  })

  const selectedTicket = computed(() =>
    tickets.value.find((ticket) => ticket.id === selectedTicketId.value)
  )

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
    selectedTicketId.value = ticket.id
    detailDrawerOpen.value = true
    return ticket
  }

  function updateStatus(id: string, status: TicketStatus) {
    const statusMeta = getTicketStatusMeta(status)
    const current = tickets.value.find((ticket) => ticket.id === id)
    if (!current || current.status === status) return

    return updateTicket(
      id,
      {
        status,
        closedAt:
          status === 'closed'
            ? dayjs().format('YYYY-MM-DD HH:mm')
            : status === 'pending'
              ? undefined
              : current.closedAt,
        closingReason:
          status === 'closed'
            ? '提交人确认问题已解决'
            : status === 'pending'
              ? undefined
              : current.closingReason,
      },
      {
        type: 'status',
        actor: '当前用户',
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
        actor: '当前用户',
        content: reply,
        visibility: 'public',
      },
      { countAsReply: true }
    )
  }

  return {
    createDrawerOpen,
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
    resetFilters,
    updateStatus,
  }
}
