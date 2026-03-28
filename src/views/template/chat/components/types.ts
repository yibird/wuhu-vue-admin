// Navigation types
export type NavType = 'conversation' | 'contact' | 'group' | 'setting'

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
  userInfo?: UserInfo
  groupInfo?: GroupInfo
}

export interface UserInfo {
  id: string
  name: string
  avatar?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}

export interface GroupInfo {
  id: string
  name: string
  avatar?: string
  memberCount: number
}

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
  reactions?: MessageReaction[]
}

export interface MessageReaction {
  emoji: string
  count: number
  users: string[]
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
export interface Contact {
  id: string
  name: string
  avatar?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  remark?: string
  tags?: string[]
}

// Editor types
export interface EditorState {
  text: string
  images: string[]
  replyTo?: Message
}

export interface NavigationEmits {
  (e: 'update:activeNav', value: NavType): void
  (e: 'navChange', value: NavType): void
}

export interface ConversationListProps {
  conversations: Conversation[]
  activeConversationId?: string
  loading?: boolean
}

export interface ConversationListEmits {
  (e: 'select', conversation: Conversation): void
  (e: 'delete', conversation: Conversation): void
  (e: 'mute', conversation: Conversation): void
  (e: 'pin', conversation: Conversation): void
}

export interface MessageListProps {
  messages: Message[]
  loading?: boolean
}

export interface MessageListEmits {
  (e: 'retry', message: Message): void
  (e: 'recall', message: Message): void
  (e: 'reaction', message: Message, emoji: string): void
  (e: 'scrollToBottom'): void
}

export interface MessageItemProps {
  message: Message
  isMine: boolean
}

export interface MessageItemEmits {
  (e: 'retry'): void
  (e: 'recall'): void
  (e: 'reaction', emoji: string): void
}

export interface MessageEditorProps {
  placeholder?: string
  disabled?: boolean
}

export interface MessageEditorEmits {
  (e: 'send', message: { type: MessageType; content: string }): void
  (e: 'typing'): void
  (e: 'stopTyping'): void
}

export interface EmojiPickerEmits {
  (e: 'select', emoji: string): void
}

export interface TabItem {
  key: string
  label?: string
  [key: string]: any
}
export interface TabsProps {
  items?: TabItem[]
  activeKey?: string
}

export interface TabsEmits {
  (e: 'change', item: TabItem, index: number): void
}
