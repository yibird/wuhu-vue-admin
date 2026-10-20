import { apiRequest, getToken } from '@/utils'
import { REQUEST_METHOD } from '@/constants'
import { resolveLlmConfig } from './config'
import { readSseContent } from './sse'

import type { ChatCompletionRequest } from './types'

/**
 * 发起流式对话请求,返回未解析的响应字节流。
 */
export function streamChatCompletionApi(
  payload: ChatCompletionRequest,
  options: { signal?: AbortSignal } = {}
) {
  const { url, apiKey } = resolveLlmConfig()
  // 接口在鉴权白名单内,通用钩子不会写入 Authorization,
  // 因此优先用网关独立密钥,未配置时回落到应用 token
  const credential = apiKey ?? getToken()

  return apiRequest<ReadableStream<Uint8Array>>(url, {
    method: REQUEST_METHOD.POST,
    json: payload,
    responseType: 'stream',
    // 流式响应会持续很久,必须关闭全局 10s 超时
    timeout: false,
    // 流式请求中途重试会产生重复内容
    retry: 0,
    signal: options.signal,
    ...(credential
      ? { headers: { Authorization: `Bearer ${credential}` } }
      : {}),
  })
}

/**
 * 发起流式对话请求,逐个产出文本增量。
 */
export async function* streamChatCompletion(
  payload: ChatCompletionRequest,
  options: { signal?: AbortSignal } = {}
): AsyncGenerator<string, void, void> {
  const stream = await streamChatCompletionApi(payload, options)
  yield* readSseContent(stream, options.signal)
}

export { allowMockFallback, resolveLlmConfig } from './config'
export type {
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionRequest,
  LlmConfig,
} from './types'
