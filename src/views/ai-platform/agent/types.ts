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

export interface AgentSkillOption {
  value: string
  label: string
  description: string
  icon: string
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
  /**
   * 绑定的模型 id,单个 Agent 只使用一个模型
   */
  modelId: string
  /**
   * 启用的技能 id 列表
   */
  skillIds: string[]
  /**
   * 关联的知识库 id 列表
   */
  knowledgeBaseIds: string[]
  /**
   * 子 Agent id 列表,当前 Agent 可以调用它们的能力
   */
  subAgentIds: string[]
  metrics: AgentMetric[]
}

export interface AgentCreateInput {
  name: string
  description: string
  tags: string[]
  icon: string
  iconBackground: string
  modelId: string
  skillIds: string[]
  knowledgeBaseIds: string[]
  subAgentIds: string[]
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
