export type KnowledgeDetailSectionKey =
  | 'documents'
  | 'chunks'
  | 'recall'
  | 'annotations'
  | 'glossary'
  | 'hitStats'
  | 'retrievalLogs'
  | 'settings'

export interface KnowledgeNavItem {
  key: KnowledgeDetailSectionKey
  title: string
  description: string
  icon: string
  badge?: string
}

export interface KnowledgeMetric {
  label: string
  value: string
  helper: string
  tone?: 'default' | 'primary' | 'success' | 'warning'
}

export interface KnowledgeWorkItem {
  title: string
  description: string
  meta: string
  status: string
  icon: string
  tone?: 'default' | 'primary' | 'success' | 'warning'
}

export interface KnowledgeInsightItem {
  label: string
  value: string
  description: string
}

export interface KnowledgeSectionWorkspace {
  key: KnowledgeDetailSectionKey
  title: string
  subtitle: string
  icon: string
  primaryAction: string
  secondaryAction?: string
  metrics: KnowledgeMetric[]
  items: KnowledgeWorkItem[]
  insightTitle: string
  insights: KnowledgeInsightItem[]
}
