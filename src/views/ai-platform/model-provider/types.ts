export type ProviderProtocol =
  | 'openai-compatible'
  | 'anthropic'
  | 'google-generative-ai'

export interface ProviderItem {
  id: string
  name: string
  protocol: ProviderProtocol
  endpoint: string
  /**
   * 已掩码的 API Key,仅用于列表展示
   */
  apiKeyMasked: string
  description: string
  createdAt: string
}

export interface ProviderQuery {
  current: number
  pageSize: number
  keyword?: string
  protocol?: ProviderProtocol
}

export interface ProviderCreateInput {
  name: string
  protocol: ProviderProtocol
  endpoint: string
  apiKey: string
  description: string
}
