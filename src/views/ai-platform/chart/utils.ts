import type { AgentMessage, ChatItem } from './components/types'

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
