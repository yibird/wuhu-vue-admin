import dayjs from 'dayjs'
import { computed, reactive, shallowRef, watch } from 'vue'
import { getTicketPriorityMeta } from '../../center/data'
import { useTicketStore } from '../../center/store'
import type {
  TicketPriority,
  TicketRecord,
  TicketSlaStatus,
} from '../../center/types'
import { CURRENT_AGENT, DEFAULT_TEAM, ticketQueueMeta } from '../data'
import type {
  TicketAssignment,
  TicketManagementFilters,
  TicketManagementStats,
  TicketQueueKey,
  TicketQueueOption,
  TicketResolution,
} from '../types'

const priorityRank: Record<TicketPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function matchesQueue(ticket: TicketRecord, queue: TicketQueueKey) {
  if (queue === 'unassigned') return ticket.assignee === '待分配'
  if (queue === 'mine') return ticket.assignee === CURRENT_AGENT
  if (queue === 'overdue') {
    return (
      ticket.slaStatus === 'breached' &&
      ticket.status !== 'resolved' &&
      ticket.status !== 'closed'
    )
  }
  if (queue === 'waiting') return ticket.status === 'waiting'
  if (queue === 'resolved') return ticket.status === 'resolved'
  return true
}

function getSlaHours(priority: TicketPriority) {
  return { urgent: 4, high: 8, medium: 24, low: 72 }[priority]
}

function getSlaStatus(dueAt: string): TicketSlaStatus {
  const due = dayjs(dueAt)
  if (dayjs().isAfter(due)) return 'breached'
  return due.diff(dayjs(), 'hour', true) <= 4 ? 'at-risk' : 'on-track'
}

