import type { Ref } from 'vue'
import type { ChatSettings, Conversation, Message } from '../components/types'
import { useManagedTimeout } from './useManagedTimeout'

interface UseChatSimulationOptions {
  activeConversationId: Readonly<Ref<string>>
  chatSettings: Readonly<Ref<ChatSettings>>
  conversations: Ref<Conversation[]>
  messagesByConversation: Ref<Record<string, Message[]>>
  typingConversations: Ref<Set<string>>
  onIncomingMessage?: () => void
}

/**
 * 管理聊天演示中的异步状态变化。
 * 定时器使用稳定 key，删除会话或组件卸载时可以精确取消，避免迟到回调重新写入旧数据。
 */
export function useChatSimulation(options: UseChatSimulationOptions) {
  const { cancel, schedule } = useManagedTimeout()

  function markMessageSent(message: Message) {
    schedule(
      () => {
        message.status = 'sent'
      },
      260,
      `message-status:${message.id}`
    )
  }

  function retryMessage(message: Message, onSuccess: () => void) {
    message.status = 'sending'
    schedule(
      () => {
        message.status = 'sent'
        onSuccess()
      },
      300,
      `message-status:${message.id}`
    )
  }

  function cancelMessage(messageId: string) {
    cancel(`message-status:${messageId}`)
  }

  function cancelConversation(conversationId: string) {
    cancel(`auto-reply:${conversationId}`)
    options.typingConversations.value.delete(conversationId)
  }

  function simulateAutoReply(conversation: Conversation) {
    if (
      conversation.type !== 'private' ||
      conversation.muted ||
      options.chatSettings.value.dnd
    ) {
      return
    }

    const conversationId = conversation.id
    options.typingConversations.value.add(conversationId)
    schedule(
      () => {
        options.typingConversations.value.delete(conversationId)

        const currentConversation = options.conversations.value.find(
          (item) => item.id === conversationId
        )
        if (!currentConversation) return

        if (options.activeConversationId.value !== conversationId) {
          currentConversation.unreadCount += 1
        }

        const reply: Message = {
          id: `reply-${Date.now()}`,
          conversationId,
          type: 'text',
          content: '收到，我看一下后同步给你。',
          senderId: currentConversation.userInfo?.id ?? conversationId,
          senderInfo: currentConversation.userInfo,
          timestamp: new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'read',
        }

        options.messagesByConversation.value[conversationId] ??= []
        options.messagesByConversation.value[conversationId].push(reply)
        currentConversation.lastMessage = reply.content
        currentConversation.lastMessageTime = reply.timestamp
        if (options.chatSettings.value.messageSound) {
          options.onIncomingMessage?.()
        }
      },
      900,
      `auto-reply:${conversationId}`
    )
  }

  return {
    cancelConversation,
    cancelMessage,
    markMessageSent,
    retryMessage,
    simulateAutoReply,
  }
}
