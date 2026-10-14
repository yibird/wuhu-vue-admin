import { streamChatCompletion } from '@/apis'

import type { ChatCompletionRequest } from '@/apis'

/**
 * 一次流式生成的目标位置。
 */
export interface StreamTarget {
  /**
   * @desc 会话标识
   */
  chatId: string
  /**
   * @desc 承载输出的消息标识
   */
  messageId: string
}

/**
 * 增量内容回调载荷。
 */
export interface StreamFlushChunk extends StreamTarget {
  /**
   * @desc 截至当前已累积的完整内容
   */
  content: string
}

/**
 * 流式生成结果。
 */
export interface StreamResult {
  /**
   * @desc 已累积的完整内容
   */
  content: string
  /**
   * @desc 是否被主动中断
   */
  aborted: boolean
  /**
   * @desc 失败原因
   */
  error?: unknown
}

/**
 * 按会话管理流式生成:token 先写入非响应式缓冲,每帧最多回传一次,
 * 避免按 token 频率整体替换消息状态导致的消息列表重渲染。
 */
export function useAgentStream(options: {
  onFlush: (chunks: StreamFlushChunk[]) => void
}) {
  /** 会话 -> 中断控制器,同一会话同时只允许一个流 */
  const controllers = new Map<string, AbortController>()
  /** 消息 -> 待发布缓冲 */
  const buffers = new Map<string, StreamFlushChunk>()
  let frame = 0

  const flush = () => {
    frame = 0
    if (!buffers.size) return

    const chunks = [...buffers.values()]
    buffers.clear()
    options.onFlush(chunks)
  }

  const scheduleFlush = () => {
    if (frame) return
    frame = requestAnimationFrame(flush)
  }

  const stop = (chatId: string) => {
    controllers.get(chatId)?.abort()
  }

  const isStreaming = (chatId: string) => controllers.has(chatId)

  /**
   * 发起一次流式生成,返回累积内容与中断状态。
   */
  async function run(params: {
    target: StreamTarget
    request: ChatCompletionRequest
  }): Promise<StreamResult> {
    const { chatId, messageId } = params.target
    stop(chatId)

    const controller = new AbortController()
    controllers.set(chatId, controller)

    const buffer: StreamFlushChunk = { chatId, messageId, content: '' }
    buffers.set(messageId, buffer)

    try {
      for await (const token of streamChatCompletion(params.request, {
        signal: controller.signal,
      })) {
        buffer.content += token
        scheduleFlush()
      }

      return { content: buffer.content, aborted: false }
    } catch (error) {
      return {
        content: buffer.content,
        aborted: controller.signal.aborted,
        error,
      }
    } finally {
      if (controllers.get(chatId) === controller) controllers.delete(chatId)
      buffers.delete(messageId)
      // 后台标签页的 rAF 会被节流,结束时必须同步落盘
      flush()
    }
  }

  onBeforeUnmount(() => {
    controllers.forEach((controller) => controller.abort())
    controllers.clear()
    buffers.clear()
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  })

  return { isStreaming, run, stop }
}