export function useTicketManagement() {
  const { tickets, addActivity, updateTicket } = useTicketStore()
  const queue = shallowRef<TicketQueueKey>('all')
  const selectedTicketId = shallowRef('')
  const filters = reactive<TicketManagementFilters>({
    keyword: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    team: 'all',
  })

  const queueCounts = computed<Record<TicketQueueKey, number>>(() => ({
    all: tickets.value.length,
    unassigned: tickets.value.filter((ticket) =>
      matchesQueue(ticket, 'unassigned')
    ).length,
    mine: tickets.value.filter((ticket) => matchesQueue(ticket, 'mine')).length,
    overdue: tickets.value.filter((ticket) => matchesQueue(ticket, 'overdue'))
      .length,
    waiting: tickets.value.filter((ticket) => matchesQueue(ticket, 'waiting'))
      .length,
    resolved: tickets.value.filter((ticket) => matchesQueue(ticket, 'resolved'))
      .length,
  }))

  const queueOptions = computed<TicketQueueOption[]>(() =>
    ticketQueueMeta.map((item) => ({
      ...item,
      count: queueCounts.value[item.key],
    }))
  )

  const visibleTickets = computed(() => {
    const keyword = filters.keyword.trim().toLocaleLowerCase()

    return tickets.value
      .filter((ticket) => {
        const matchesKeyword =
          !keyword ||
          [
            ticket.id,
            ticket.subject,
            ticket.reporter,
            ticket.contact,
            ticket.assignee,
            ticket.team,
          ].some((value) => value.toLocaleLowerCase().includes(keyword))
        const matchesStatus =
          filters.status === 'all' || ticket.status === filters.status
        const matchesPriority =
          filters.priority === 'all' || ticket.priority === filters.priority
        const matchesCategory =
          filters.category === 'all' || ticket.category === filters.category
        const matchesTeam =
          filters.team === 'all' || ticket.team === filters.team

        return (
          matchesQueue(ticket, queue.value) &&
          matchesKeyword &&
          matchesStatus &&
          matchesPriority &&
          matchesCategory &&
          matchesTeam
        )
      })
      .sort(
        (a, b) =>
          priorityRank[b.priority] - priorityRank[a.priority] ||
          b.updatedAt.localeCompare(a.updatedAt)
      )
  })

  const selectedTicket = computed(() =>
    tickets.value.find((ticket) => ticket.id === selectedTicketId.value)
  )

  const hasFilters = computed(
    () =>
      filters.keyword.trim() !== '' ||
      filters.status !== 'all' ||
      filters.priority !== 'all' ||
      filters.category !== 'all' ||
      filters.team !== 'all'
  )

  const stats = computed<TicketManagementStats>(() => ({
    pending: tickets.value.filter((ticket) => ticket.status === 'pending')
      .length,
    processing: tickets.value.filter((ticket) => ticket.status === 'processing')
      .length,
    unassigned: queueCounts.value.unassigned,
    breached: queueCounts.value.overdue,
  }))

  watch(
    visibleTickets,
    (items) => {
      if (items.some((item) => item.id === selectedTicketId.value)) return
      selectedTicketId.value = items[0]?.id ?? ''
    },
    { immediate: true }
  )

  function selectTicket(ticket: TicketRecord) {
    selectedTicketId.value = ticket.id
  }

  function resetFilters() {
    filters.keyword = ''
    filters.status = 'all'
    filters.priority = 'all'
    filters.category = 'all'
    filters.team = 'all'
  }

  function updateAssignment(assignment: TicketAssignment) {
    const ticket = selectedTicket.value
    if (!ticket) return

    return updateTicket(ticket.id, assignment, {
      type: 'assignment',
      actor: CURRENT_AGENT,
      content: `将工单分配给 ${assignment.team} · ${assignment.assignee}`,
      visibility: 'internal',
    })
  }

  function updatePriority(priority: TicketPriority) {
    const ticket = selectedTicket.value
    if (!ticket || ticket.priority === priority) return

    const slaDueAt = dayjs(ticket.createdAt)
      .add(getSlaHours(priority), 'hour')
      .format('YYYY-MM-DD HH:mm')
    return updateTicket(
      ticket.id,
      { priority, slaDueAt, slaStatus: getSlaStatus(slaDueAt) },
      {
        type: 'priority',
        actor: CURRENT_AGENT,
        content: `将优先级从“${getTicketPriorityMeta(ticket.priority).label}”调整为“${getTicketPriorityMeta(priority).label}”`,
        visibility: 'internal',
      }
    )
  }

  function acceptTicket() {
    const ticket = selectedTicket.value
    if (!ticket) return

    const now = dayjs().format('YYYY-MM-DD HH:mm')
    const team = ticket.team === '待分配' ? DEFAULT_TEAM : ticket.team
    const assignee =
      ticket.assignee === '待分配' ? CURRENT_AGENT : ticket.assignee
    return updateTicket(
      ticket.id,
      {
        status: 'processing',
        team,
        assignee,
        acceptedAt: ticket.acceptedAt || now,
        waitingReason: undefined,
      },
      {
        type: 'status',
        actor: CURRENT_AGENT,
        content: `受理工单并开始处理，由 ${team} · ${assignee} 负责`,
        visibility: 'public',
      }
    )
  }

  function continueTicket() {
    const ticket = selectedTicket.value
    if (!ticket) return
    return updateTicket(
      ticket.id,
      { status: 'processing', waitingReason: undefined },
      {
        type: 'status',
        actor: CURRENT_AGENT,
        content: '已收到补充信息，继续处理工单',
        visibility: 'public',
      }
    )
  }

  function setWaiting(reason: string) {
    const ticket = selectedTicket.value
    const value = reason.trim()
    if (!ticket || !value) return
    return updateTicket(
      ticket.id,
      { status: 'waiting', waitingReason: value },
      {
        type: 'status',
        actor: CURRENT_AGENT,
        content: value,
        visibility: 'public',
      }
    )
  }

  function resolveTicket(resolution: TicketResolution) {
    const ticket = selectedTicket.value
    const reason = resolution.reason.trim()
    const result = resolution.result.trim()
    if (!ticket || !reason || !result) return

    return updateTicket(
      ticket.id,
      {
        status: 'resolved',
        resolvedAt: dayjs().format('YYYY-MM-DD HH:mm'),
        waitingReason: undefined,
        resolutionReason: reason,
        processingResult: result,
      },
      {
        type: 'resolution',
        actor: CURRENT_AGENT,
        content: `${reason}：${result}`,
        visibility: 'public',
      }
    )
  }

  function closeTicket(reason: string) {
    const ticket = selectedTicket.value
    const value = reason.trim()
    if (!ticket || !value) return
    return updateTicket(
      ticket.id,
      {
        status: 'closed',
        closedAt: dayjs().format('YYYY-MM-DD HH:mm'),
        closingReason: value,
      },
      {
        type: 'status',
        actor: CURRENT_AGENT,
        content: `关闭工单：${value}`,
        visibility: 'public',
      }
    )
  }

  function reopenTicket() {
    const ticket = selectedTicket.value
    if (!ticket) return
    return updateTicket(
      ticket.id,
      {
        status: 'processing',
        resolvedAt: undefined,
        closedAt: undefined,
        resolutionReason: undefined,
        closingReason: undefined,
      },
      {
        type: 'status',
        actor: CURRENT_AGENT,
        content: '重新打开工单并继续处理',
        visibility: 'public',
      }
    )
  }

  function addPublicReply(content: string) {
    const ticket = selectedTicket.value
    const value = content.trim()
    if (!ticket || !value) return
    return addActivity(
      ticket.id,
      {
        type: 'reply',
        actor: CURRENT_AGENT,
        content: value,
        visibility: 'public',
      },
      { countAsReply: true }
    )
  }

  function addInternalNote(content: string) {
    const ticket = selectedTicket.value
    const value = content.trim()
    if (!ticket || !value) return
    return addActivity(ticket.id, {
      type: 'internal-note',
      actor: CURRENT_AGENT,
      content: value,
      visibility: 'internal',
    })
  }

  return {
    currentAgent: CURRENT_AGENT,
    filters,
    hasFilters,
    queue,
    queueOptions,
    selectedTicket,
    selectedTicketId,
    stats,
    tickets,
    visibleTickets,
    acceptTicket,
    addInternalNote,
    addPublicReply,
    closeTicket,
    continueTicket,
    reopenTicket,
    resetFilters,
    resolveTicket,
    selectTicket,
    setWaiting,
    updateAssignment,
    updatePriority,
  }
}
