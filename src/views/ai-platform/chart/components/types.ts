export type AgentStatus = 'ready' | 'running' | 'paused'

export type AgentMessageRole = 'assistant' | 'system' | 'user'

export type AgentMessageFeedback = 'like' | 'dislike'

export interface AgentModel {
  id: string
  name: string
  type: 'CHAT' | 'REASON'
  desc: string
  context?: string
  speed?: string
}

export interface AgentTool {
  key: string
  label: string
  icon: string
  enabled: boolean
  desc?: string
}

export interface AgentAttachment {
  id: string
  name: string
  size: number
  type: string
}

export interface AgentPreset {
  id: string
  title: string
  desc: string
  icon: string
  prompt: string
}

export interface AgentGenerationConfig {
  temperature: number
  topP: number
  maxTokens: number
}

export interface AgentMessage {
  id: string
  role: AgentMessageRole
  content: string
  createTime: string
  model?: string
  status?: 'done' | 'thinking'
  attachments?: AgentAttachment[]
  tools?: string[]
  feedback?: AgentMessageFeedback
  regenerated?: boolean
}

export interface ChatItem {
  id: string
  title: string
  createTime: string
  updateTime?: string
  description?: string
  tag?: string
  status?: AgentStatus
  messages?: number
  pinned?: boolean
  archived?: boolean
}

export interface ListProps {
  items?: ChatItem[]
  activeId?: string
  collapsed?: boolean
  emptyText?: string
  emptyHint?: string
}

export interface ListEmits {
  (e: 'change', id: string): void
  (e: 'archive', id: string): void
  (e: 'delete', id: string): void
  (e: 'pin', id: string): void
  (e: 'rename', id: string): void
}

export interface SiderProps {
  items?: ChatItem[]
  activeId?: string
}

export interface SiderEmits extends ListEmits {
  (e: 'create'): void
}

export interface MainProps {
  attachments?: AgentAttachment[]
  chat?: ChatItem
  config?: AgentGenerationConfig
  messages?: AgentMessage[]
  model?: AgentModel
  models?: AgentModel[]
  presets?: AgentPreset[]
  tools?: AgentTool[]
}

export interface MainEmits {
  (e: 'add-attachments', files: File[]): void
  (e: 'clear-messages'): void
  (e: 'continue-generation'): void
  (e: 'copy-code', code: string): void
  (e: 'copy-share'): void
  (e: 'copy-message', message: AgentMessage): void
  (e: 'delete-message', message: AgentMessage): void
  (e: 'edit-message', id: string, content: string): void
  (e: 'feedback-message', id: string, feedback: AgentMessageFeedback): void
  (e: 'optimize-prompt', prompt: string): void
  (e: 'regenerate', message: AgentMessage): void
  (e: 'remove-attachment', id: string): void
  (e: 'select-model', id: string): void
  (e: 'send', prompt: string): void
  (e: 'share-message', message: AgentMessage): void
  (e: 'stop'): void
  (e: 'toggle-tool', key: string, enabled: boolean): void
  (e: 'update-config', config: Partial<AgentGenerationConfig>): void
}
