import type { ChatCompletionChunk } from './types'

/**
 * 从一行 SSE 文本中取出 data 字段内容,非 data 行返回 null。
 * 兼容注释行(心跳)、event / id / retry 等字段行。
 */
export function extractDataPayload(line: string) {
  if (!line || line.startsWith(':')) return null
  if (!line.startsWith('data:')) return null
  return line.slice(5).replace(/^ /, '')
}

/**
 * 把 OpenAI 兼容的 SSE 字节流解码为逐段文本增量。
 * 跨 chunk 的半行会被缓冲,单行 JSON 解析失败时跳过而不中断整个流。
 */
export async function* readSseContent(
  stream: ReadableStream<Uint8Array>,
  signal?: AbortSignal
): AsyncGenerator<string, void, void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const parseLine = (rawLine: string) => {
    const payload = extractDataPayload(rawLine.replace(/\r$/, ''))
    if (payload === null) return { done: false, text: undefined }
    if (payload === '[DONE]') return { done: true, text: undefined }

    try {
      const chunk = JSON.parse(payload) as ChatCompletionChunk
      return { done: false, text: chunk.choices?.[0]?.delta?.content }
    } catch {
      return { done: false, text: undefined }
    }
  }

  try {
    while (!signal?.aborted) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      let lineBreak = buffer.indexOf('\n')
      while (lineBreak !== -1) {
        const result = parseLine(buffer.slice(0, lineBreak))
        buffer = buffer.slice(lineBreak + 1)
        if (result.done) return
        if (result.text) yield result.text
        lineBreak = buffer.indexOf('\n')
      }
    }

    // 流结束但最后一行的换行符可能缺失
    const tail = parseLine(buffer)
    if (tail.text) yield tail.text
  } finally {
    reader.releaseLock()
    if (signal?.aborted) {
      stream.cancel().catch(() => undefined)
    }
  }
}
