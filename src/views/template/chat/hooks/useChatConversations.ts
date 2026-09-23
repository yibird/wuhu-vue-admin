import { computed, ref, shallowRef } from 'vue'
import { createInitialConversations, createInitialGroups } from '../data'
import type { Contact, Conversation } from '../components/types'

/**
 * 管理会话集合、当前会话和输入状态。
 * 消息、通讯录等领域通过显式动作更新会话，避免各组件维护重复的选中状态。
 */
export function useChatConversations() {
  const conversations = ref<Conversation[]>([
    ...createInitialConversations(),
    ...createInitialGroups(),
  ])
  const activeConversationId = shallowRef('1')
  const typingConversations = ref(new Set<string>())

  const activeConversation = computed(() =>
    conversations.value.find(
      (conversation) => conversation.id === activeConversationId.value
    )
  )
  const groups = computed(() =>
    conversations.value.filter((conversation) => conversation.type === 'group')
  )
  const totalUnreadCount = computed(() =>
    conversations.value.reduce((sum, item) => sum + item.unreadCount, 0)
  )
  const isCurrentConversationTyping = computed(() => {
    const conversationId = activeConversationId.value
    return Boolean(
      conversationId && typingConversations.value.has(conversationId)
    )
  })

  function selectConversation(conversation: Conversation) {
    const existing = conversations.value.find(
      (item) => item.id === conversation.id
    )
    const current = existing ?? conversation
    if (!existing) conversations.value.unshift(current)

    activeConversationId.value = current.id
    current.unreadCount = 0
    current.mentioned = false
    return current
  }

  function ensurePrivateConversation(contact: Contact) {
    const existing = conversations.value.find((item) => item.id === contact.id)
    if (existing) {
      existing.archived = false
      return existing
    }

    const conversation: Conversation = {
      id: contact.id,
      type: 'private',
      title: contact.name,
      avatar: contact.avatar,
      lastMessage: '新的会话',
      lastMessageTime: '刚刚',
      unreadCount: 0,
      userInfo: { ...contact },
    }
    conversations.value.unshift(conversation)
    return conversation
  }

  function setCurrentConversationTyping(typing: boolean) {
    const conversationId = activeConversationId.value
    if (!conversationId) return
    if (typing) typingConversations.value.add(conversationId)
    else typingConversations.value.delete(conversationId)
  }

  function toggleConversationPinned(conversation: Conversation) {
    conversation.pinned = !conversation.pinned
    conversations.value = [...conversations.value].sort(
      (a, b) => Number(b.pinned) - Number(a.pinned)
    )
  }

  function toggleConversationMuted(conversation: Conversation) {
    conversation.muted = !conversation.muted
  }

  function markConversationUnread(conversation: Conversation) {
    conversation.unreadCount = Math.max(conversation.unreadCount, 1)
  }

  function toggleConversationArchived(conversation: Conversation) {
    conversation.archived = !conversation.archived
    if (
      conversation.archived &&
      activeConversationId.value === conversation.id
    ) {
      activeConversationId.value = findNextConversationId(conversation.id)
    }
    return Boolean(conversation.archived)
  }

  function removeConversation(conversationId: string) {
    conversations.value = conversations.value.filter(
      (item) => item.id !== conversationId
    )
    typingConversations.value.delete(conversationId)

    if (activeConversationId.value === conversationId) {
      activeConversationId.value = findNextConversationId(conversationId)
    }
  }

  function findNextConversationId(excludedId: string) {
    const visible = conversations.value.find(
      (item) => item.id !== excludedId && !item.archived
    )
    if (visible) return visible.id
    return conversations.value.find((item) => item.id !== excludedId)?.id ?? ''
  }

  return {
    activeConversation,
    activeConversationId,
    conversations,
    groups,
    isCurrentConversationTyping,
    totalUnreadCount,
    typingConversations,
    ensurePrivateConversation,
    markConversationUnread,
    removeConversation,
    selectConversation,
    setCurrentConversationTyping,
    toggleConversationArchived,
    toggleConversationMuted,
    toggleConversationPinned,
  }
}
