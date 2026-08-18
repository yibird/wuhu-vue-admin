export type ModelStatus = 'online' | 'draft' | 'offline'

export type ModelSort = 'updated-desc' | 'created-desc' | 'name-asc'

export type ModelProvider =
  | 'openai'
  | 'anthropic'
  | 'zhipu'
  | 'moonshot'
  | 'deepseek'
  | 'google'
  | 'qwen'
  | 'custom'

export type ModelProtocol =
  | 'openai-compatible'
  | 'anthropic'
  | 'google-generative-ai'

export type ModelCapability =
  | 'chat'
  | 'vision'
  | 'function-call'
  | 'json'
  | 'reasoning'

export type ModelAction = 'delete' | 'duplicate' | 'edit' | 'test' | 'toggle'

export interface ModelProviderOption {
  value: ModelProvider
  label: string
  icon: string
  accent: string
  softBackground: string
  protocol: ModelProtocol
  endpoint: string
}

export interface ModelItem {
  id: string
  kind: 'llm-model'
  provider: ModelProvider
  providerName: string
  name: string
  modelId: string
  description: string
  protocol: ModelProtocol
  endpoint: string
  contextWindow: number
  maxOutputTokens: number
  capabilities: ModelCapability[]
  inputPrice: number
  outputPrice: number
  status: ModelStatus
  apiKeyConfigured: boolean
  apiKeyMasked: string
  monthlyCalls: string
  avgLatency: string
  createdAt: string
  updatedAt: string
}

export interface ModelCreateInput {
  provider: ModelProvider
  providerName: string
  name: string
  modelId: string
  description: string
  protocol: ModelProtocol
  endpoint: string
  apiKey: string
  contextWindow: number
  maxOutputTokens: number
  capabilities: ModelCapability[]
  inputPrice: number
  outputPrice: number
}

export interface ModelPageConfig {
  title: string
  subtitle: string
  icon: string
  createText: string
  searchPlaceholder: string
  emptyText: string
  totalText: string
  activeText: string
  configuredText: string
  statusLabels: Record<ModelStatus, string>
}
