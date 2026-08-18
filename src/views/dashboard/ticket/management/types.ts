import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../center/types'

export type TicketQueueKey =
  | 'all'
  | 'unassigned'
  | 'mine'
  | 'overdue'
  | 'waiting'
  | 'resolved'

export interface TicketManagementFilters {
  keyword: string
  status: 'all' | TicketStatus
  priority: 'all' | TicketPriority
  category: 'all' | TicketCategory
  team: 'all' | string
}

export interface TicketQueueOption {
  key: TicketQueueKey
  label: string
  icon: string
  count: number
}

export interface TicketAssignment {
  team: string
  assignee: string
}

export interface TicketResolution {
  reason: string
  result: string
}

export interface TicketManagementStats {
  pending: number
  processing: number
  unassigned: number
  breached: number
}
