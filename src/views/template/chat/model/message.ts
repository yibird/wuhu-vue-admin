import type { Message } from '../components/types'

export function getMessageSummary(message: Pick<Message, 'type' | 'content'>) {
  switch (message.type) {
    case 'text':
    case 'emoji':
      return message.content
    case 'image':
      return '[图片]'
    case 'voice':
      return '[语音]'
    case 'file':
      return `[文件] ${message.content}`
    default:
      return '[消息]'
  }
}
