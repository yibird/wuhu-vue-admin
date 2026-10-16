import dayjs from 'dayjs'
import { defineStore, storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import {
  CURRENT_REQUESTER,
  SLA_AT_RISK_HOURS,
  UNASSIGNED,
  createInitialTickets,
  getSlaHours,
} from './data'
import type {
  TicketActivity,
  TicketActivityType,
  TicketActivityVisibility,
  TicketDraft,
  TicketRecord,
  TicketSlaStatus,
  TicketUpdate,
} from './types'

const STORAGE_KEY = 'wuhu-admin:dashboard:tickets'

interface ActivityInput {
  type: TicketActivityType
  actor: string
  content: string
  visibility?: TicketActivityVisibility
}

function calculateSlaStatus(ticket: TicketRecord): TicketSlaStatus {
  const dueAt = dayjs(ticket.slaDueAt)
  const completedAt = ticket.closedAt || ticket.resolvedAt
  if (completedAt) {
    return dayjs(completedAt).isAfter(dueAt) ? 'breached' : 'on-track'
  }
  if (dayjs().isAfter(dueAt)) return 'breached'
  if (dueAt.diff(dayjs(), 'hour', true) <= SLA_AT_RISK_HOURS) return 'at-risk'
  return 'on-track'
}

function normalizeTicket(ticket: TicketRecord): TicketRecord {
  const assignee = ticket.assignee || UNASSIGNED
  const team = ticket.team ?? (assignee === UNASSIGNED ? UNASSIGNED : assignee)
  const slaDueAt =
    ticket.slaDueAt ??
    dayjs(ticket.createdAt)
      .add(getSlaHours(ticket.priority), 'hour')
      .format('YYYY-MM-DD HH:mm')
  const normalized = {
    ...ticket,
    assignee,
    team,
    slaDueAt,
    slaStatus: ticket.slaStatus ?? 'on-track',
    tags: ticket.tags ?? [],
    activities: (ticket.activities ?? []).map((activity) => ({
      ...activity,
      visibility:
        activity.visibility ??
        (activity.type === 'internal-note' ? 'internal' : 'public'),
    })),
  }

  return { ...normalized, slaStatus: calculateSlaStatus(normalized) }
}

function readStoredTickets() {
  const initialTickets = () => createInitialTickets().map(normalizeTicket)
  if (typeof window === 'undefined') return initialTickets()

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialTickets()

    const parsed = JSON.parse(stored) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initialTickets()
    }
    return (parsed as TicketRecord[]).map(normalizeTicket)
  } catch {
    return initialTickets()
  }
}

function writeStoredTickets(tickets: TicketRecord[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // In-memory state remains usable when browser storage is unavailable.
  }
}

function createActivity(id: string, input: ActivityInput): TicketActivity {
  return {
    id: `${id}-${input.type}-${Date.now()}`,
    ...input,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
  }
}

export const ticketStore = defineStore('dashboardTicket', () => {
  const tickets = shallowRef<TicketRecord[]>(readStoredTickets())

  function persist(nextTickets: TicketRecord[]) {
    tickets.value = nextTickets
    writeStoredTickets(nextTickets)
  }

  function createTicket(draft: TicketDraft) {
    const now = dayjs().format('YYYY-MM-DD HH:mm')
    const id = `TK-${dayjs().format('YYYYMMDD')}-${String(Date.now()).slice(-4)}`
    const ticket: TicketRecord = {
      ...draft,
      id,
      status: 'pending',
      reporter: CURRENT_REQUESTER,
      assignee: UNASSIGNED,
      team: UNASSIGNED,
      createdAt: now,
      updatedAt: now,
      slaDueAt: dayjs()
        .add(getSlaHours(draft.priority), 'hour')
        .format('YYYY-MM-DD HH:mm'),
      slaStatus: draft.priority === 'urgent' ? 'at-risk' : 'on-track',
      tags: [],
      replyCount: 0,
      activities: [
        {
          id: `${id}-created`,
          type: 'created',
          actor: CURRENT_REQUESTER,
          content: '提交了工单',
          createdAt: now,
          visibility: 'public',
        },
      ],
    }

    persist([ticket, ...tickets.value])
    return ticket
  }

  function updateTicket(
    id: string,
    changes: TicketUpdate,
    activity?: ActivityInput
  ) {
    const now = dayjs().format('YYYY-MM-DD HH:mm')
    let updatedTicket: TicketRecord | undefined

    persist(
      tickets.value.map((ticket) => {
        if (ticket.id !== id) return ticket
        updatedTicket = {
          ...ticket,
          ...changes,
          updatedAt: now,
          activities: activity
            ? [...ticket.activities, createActivity(ticket.id, activity)]
            : ticket.activities,
        }
        return updatedTicket
      })
    )

    return updatedTicket
  }

  function addActivity(
    id: string,
    input: ActivityInput,
    options: { countAsReply?: boolean } = {}
  ) {
    const now = dayjs().format('YYYY-MM-DD HH:mm')
    let updatedTicket: TicketRecord | undefined

    persist(
      tickets.value.map((ticket) => {
        if (ticket.id !== id) return ticket
        updatedTicket = {
          ...ticket,
          updatedAt: now,
          replyCount: options.countAsReply
            ? ticket.replyCount + 1
            : ticket.replyCount,
          firstResponseAt:
            input.type === 'reply' && input.actor !== ticket.reporter
              ? ticket.firstResponseAt || now
              : ticket.firstResponseAt,
          activities: [...ticket.activities, createActivity(ticket.id, input)],
        }
        return updatedTicket
      })
    )

    return updatedTicket
  }

  return {
    tickets,
    addActivity,
    createTicket,
    updateTicket,
  }
})

export const useTicketStore = () => {
  const store = ticketStore()
  return { ...store, ...storeToRefs(store) }
}
