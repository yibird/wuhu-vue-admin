export type KnowledgeBaseStatus = 'online' | 'draft' | 'offline'

export type KnowledgeBaseSort = 'created-desc' | 'updated-desc' | 'name-asc'

export type KnowledgeBaseAction =
  | 'archive'
  | 'delete'
  | 'duplicate'
  | 'edit'
  | 'open'
  | 'toggle'

export interface KnowledgeBaseCreator {
  name: string
  role: string
}

export interface KnowledgeBaseMetric {
  label: string
  value: string
  tone?: 'default' | 'primary' | 'success' | 'warning'
}

export interface KnowledgeBaseItem {
  id: string
  kind: 'knowledge-base'
  name: string
  description: string
  tags: string[]
  creator: KnowledgeBaseCreator
  createdAt: string
  updatedAt: string
  status: KnowledgeBaseStatus
  icon: string
  iconBackground: string
  metrics: KnowledgeBaseMetric[]
}

export interface KnowledgeBaseCreateInput {
  name: string
  description: string
  tags: string[]
  icon: string
  iconBackground: string
}

export interface KnowledgeBasePageConfig {
  kind: 'knowledge-base'
  title: string
  subtitle: string
  icon: string
  createText: string
  searchPlaceholder: string
  emptyText: string
  totalText: string
  activeText: string
  draftText: string
  statusLabels: Record<KnowledgeBaseStatus, string>
}
