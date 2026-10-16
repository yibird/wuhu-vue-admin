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
  /**
   * 进入会话时快照的未读数
   *
   * 会话自身的 unreadCount 在进入时清零(侧边栏徽标随之消失),
   * 这里保留一份,供消息区展示未读条并定位第一条未读。
   */
  const pendingUnreadCounts = shallowRef<Record<string, number>>({})

  const activeConversation = computed(() =>
    conversations.value.find(
      (conversation) => conversation.id === activeConversationId.value
    )
  )
  const activeUnreadCount = computed(
    () => pendingUnreadCounts.value[activeConversationId.value] ?? 0
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

  function rememberUnread(conversation: Conversation) {
    if (conversation.unreadCount <= 0) return
    pendingUnreadCounts.value = {
      ...pendingUnreadCounts.value,
      [conversation.id]: conversation.unreadCount,
    }
  }

  function selectConversation(conversation: Conversation) {
    const existing = conversations.value.find(
      (item) => item.id === conversation.id
    )
    const current = existing ?? conversation
    if (!existing) conversations.value.unshift(current)

    activeConversationId.value = current.id
    rememberUnread(current)
    current.unreadCount = 0
    current.mentioned = false
    return current
  }

  /** 未读条被消费后清除快照,再次进入该会话不再提示。 */
  function markConversationRead(conversationId: string) {
    if (pendingUnreadCounts.value[conversationId] === undefined) return
    const next = { ...pendingUnreadCounts.value }
    delete next[conversationId]
    pendingUnreadCounts.value = next
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
    markConversationRead(conversationId)

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

  // 默认打开的会话与手动点击进入保持一致:清零徽标并快照未读数
  const initialConversation = conversations.value.find(
    (item) => item.id === activeConversationId.value
  )
  if (initialConversation) selectConversation(initialConversation)

  return {
    activeConversation,
    activeConversationId,
    activeUnreadCount,
    conversations,
    groups,
    isCurrentConversationTyping,
    totalUnreadCount,
    typingConversations,
    ensurePrivateConversation,
    markConversationRead,
    markConversationUnread,
    removeConversation,
    selectConversation,
    setCurrentConversationTyping,
    toggleConversationArchived,
    toggleConversationMuted,
    toggleConversationPinned,
  }
}
