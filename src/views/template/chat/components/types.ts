// Navigation types
export type NavType = 'conversation' | 'contact' | 'group'

export type GlobalSearchTab = 'all' | 'contacts' | 'groups' | 'messages'

export interface NavItem {
  key: NavType
  label: string
  icon: string
  badge?: number
}

// Conversation types
export interface Conversation {
  id: string
  type: 'private' | 'group' | 'system'
  title: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  pinned?: boolean
  muted?: boolean
  mentioned?: boolean
  archived?: boolean
  userInfo?: UserInfo
  groupInfo?: GroupInfo
}

export interface ChatSettings {
  enterToSend: boolean
  desktopNotify: boolean
  messageSound: boolean
  readReceipt: boolean
  dnd: boolean
  compactMode: boolean
  autoArchiveDays: number
}

export interface UserInfo {
  id: string
  name: string
  avatar?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  title?: string
  department?: string
  company?: string
  email?: string
  phone?: string
  location?: string
  bio?: string
  remark?: string
  tags?: string[]
  joinedAt?: string
  lastActiveAt?: string
}

export interface GroupInfo {
  id: string
  name: string
  avatar?: string
  memberCount: number
  category?: GroupCategory
  memberIds?: string[]
  members?: GroupMember[]
  announcement?: GroupAnnouncement
}

export type GroupMemberRole = 'owner' | 'admin' | 'member'

export interface GroupMember extends UserInfo {
  role: GroupMemberRole
}

export interface GroupAnnouncement {
  content: string
  updatedAt: string
  updatedBy: string
}

export type GroupPanelTab = 'announcement' | 'members'

export type GroupCategory =
  | 'project'
  | 'department'
  | 'interest'
  | 'study'
  | 'other'

export interface CreateGroupPayload {
  name: string
  category: GroupCategory
  memberIds: string[]
}

export interface DirectoryUserItem {
  id: string
  type: 'user'
  name: string
  avatar?: string
  status?: UserInfo['status']
  title?: string
  department?: string
  tags?: string[]
}

export interface DirectoryGroupItem {
  id: string
  type: 'group'
  name: string
  avatar?: string
  category?: GroupCategory
  description?: string
  memberCount: number
  tags?: string[]
}

export type DirectoryItem = DirectoryUserItem | DirectoryGroupItem

// Message types
export type MessageType =
  | 'text'
  | 'image'
  | 'emoji'
  | 'voice'
  | 'file'
  | 'custom'

export interface Message {
  id: string
  conversationId: string
  type: MessageType
  content: string
  senderId: string
  senderInfo?: UserInfo
  timestamp: string
  status: 'sending' | 'sent' | 'read' | 'failed'
  replyTo?: string
  replyInfo?: MessageReplyInfo
  editedAt?: string
  reactions?: MessageReaction[]
}

export interface GlobalSearchMessagePayload {
  conversation: Conversation
  message: Message
}

export interface MessageReaction {
  emoji: string
  count: number
  users: string[]
}

export interface MessageReplyInfo {
  senderName?: string
  content: string
}

export interface ChatSendPayload {
  type: MessageType
  content: string
  replyTo?: string
  replyInfo?: MessageReplyInfo
  editId?: string
}

export interface TextMessageContent {
  text: string
}

export interface ImageMessageContent {
  url: string
  width?: number
  height?: number
  thumbnail?: string
}

export interface EmojiMessageContent {
  emoji: string
}

export interface VoiceMessageContent {
  url: string
  duration: number
  waveform?: number[]
}

export interface FileMessageContent {
  name: string
  url: string
  size: number
  mimeType: string
}

export interface CustomMessageContent {
  type: string
  data: Record<string, unknown>
}

// Contact types
export interface Contact extends UserInfo {}

// Editor types
export interface EditorState {
  text: string
  images: string[]
  replyTo?: Message
}

export interface NavigationEmits {
  (e: 'update:activeNav', value: NavType): void
  (e: 'navChange', value: NavType): void
  (e: 'openSettings'): void
}

export interface ConversationListProps {
  conversations: Conversation[]
  activeConversationId?: string
  loading?: boolean
}

export interface ConversationListEmits {
  (e: 'select', conversation: Conversation): void
  (e: 'createGroup'): void
  (e: 'addContact'): void
  (e: 'openGlobalSearch'): void
  (e: 'delete', conversation: Conversation): void
  (e: 'mute', conversation: Conversation): void
  (e: 'pin', conversation: Conversation): void
  (e: 'markUnread', conversation: Conversation): void
  (e: 'archive', conversation: Conversation): void
}

export interface MessageListProps {
  messages: Message[]
  loading?: boolean
}

export interface MessageListEmits {
  (e: 'retry', message: Message): void
  (e: 'recall', message: Message): void
  (e: 'delete', message: Message): void
  (e: 'copy', message: Message): void
  (e: 'reply', message: Message): void
  (e: 'edit', message: Message): void
  (e: 'favorite', message: Message): void
  (e: 'reaction', message: Message, emoji: string): void
  (e: 'previewImage', url: string): void
  (e: 'download', message: Message): void
  (e: 'showUser', user: UserInfo): void
  (e: 'scrollToBottom'): void
}

export interface MessageItemProps {
  favorite?: boolean
  message: Message
  isMine: boolean
}

export interface MessageItemEmits {
  (e: 'retry'): void
  (e: 'recall'): void
  (e: 'delete'): void
  (e: 'copy'): void
  (e: 'reply'): void
  (e: 'edit'): void
  (e: 'favorite'): void
  (e: 'reaction', emoji: string): void
  (e: 'previewImage', url: string): void
  (e: 'download'): void
  (e: 'showUser', user: UserInfo): void
}

export interface MessageEditorProps {
  placeholder?: string
  disabled?: boolean
  settings?: ChatSettings
}

export interface SettingPanelProps {
  modelValue: ChatSettings
  showHeader?: boolean
}

export interface SettingPanelEmits {
  (e: 'update:modelValue', value: ChatSettings): void
}

export interface MessageEditorEmits {
  (e: 'send', message: ChatSendPayload): void
  (e: 'typing'): void
  (e: 'stopTyping'): void
  (e: 'cancelCompose'): void
}

export interface EmojiPickerEmits {
  (e: 'select', emoji: string): void
}

export interface TabItem {
  key: string
  label?: string
}
export interface TabsProps {
  items?: TabItem[]
  activeKey?: string
  ariaLabel?: string
}

export interface TabsEmits {
  (e: 'change', item: TabItem, index: number): void
}
