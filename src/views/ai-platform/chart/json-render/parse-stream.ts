import { RENDER_FENCE } from './fence'

/**
 * 消息片段。
 */
export interface MessageSegment {
  /**
   * @desc 片段类型,view 表示生成式 UI 围栏
   */
  type: 'code' | 'text' | 'view'
  /**
   * @desc 片段内容,代码片段为代码本身,view 片段为围栏内的 JSON 文本
   */
  content: string
  /**
   * @desc 代码片段语言标识
   */
  lang?: string
  /**
   * @desc view 片段是否仍在流式输出(围栏尚未闭合)
   */
  pending?: boolean
}

/**
 * 把消息文本切成 文本 / 代码 / 生成式 UI 三类片段。
 * 先按视图围栏切分:围栏允许尚未闭合,此时产出 pending 片段供骨架占位,
 * 因此解析过程不会因 JSON 不完整而失败;其余文本再按普通代码块切分。
 */
export function parseMessageContent(content: string): MessageSegment[] {
  const viewPattern = new RegExp(`\`\`\`${RENDER_FENCE}[^\\n]*\\n`, 'g')
  const segments: MessageSegment[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  const pushText = (text: string) => {
    segments.push(...parseCodeBlocks(text))
  }

  while ((match = viewPattern.exec(content))) {
    pushText(content.slice(cursor, match.index))

    const bodyStart = match.index + match[0].length
    const bodyEnd = content.indexOf('```', bodyStart)

    if (bodyEnd === -1) {
      segments.push({
        type: 'view',
        content: content.slice(bodyStart).trimEnd(),
        pending: true,
      })
      return finalize(segments, content)
    }

    segments.push({
      type: 'view',
      content: content.slice(bodyStart, bodyEnd).trim(),
    })
    cursor = bodyEnd + 3
    viewPattern.lastIndex = cursor
  }

  pushText(content.slice(cursor))
  return finalize(segments, content)
}

function parseCodeBlocks(text: string): MessageSegment[] {
  const segments: MessageSegment[] = []
  const codePattern = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  const pushText = (value: string) => {
    if (value.trim()) segments.push({ type: 'text', content: value.trim() })
  }

  while ((match = codePattern.exec(text))) {
    const [raw, lang = '', code = ''] = match
    pushText(text.slice(lastIndex, match.index))
    segments.push({ type: 'code', lang, content: code.trimEnd() })
    lastIndex = match.index + raw.length
  }

  pushText(text.slice(lastIndex))
  return segments
}

function finalize(segments: MessageSegment[], content: string) {
  return segments.length ? segments : [{ type: 'text' as const, content }]
}
