import type {
  AgentMessage,
  ChatItem,
  SharePayload,
  SharePlatformKey,
} from './components/types'

/**
 * 生成平台的网页分享地址，返回 null 表示该平台没有可用的网页入口(如微信)
 * @param key 平台标识
 * @param payload 分享内容
 */
export function buildShareUrl(
  key: SharePlatformKey,
  payload: SharePayload
): string | null {
  const url = encodeURIComponent(payload.url)
  const title = encodeURIComponent(payload.title)
  const text = encodeURIComponent(payload.text)

  switch (key) {
    case 'qq':
      return `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&desc=${text}`
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    case 'telegram':
      return `https://t.me/share/url?url=${url}&text=${text}`
    default:
      return null
  }
}

export function formatMessageTime(): string {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function formatFileSize(size: number): string {
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

export function createMessage(
  role: AgentMessage['role'],
  content: string,
  createTime = formatMessageTime(),
  options: Partial<AgentMessage> = {}
): AgentMessage {
  return {
    id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createTime,
    status: 'done',
    ...options,
  }
}

export function createChat(): ChatItem {
  const id = `chat-${Date.now().toString(36)}`
  return {
    id,
    title: '新的 Agent 会话',
    description: '选择模型和工具后开始处理任务。',
    createTime: '刚刚',
    updateTime: '刚刚',
    tag: '新建',
    status: 'ready',
    messages: 0,
  }
}
