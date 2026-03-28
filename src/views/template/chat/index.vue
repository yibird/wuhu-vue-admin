<template>
  <div class="full p-10">
    <div class="h-full flex bg-white rounded-4 overflow-hidden">
      <Nav v-model:active-key="activeKey" />
      <Sider
        :active-key="activeKey"
        v-model:active-conversation-id="activeConversationId"
        @select="handleConversationSelect"
      />
      <MessageArea
        :conversation="activeConversation"
        @send="handleMessageSend"
        @typing="handleTyping"
        @stop-typing="handleStopTyping"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Nav, Sider, MessageArea } from './components'
import type { Conversation, NavType, MessageType } from './components/types'

const activeKey = ref<NavType>('conversation')
const activeConversationId = ref()
const activeConversation = ref<Conversation>()
const typingConversations = ref<Set<string>>(new Set())

// Mock data
const conversations = ref<Conversation[]>([
  {
    id: '1',
    type: 'private',
    title: '张三',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: '好的，明天见！',
    lastMessageTime: '10:30',
    unreadCount: 2,
    pinned: true,
    userInfo: {
      id: '1',
      name: '张三',
      status: 'online',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
  },
  {
    id: '2',
    type: 'private',
    title: '李四',
    avatar: 'https://i.pravatar.cc/100?img=2',
    lastMessage: '项目进展如何？',
    lastMessageTime: '09:15',
    unreadCount: 0,
    userInfo: {
      id: '2',
      name: '李四',
      status: 'offline',
      avatar: 'https://i.pravatar.cc/100?img=2',
    },
  },
  {
    id: '3',
    type: 'group',
    title: '产品研发群',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: '王五：代码已提交',
    lastMessageTime: '昨天',
    unreadCount: 5,
    groupInfo: { id: '3', name: '产品研发群', memberCount: 28 },
  },
  {
    id: '4',
    type: 'private',
    title: '王五',
    avatar: 'https://i.pravatar.cc/100?img=4',
    lastMessage: '辛苦了，早点休息',
    lastMessageTime: '昨天',
    unreadCount: 0,
    muted: true,
    userInfo: {
      id: '4',
      name: '王五',
      status: 'away',
      avatar: 'https://i.pravatar.cc/100?img=4',
    },
  },
])

// Conversation handlers
function handleConversationSelect(conversation: Conversation) {
  activeConversation.value = conversation
  conversation.unreadCount = 0
}

// Message handlers
function handleMessageSend(payload: { type: MessageType; content: string }) {
  if (!activeConversation.value) return

  activeConversation.value.lastMessage =
    payload.type === 'text'
      ? payload.content
      : payload.type === 'image'
        ? '[图片]'
        : payload.type === 'emoji'
          ? payload.content
          : '[文件]'
  activeConversation.value.lastMessageTime = new Date().toLocaleTimeString(
    'zh-CN',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )

  if (!activeConversation.value.pinned) {
    const index = conversations.value.findIndex(
      (c) => c.id === activeConversation.value!.id
    )
    if (index > -1) {
      const conv = conversations.value.splice(index, 1)[0]
      const insertIndex = conversations.value.findIndex((c) => c.pinned)
      if (insertIndex > -1) {
        conversations.value.splice(insertIndex, 0, conv)
      } else {
        conversations.value.unshift(conv)
      }
    }
  }
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
</script>
