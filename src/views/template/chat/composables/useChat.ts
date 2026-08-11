import { computed, ref, shallowRef, watch } from 'vue'
import { message as messageToast, Modal } from 'antdv-next'
import {
  createDirectoryCandidates,
  createGroupMembers,
  createInitialContacts,
  createInitialConversations,
  createInitialGroups,
  createInitialMessagesByConversation,
} from '../data'
import { useResizableSidebar } from './useResizableSidebar'
import { useChatAudio } from './useChatAudio'
import { useManagedTimeout } from './useManagedTimeout'
import { getMessageSummary } from '../model/message'
import type {
  ChatSendPayload,
  ChatSettings,
  Contact,
  Conversation,
  CreateGroupPayload,
  DirectoryGroupItem,
  DirectoryUserItem,
  GlobalSearchMessagePayload,
  Message,
  NavType,
} from '../components/types'

export function useChat() {
  const { schedule: safeTimeout } = useManagedTimeout()

  // --- Core state ---
  const activeKey = ref<NavType>('conversation')
  const activeConversationId = ref<string>('1')
  const activeConversation = ref<Conversation>()
  const typingConversations = ref<Set<string>>(new Set())
  const favoriteMessageIds = shallowRef<string[]>([])
  const sidebarWidth = shallowRef(300)

  // --- Image preview state ---
  const imagePreviewOpen = ref(false)
  const previewImageUrl = ref('')

  // --- Call state ---
  const callOpen = ref(false)
  const callType = ref<'voice' | 'video'>('voice')
  const callConversation = ref<Conversation>()

  // --- Settings ---
  const chatSettings = shallowRef<ChatSettings>({
    enterToSend: true,
    desktopNotify: true,
    messageSound: true,
    readReceipt: true,
    dnd: false,
    compactMode: false,
    autoArchiveDays: 30,
  })

  const { playIncomingMessageTone } = useChatAudio()

  // --- Sidebar resize ---
  const {
    isResizing: isSidebarResizing,
    sidebarStyle,
    startResize: startSidebarResize,
  } = useResizableSidebar({
    width: sidebarWidth,
    minWidth: 260,
    maxWidth: 440,
  })

  // --- Data ---
  const conversations = ref<Conversation[]>(createInitialConversations())
  const contacts = ref<Contact[]>(createInitialContacts())
  const groups = ref<Conversation[]>(createInitialGroups())
  const directoryCandidates = createDirectoryCandidates()
  const messagesByConversation = ref<Record<string, Message[]>>(
    createInitialMessagesByConversation()
  )

  // --- Computed ---
  const activeMessages = computed(() => {
    if (!activeConversationId.value) return []
    return messagesByConversation.value[activeConversationId.value] ?? []
  })

  const totalUnreadCount = computed(() =>
    conversations.value.reduce((sum, item) => sum + item.unreadCount, 0)
  )

  const isCurrentConversationTyping = computed(() => {
    if (!activeConversationId.value) return false
    return typingConversations.value.has(activeConversationId.value)
  })

  // --- Watchers ---
  watch(
    conversations,
    (list) => {
      if (activeConversation.value) return
      const first = list[0]
      if (!first) return
      activeConversationId.value = first.id
      activeConversation.value = first
      messagesByConversation.value[first.id] ??= []
    },
    { immediate: true }
  )

  // --- Helper functions ---
  function promoteConversation(conversation: Conversation) {
    if (conversation.pinned) return
    const index = conversations.value.findIndex(
      (item) => item.id === conversation.id
    )
    if (index < 0) return
    const [current] = conversations.value.splice(index, 1)
    const pinnedCount = conversations.value.filter((item) => item.pinned).length
    conversations.value.splice(pinnedCount, 0, current)
  }

  function refreshConversationSummary(conversationId: string) {
    const conversation = conversations.value.find(
      (item) => item.id === conversationId
    )
    if (!conversation) return
    const list = messagesByConversation.value[conversationId] ?? []
    const last = list.at(-1)
    conversation.lastMessage = last ? getMessageSummary(last) : '暂无消息'
    conversation.lastMessageTime = last?.timestamp ?? ''
  }

  // --- Event handlers ---
  function handleConversationSelect(conversation: Conversation) {
    activeConversationId.value = conversation.id
    activeConversation.value = conversation
    conversation.unreadCount = 0
    conversation.mentioned = false
    messagesByConversation.value[conversation.id] ??= []
  }

  function handleGlobalMessageSelect(payload: GlobalSearchMessagePayload) {
    activeKey.value = 'conversation'
    handleConversationSelect(payload.conversation)
  }

  function handleContactChat(contact: Contact, navigateToConversation = true) {
    const existing = conversations.value.find((item) => item.id === contact.id)
    if (existing) {
      if (navigateToConversation) activeKey.value = 'conversation'
      handleConversationSelect(existing)
      return
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
    if (navigateToConversation) activeKey.value = 'conversation'
    handleConversationSelect(conversation)
  }

  function handleMessageSend(payload: ChatSendPayload) {
    if (!activeConversation.value) return

    if (payload.editId) {
      updateMessage(payload)
      return
    }

    const conversationId = activeConversation.value.id
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

    messagesByConversation.value[conversationId] ??= []
    messagesByConversation.value[conversationId].push(message)

    activeConversation.value.lastMessage =
      payload.type === 'text' ? payload.content : getMessageSummary(message)
    activeConversation.value.lastMessageTime = message.timestamp

    promoteConversation(activeConversation.value)
    safeTimeout(() => {
      message.status = 'sent'
    }, 260)
    simulateAutoReply(activeConversation.value)
  }

  function handleTyping() {
    if (activeConversation.value) {
      typingConversations.value.add(activeConversation.value.id)
    }
  }

  function handleStopTyping() {
    if (activeConversation.value) {
      typingConversations.value.delete(activeConversation.value.id)
    }
  }

  function updateMessage(payload: ChatSendPayload) {
    if (!activeConversationId.value || !payload.editId) return

    const target = messagesByConversation.value[
      activeConversationId.value
    ]?.find((item) => item.id === payload.editId)
    if (!target) return

    const wasLastMessage =
      messagesByConversation.value[activeConversationId.value]?.at(-1)?.id ===
      target.id
    target.content = payload.content
    target.editedAt = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })

    if (wasLastMessage && activeConversation.value) {
      activeConversation.value.lastMessage = getMessageSummary(target)
    }
    messageToast.success('消息已更新')
  }

  function handleMessageRetry(target: Message) {
    target.status = 'sending'
    safeTimeout(() => {
      target.status = 'sent'
      messageToast.success('已重新发送')
    }, 300)
  }

  function handleMessageRecall(target: Message) {
    Modal.confirm({
      title: '撤回消息',
      content: '确定撤回这条消息吗？',
      okText: '撤回',
      cancelText: '取消',
      onOk: () => {
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
        const list = messagesByConversation.value[target.conversationId] ?? []
        messagesByConversation.value[target.conversationId] = list.filter(
          (item) => item.id !== target.id
        )
        favoriteMessageIds.value = favoriteMessageIds.value.filter(
          (id) => id !== target.id
        )
        refreshConversationSummary(target.conversationId)
      },
    })
  }

  async function handleMessageCopy(target: Message) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(target.content)
    }
    messageToast.success('已复制消息')
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

  function handleImagePreview(url: string) {
    previewImageUrl.value = url
    imagePreviewOpen.value = true
  }

  function handleMessageDownload(target: Message) {
    messageToast.success(`已开始下载：${target.content}`)
  }

  function handleCall(type: 'voice' | 'video') {
    if (!activeConversation.value) return
    callType.value = type
    callConversation.value = activeConversation.value
    callOpen.value = true
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
      const nextConversation = conversations.value.find(
        (item) => !item.archived && item.id !== conversation.id
      )
      activeConversationId.value = nextConversation?.id ?? ''
      activeConversation.value = nextConversation
    }
  }

  function handleConversationDelete(conversation: Conversation) {
    Modal.confirm({
      title: '删除会话',
      content: `确定删除「${conversation.title}」吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const messageIds = new Set(
          (messagesByConversation.value[conversation.id] ?? []).map(
            (item) => item.id
          )
        )
        conversations.value = conversations.value.filter(
          (item) => item.id !== conversation.id
        )
        delete messagesByConversation.value[conversation.id]
        favoriteMessageIds.value = favoriteMessageIds.value.filter(
          (id) => !messageIds.has(id)
        )

        if (activeConversationId.value === conversation.id) {
          activeConversationId.value = conversations.value[0]?.id
          activeConversation.value = conversations.value[0]
        }
      },
    })
  }

  function handleMessagesClear(conversation: Conversation) {
    Modal.confirm({
      title: '清空消息',
      content: `确定清空「${conversation.title}」的消息记录吗？`,
      okText: '清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const messageIds = new Set(
          (messagesByConversation.value[conversation.id] ?? []).map(
            (item) => item.id
          )
        )
        messagesByConversation.value[conversation.id] = []
        favoriteMessageIds.value = favoriteMessageIds.value.filter(
          (id) => !messageIds.has(id)
        )
        refreshConversationSummary(conversation.id)
      },
    })
  }

  function updateGroupAnnouncement(
    conversation: Conversation,
    content: string
  ) {
    if (conversation.type !== 'group' || !conversation.groupInfo) return

    conversation.groupInfo.announcement = {
      content,
      updatedAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      updatedBy: '我',
    }
    messageToast.success('群公告已更新')
  }

  function createGroup(payload: CreateGroupPayload) {
    const id = `group-${Date.now()}`
    const selectedContacts = contacts.value.filter((contact) =>
      payload.memberIds.includes(contact.id)
    )
    const members = createGroupMembers(
      id,
      payload.memberIds.length + 1,
      selectedContacts
    )
    const group: Conversation = {
      id,
      type: 'group',
      title: payload.name,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(payload.name)}`,
      lastMessage: `${payload.memberIds.length + 1} 位成员已加入群聊`,
      lastMessageTime: '刚刚',
      unreadCount: 0,
      groupInfo: {
        id,
        name: payload.name,
        memberCount: members.length,
        category: payload.category,
        memberIds: members.map((member) => member.id),
        members,
      },
    }

    groups.value.unshift(group)
    conversations.value.unshift(group)
    messagesByConversation.value[id] = []
    activeKey.value = 'conversation'
    handleConversationSelect(group)
    messageToast.success(`群聊「${payload.name}」创建成功`)
  }

  function addDirectoryUser(user: DirectoryUserItem) {
    if (contacts.value.some((contact) => contact.id === user.id)) {
      messageToast.info('该用户已经是你的好友')
      return
    }

    contacts.value.unshift({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      status: user.status ?? 'offline',
      title: user.title,
      department: user.department,
      tags: user.tags,
      remark: '通过通讯录搜索添加',
    })
    messageToast.success(`已添加 ${user.name} 为好友`)
  }

  function addDirectoryGroup(item: DirectoryGroupItem) {
    if (groups.value.some((group) => group.id === item.id)) {
      messageToast.info('你已经加入该群聊')
      return
    }

    const members = createGroupMembers(
      item.id,
      item.memberCount + 1,
      contacts.value
    )
    const group: Conversation = {
      id: item.id,
      type: 'group',
      title: item.name,
      avatar: item.avatar,
      lastMessage: item.description || '已加入群聊',
      lastMessageTime: '刚刚',
      unreadCount: 0,
      groupInfo: {
        id: item.id,
        name: item.name,
        memberCount: members.length,
        category: item.category,
        memberIds: members.map((member) => member.id),
        members,
        announcement: item.description
          ? {
              content: item.description,
              updatedAt: '刚刚',
              updatedBy: '群管理员',
            }
          : undefined,
      },
    }

    groups.value.unshift(group)
    conversations.value.unshift(group)
    messagesByConversation.value[group.id] = []
    messageToast.success(`已加入群聊「${item.name}」`)
  }

  function simulateAutoReply(conversation: Conversation) {
    if (
      conversation.type !== 'private' ||
      conversation.muted ||
      chatSettings.value.dnd
    ) {
      return
    }

    typingConversations.value.add(conversation.id)
    safeTimeout(() => {
      typingConversations.value.delete(conversation.id)
      if (activeConversationId.value !== conversation.id) {
        conversation.unreadCount += 1
      }

      const reply: Message = {
        id: `reply-${Date.now()}`,
        conversationId: conversation.id,
        type: 'text',
        content: '收到，我看一下后同步给你。',
        senderId: conversation.userInfo?.id ?? conversation.id,
        senderInfo: conversation.userInfo,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'read',
      }
      messagesByConversation.value[conversation.id] ??= []
      messagesByConversation.value[conversation.id].push(reply)
      conversation.lastMessage = reply.content
      conversation.lastMessageTime = reply.timestamp
      if (chatSettings.value.messageSound) {
        playIncomingMessageTone()
      }
    }, 900)
  }

  return {
    // State
    activeKey,
    activeConversationId,
    activeConversation,
    isSidebarResizing,
    sidebarStyle,
    imagePreviewOpen,
    previewImageUrl,
    callOpen,
    callType,
    callConversation,
    chatSettings,
    conversations,
    contacts,
    groups,
    directoryCandidates,
    messagesByConversation,
    favoriteMessageIds,
    // Computed
    activeMessages,
    totalUnreadCount,
    isCurrentConversationTyping,
    // Handlers
    startSidebarResize,
    handleConversationSelect,
    handleGlobalMessageSelect,
    handleContactChat,
    handleMessageSend,
    handleTyping,
    handleStopTyping,
    handleMessageRetry,
    handleMessageRecall,
    handleMessageDelete,
    handleMessageCopy,
    toggleMessageFavorite,
    handleMessageReaction,
    handleImagePreview,
    handleMessageDownload,
    handleCall,
    toggleConversationPinned,
    toggleConversationMuted,
    markConversationUnread,
    toggleConversationArchived,
    handleConversationDelete,
    handleMessagesClear,
    updateGroupAnnouncement,
    createGroup,
    addDirectoryUser,
    addDirectoryGroup,
  }
}
