import { computed, shallowRef, type Ref } from 'vue'
import { Modal } from 'antdv-next'
import { getMessageSummary } from '../model/message'
import { useChatSimulation } from './useChatSimulation'
import type {
  ChatSendPayload,
  ChatSettings,
  Conversation,
  Message,
} from '../components/types'

interface UseChatMessagesOptions {
  activeConversation: Readonly<Ref<Conversation | undefined>>
  activeConversationId: Readonly<Ref<string>>
  chatSettings: Readonly<Ref<ChatSettings>>
  conversations: Ref<Conversation[]>
  messagesByConversation: Ref<Record<string, Message[]>>
  typingConversations: Ref<Set<string>>
  onIncomingMessage?: () => void
}

/** 管理消息发送、编辑、收藏、删除和模拟状态变化。 */
export function useChatMessages(options: UseChatMessagesOptions) {
  const favoriteMessageIds = shallowRef<string[]>([])
  const activeMessages = computed(() => {
    if (!options.activeConversationId.value) return []
    return (
      options.messagesByConversation.value[
        options.activeConversationId.value
      ] ?? []
    )
  })
  const {
    cancelConversation,
    cancelMessage,
    markMessageSent,
    retryMessage,
    simulateAutoReply,
  } = useChatSimulation({
    activeConversationId: options.activeConversationId,
    chatSettings: options.chatSettings,
    conversations: options.conversations,
    messagesByConversation: options.messagesByConversation,
    typingConversations: options.typingConversations,
    onIncomingMessage: options.onIncomingMessage,
  })

  function promoteConversation(conversation: Conversation) {
    if (conversation.pinned) return
    const index = options.conversations.value.findIndex(
      (item) => item.id === conversation.id
    )
    if (index < 0) return
    const [current] = options.conversations.value.splice(index, 1)
    const pinnedCount = options.conversations.value.filter(
      (item) => item.pinned
    ).length
    options.conversations.value.splice(pinnedCount, 0, current)
  }

  function refreshConversationSummary(conversationId: string) {
    const conversation = options.conversations.value.find(
      (item) => item.id === conversationId
    )
    if (!conversation) return
    const list = options.messagesByConversation.value[conversationId] ?? []
    const last = list.at(-1)
    conversation.lastMessage = last ? getMessageSummary(last) : '暂无消息'
    conversation.lastMessageTime = last?.timestamp ?? ''
  }

  function handleMessageSend(payload: ChatSendPayload) {
    const conversation = options.activeConversation.value
    if (!conversation) return
    if (payload.editId) {
      updateMessage(payload)
      return
    }

    const conversationId = conversation.id
    const message: Message = {
      id: `${Date.now()}`,
      conversationId,
      type: payload.type,
      content: payload.content,
      senderId: 'me',
      senderInfo: {
        id: 'me',
        name: '我',
        avatar: 'https://i.pravatar.cc/100?img=10',
      },
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
      replyTo: payload.replyTo,
      replyInfo: payload.replyInfo,
    }

    options.messagesByConversation.value[conversationId] ??= []
    options.messagesByConversation.value[conversationId].push(message)
    conversation.lastMessage =
      payload.type === 'text' ? payload.content : getMessageSummary(message)
    conversation.lastMessageTime = message.timestamp

    promoteConversation(conversation)
    markMessageSent(message)
    simulateAutoReply(conversation)
  }

  function updateMessage(payload: ChatSendPayload) {
    const conversationId = options.activeConversationId.value
    if (!conversationId || !payload.editId) return

    const list = options.messagesByConversation.value[conversationId] ?? []
    const target = list.find((item) => item.id === payload.editId)
    if (!target) return

    const wasLastMessage = list.at(-1)?.id === target.id
    target.content = payload.content
    target.editedAt = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    if (wasLastMessage) refreshConversationSummary(conversationId)
    messageToast.success('消息已更新')
  }

  function handleMessageRetry(target: Message) {
    retryMessage(target, () => messageToast.success('已重新发送'))
  }

  function handleMessageRecall(target: Message) {
    Modal.confirm({
      title: '撤回消息',
      content: '确定撤回这条消息吗？',
      okText: '撤回',
      cancelText: '取消',
      onOk: () => {
        cancelMessage(target.id)
        target.type = 'text'
        target.content = '你撤回了一条消息'
        target.status = 'read'
        target.reactions = []
        target.editedAt = undefined
        refreshConversationSummary(target.conversationId)
      },
    })
  }

  function handleMessageDelete(target: Message) {
    Modal.confirm({
      title: '删除消息',
      content: '删除后仅从当前演示数据中移除。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        cancelMessage(target.id)
        const list =
          options.messagesByConversation.value[target.conversationId] ?? []
        options.messagesByConversation.value[target.conversationId] =
          list.filter((item) => item.id !== target.id)
        favoriteMessageIds.value = favoriteMessageIds.value.filter(
          (id) => id !== target.id
        )
        refreshConversationSummary(target.conversationId)
      },
    })
  }

  async function handleMessageCopy(target: Message) {
    if (!navigator.clipboard?.writeText) {
      messageToast.error('当前环境不支持复制')
      return
    }
    try {
      await navigator.clipboard.writeText(target.content)
      messageToast.success('已复制消息')
    } catch {
      messageToast.error('复制失败，请检查浏览器权限')
    }
  }

  function toggleMessageFavorite(target: Message) {
    favoriteMessageIds.value = favoriteMessageIds.value.includes(target.id)
      ? favoriteMessageIds.value.filter((id) => id !== target.id)
      : [...favoriteMessageIds.value, target.id]
  }

  function handleMessageReaction(target: Message, emoji: string) {
    const reactions = target.reactions ?? []
    const reaction = reactions.find((item) => item.emoji === emoji)
    if (!reaction) {
      target.reactions = [...reactions, { emoji, count: 1, users: ['me'] }]
      return
    }
    if (reaction.users.includes('me')) {
      const users = reaction.users.filter((user) => user !== 'me')
      target.reactions =
        users.length === 0
          ? reactions.filter((item) => item.emoji !== emoji)
          : reactions.map((item) =>
              item.emoji === emoji
                ? { ...item, count: users.length, users }
                : item
            )
      return
    }
    target.reactions = reactions.map((item) =>
      item.emoji === emoji
        ? {
            ...item,
            count: item.count + 1,
            users: [...item.users, 'me'],
          }
        : item
    )
  }

  function handleMessageDownload(target: Message) {
    const fileName = target.content.split('/').at(-1) || '聊天文件.txt'
    const isDownloadableUrl = /^https?:\/\//.test(target.content)
    const downloadUrl = isDownloadableUrl
      ? target.content
      : URL.createObjectURL(
          new Blob([`演示文件：${target.content}`], {
            type: 'text/plain;charset=utf-8',
          })
        )
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    link.click()
    if (!isDownloadableUrl) URL.revokeObjectURL(downloadUrl)
    messageToast.success(`已开始下载：${fileName}`)
  }

  function handleMessagesClear(conversation: Conversation) {
    Modal.confirm({
      title: '清空消息',
      content: `确定清空「${conversation.title}」的消息记录吗？`,
      okText: '清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const messages =
          options.messagesByConversation.value[conversation.id] ?? []
        messages.forEach((message) => cancelMessage(message.id))
        const messageIds = new Set(messages.map((item) => item.id))
        options.messagesByConversation.value[conversation.id] = []
        favoriteMessageIds.value = favoriteMessageIds.value.filter(
          (id) => !messageIds.has(id)
        )
        refreshConversationSummary(conversation.id)
      },
    })
  }

  function removeConversationMessages(conversationId: string) {
    cancelConversation(conversationId)
    const messages = options.messagesByConversation.value[conversationId] ?? []
    messages.forEach((message) => cancelMessage(message.id))
    const messageIds = new Set(messages.map((item) => item.id))
    delete options.messagesByConversation.value[conversationId]
    favoriteMessageIds.value = favoriteMessageIds.value.filter(
      (id) => !messageIds.has(id)
    )
  }

  return {
    activeMessages,
    favoriteMessageIds,
    cancelConversation,
    handleMessageCopy,
    handleMessageDelete,
    handleMessageDownload,
    handleMessageReaction,
    handleMessageRecall,
    handleMessageRetry,
    handleMessageSend,
    handleMessagesClear,
    removeConversationMessages,
    toggleMessageFavorite,
  }
}
