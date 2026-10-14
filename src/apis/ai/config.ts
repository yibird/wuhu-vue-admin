import type { LlmConfig } from './types'

/**
 * 默认对话补全路径,经 Vite 代理转发到网关,避免跨域与密钥外泄。
 */
const DEFAULT_CHAT_URL = '/v1/ai/chat/completions'

/**
 * 默认模型标识。
 */
const DEFAULT_MODEL = 'gpt-4o-mini'

/**
 * 解析 LLM 连接配置,全部通过环境变量覆盖。
 */
export function resolveLlmConfig(): LlmConfig {
  const apiKey = import.meta.env.VITE_LLM_API_KEY?.trim()

  return {
    url: import.meta.env.VITE_LLM_API_URL?.trim() || DEFAULT_CHAT_URL,
    model: import.meta.env.VITE_LLM_MODEL?.trim() || DEFAULT_MODEL,
    ...(apiKey ? { apiKey } : {}),
  }
}

/**
 * 请求失败时是否回退到本地模拟回复,默认关闭以免掩盖真实接入故障。
 */
export function allowMockFallback() {
  return import.meta.env.VITE_AI_MOCK_FALLBACK === 'true'
}
