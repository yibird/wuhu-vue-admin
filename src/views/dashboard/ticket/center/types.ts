export type TicketStatus =
  | 'pending'
  | 'processing'
  | 'waiting'
  | 'resolved'
  | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TicketCategory =
  | 'bug'
  | 'feature'
  | 'account'
  | 'performance'
  | 'other'

export type TicketActivityType =
  | 'created'
  | 'reply'
  | 'internal-note'
  | 'status'
  | 'assignment'
  | 'priority'
  | 'resolution'

export type TicketActivityVisibility = 'public' | 'internal'

export type TicketSlaStatus = 'on-track' | 'at-risk' | 'breached'

export interface TicketActivity {
  id: string
  type: TicketActivityType
  actor: string
  content: string
  createdAt: string
  visibility?: TicketActivityVisibility
}

export interface TicketRecord {
  id: string
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  environment: string
  contact: string
  reporter: string
  assignee: string
  team: string
  createdAt: string
  updatedAt: string
  acceptedAt?: string
  firstResponseAt?: string
  resolvedAt?: string
  closedAt?: string
  slaDueAt: string
  slaStatus: TicketSlaStatus
  waitingReason?: string
  processingResult?: string
  resolutionReason?: string
  closingReason?: string
  tags: string[]
  replyCount: number
  activities: TicketActivity[]
}

export type TicketUpdate = Partial<
  Pick<
    TicketRecord,
    | 'status'
    | 'priority'
    | 'assignee'
    | 'team'
    | 'acceptedAt'
    | 'firstResponseAt'
    | 'resolvedAt'
    | 'closedAt'
    | 'slaDueAt'
    | 'slaStatus'
    | 'waitingReason'
    | 'processingResult'
    | 'resolutionReason'
    | 'closingReason'
  >
>

export interface TicketDraft {
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  environment: string
  contact: string
}

export interface TicketFilters {
  keyword: string
  status: 'all' | TicketStatus
  category: 'all' | TicketCategory
  priority: 'all' | TicketPriority
}

export interface TicketStats {
  total: number
  pending: number
  processing: number
  resolved: number
}
