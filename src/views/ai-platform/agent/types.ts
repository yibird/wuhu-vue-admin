export type AgentStatus = 'online' | 'draft' | 'offline'

export type AgentSort = 'created-desc' | 'updated-desc' | 'name-asc'

export type AgentAction =
  | 'archive'
  | 'delete'
  | 'duplicate'
  | 'edit'
  | 'open'
  | 'toggle'

export interface AgentCreator {
  name: string
  role: string
}

export interface AgentMetric {
  label: string
  value: string
  tone?: 'default' | 'primary' | 'success' | 'warning'
}

export interface AgentItem {
  id: string
  kind: 'agent'
  name: string
  description: string
  tags: string[]
  creator: AgentCreator
  createdAt: string
  updatedAt: string
  status: AgentStatus
  icon: string
  iconBackground: string
  metrics: AgentMetric[]
}

export interface AgentCreateInput {
  name: string
  description: string
  tags: string[]
  icon: string
  iconBackground: string
}

export interface AgentPageConfig {
  kind: 'agent'
  title: string
  subtitle: string
  icon: string
  createText: string
  searchPlaceholder: string
  emptyText: string
  totalText: string
  activeText: string
  draftText: string
  statusLabels: Record<AgentStatus, string>
}
