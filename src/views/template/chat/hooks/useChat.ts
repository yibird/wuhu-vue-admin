import { ref, shallowRef } from 'vue'
import { Modal, message } from 'antdv-next'
import { useChatAudio } from './useChatAudio'
import { useChatConversations } from './useChatConversations'
import { useChatDirectory } from './useChatDirectory'
import { useChatMessages } from './useChatMessages'
import { useContactNotifications } from './useContactNotifications'
import { useResizableSidebar } from './useResizableSidebar'
import { createInitialMessagesByConversation } from '../data'
import type {
  ChatSettings,
  Contact,
  Conversation,
  CreateGroupPayload,
  GlobalSearchMessagePayload,
  NavType,
} from '../components/types'

/**
 * 聊天页面的领域编排层。
 * 会话、通讯录、消息和通知各自维护状态，这里只连接它们的跨域动作。
 */
export function useChat() {
  const activeKey = shallowRef<NavType>('conversation')
  const imagePreviewOpen = shallowRef(false)
  const previewImageUrl = shallowRef('')
  const callOpen = shallowRef(false)
  const callType = shallowRef<'voice' | 'video'>('voice')
  const callConversation = shallowRef<Conversation>()
  const chatSettings = shallowRef<ChatSettings>({
    enterToSend: true,
    desktopNotify: true,
    messageSound: true,
    readReceipt: true,
    dnd: false,
    compactMode: false,
    autoArchiveDays: 30,
  })
  const messagesByConversation = ref(createInitialMessagesByConversation())
  const { playIncomingMessageTone } = useChatAudio()

  const {
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
    toggleConversationArchived: archiveConversation,
    toggleConversationMuted,
    toggleConversationPinned,
  } = useChatConversations()

  const {
    contacts,
    directoryCandidates,
    friendGroups,
    addDirectoryGroup: addGroupFromDirectory,
    addDirectoryUser,
    createGroup: createDirectoryGroup,
    updateGroupAnnouncement,
  } = useChatDirectory({ conversations })

  const sidebarWidth = shallowRef(300)
  const {
    isResizing: isSidebarResizing,
    sidebarStyle,
    startResize: startSidebarResize,
  } = useResizableSidebar({
    width: sidebarWidth,
    minWidth: 260,
    maxWidth: 440,
  })

  const {
    notifications: contactNotifications,
    unreadCount: contactNotificationCount,
    markCategoryRead: markContactNotificationsRead,
    resolve: resolveContactNotification,
  } = useContactNotifications({
    onAcceptGroup: addGroupFromDirectory,
    onAcceptUser: addDirectoryUser,
    onIgnored: () => message.info('已忽略该通知'),
  })

  const {
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
  } = useChatMessages({
    activeConversation,
    activeConversationId,
    chatSettings,
    conversations,
    messagesByConversation,
    typingConversations,
    onIncomingMessage: playIncomingMessageTone,
  })

  function handleConversationSelect(conversation: Conversation) {
    const current = selectConversation(conversation)
    messagesByConversation.value[current.id] ??= []
  }

  function handleGlobalMessageSelect(payload: GlobalSearchMessagePayload) {
    activeKey.value = 'conversation'
    handleConversationSelect(payload.conversation)
  }

  function handleContactChat(contact: Contact, navigateToConversation = true) {
    const conversation = ensurePrivateConversation(contact)
    if (navigateToConversation) activeKey.value = 'conversation'
    handleConversationSelect(conversation)
  }

  function handleImagePreview(url: string) {
    previewImageUrl.value = url
    imagePreviewOpen.value = true
  }

  function handleCall(type: 'voice' | 'video') {
    if (!activeConversation.value) return
    callType.value = type
    callConversation.value = activeConversation.value
    callOpen.value = true
  }

  function toggleConversationArchived(conversation: Conversation) {
    const archived = archiveConversation(conversation)
    if (archived) cancelConversation(conversation.id)
  }

  function handleConversationDelete(conversation: Conversation) {
    Modal.confirm({
      title: '删除会话',
      content: `确定删除「${conversation.title}」吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeConversationMessages(conversation.id)
        removeConversation(conversation.id)
      },
    })
  }

  function createGroup(payload: CreateGroupPayload) {
    const group = createDirectoryGroup(payload)
    messagesByConversation.value[group.id] = []
    activeKey.value = 'conversation'
    handleConversationSelect(group)
  }

  function addDirectoryGroup(
    item: Parameters<typeof addGroupFromDirectory>[0]
  ) {
    const group = addGroupFromDirectory(item)
    if (group) messagesByConversation.value[group.id] = []
  }

  return {
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
    friendGroups,
    groups,
    directoryCandidates,
    messagesByConversation,
    favoriteMessageIds,
    contactNotifications,
    activeMessages,
    totalUnreadCount,
    contactNotificationCount,
    isCurrentConversationTyping,
    startSidebarResize,
    handleConversationSelect,
    handleGlobalMessageSelect,
    handleContactChat,
    handleMessageSend,
    handleTyping: () => setCurrentConversationTyping(true),
    handleStopTyping: () => setCurrentConversationTyping(false),
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
    markContactNotificationsRead,
    resolveContactNotification,
  }
}
