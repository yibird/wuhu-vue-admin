<template>
  <main class="flex-1 h-full">
    <div class="h-full flex flex-col bg-white">
      <!-- Empty state -->
      <div v-if="!conversation" class="flex-1 flex items-center justify-center">
        <div class="text-center text-regular">
          <Icon
            name="i-lucide:message-circle"
            :size="60"
            class="mb-15 opacity-20"
          />
          <div class="text-lg">选择一个会话开始聊天</div>
          <div class="text-sm mt-5">从左侧列表选择一个会话或发起新会话</div>
        </div>
      </div>

      <!-- Chat area -->
      <template v-else>
        <!-- Header -->
        <div
          class="h-60 px-15 flex items-center justify-between border-b-1 border-solid border-[#E8E8E8]"
        >
          <div class="flex items-center gap-10">
            <div class="relative">
              <n-avatar
                :src="conversation.avatar"
                :size="40"
                round
                fallback-src="https://i.pravatar.cc/100?img=1"
              />
              <span
                v-if="conversation.userInfo?.status"
                class="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-white"
                :class="{
                  'bg-success': conversation.userInfo.status === 'online',
                  'bg-regular': conversation.userInfo.status === 'offline',
                  'bg-error': conversation.userInfo.status === 'busy',
                  'bg-warning': conversation.userInfo.status === 'away',
                }"
              />
            </div>
            <div>
              <div class="font-500 text-main">{{ conversation.title }}</div>
              <div class="text-xs text-regular">
                {{ statusText(conversation.userInfo?.status) }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-5">
            <button
              class="size-40 flex items-center justify-center text-regular rounded-full cursor-pointer hover:bg-[#f5f5f5]"
              title="语音通话"
            >
              <Icon name="i-lucide:phone" :size="18" />
            </button>
            <button
              class="size-40 flex items-center justify-center text-regular rounded-full cursor-pointer hover:bg-[#f5f5f5]"
              title="视频通话"
            >
              <Icon name="i-lucide:video" :size="18" />
            </button>
            <button
              class="size-40 flex items-center justify-center text-regular rounded-full cursor-pointer hover:bg-[#f5f5f5]"
              title="更多"
            >
              <Icon name="i-lucide:more-vertical" :size="18" />
            </button>
          </div>
        </div>

        <!-- Message list -->
        <div class="flex-1 overflow-hidden">
          <MessageList
            ref="messageListRef"
            :messages="messages"
            @retry="handleRetry"
            @recall="handleRecall"
            @reaction="handleReaction"
            @scroll-to-bottom="handleScrollToBottom"
          />
        </div>

        <!-- Editor -->
        <div class="border-t-1 border-solid border-[#E8E8E8]">
          <MessageEditor
            ref="editorRef"
            @send="handleSend"
            @typing="handleTyping"
            @stop-typing="handleStopTyping"
          />
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import MessageList from './list/index.vue'
import MessageEditor from './editor/index.vue'
import type { Conversation, Message, MessageType, UserInfo } from '../types'

interface Props {
  conversation?: Conversation
}

const props = defineProps<Props>()

const emit = defineEmits<{
  send: [message: { type: MessageType; content: string }]
  typing: []
  stopTyping: []
}>()

const messageListRef = ref<InstanceType<typeof MessageList>>()
const editorRef = ref<InstanceType<typeof MessageEditor>>()

// Mock messages - in real app would be loaded from store/API
const messages = ref<Message[]>([
  {
    id: '1',
    conversationId: '1',
    type: 'text',
    content: '你好，最近项目进展如何？',
    senderId: '1',
    senderInfo: {
      id: '1',
      name: '张三',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
    timestamp: '10:30',
    status: 'read',
  },
  {
    id: '2',
    conversationId: '1',
    type: 'text',
    content: '挺好的，已经完成了第一阶段的开发！',
    senderId: 'me',
    senderInfo: {
      id: 'me',
      name: '我',
      avatar: 'https://i.pravatar.cc/100?img=10',
    },
    timestamp: '10:31',
    status: 'read',
  },
  {
    id: '3',
    conversationId: '1',
    type: 'image',
    content: 'https://i.pravatar.cc/300?img=5',
    senderId: '1',
    senderInfo: {
      id: '1',
      name: '张三',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
    timestamp: '10:32',
    status: 'read',
  },
  {
    id: '4',
    conversationId: '1',
    type: 'emoji',
    content: '👍',
    senderId: 'me',
    senderInfo: {
      id: 'me',
      name: '我',
      avatar: 'https://i.pravatar.cc/100?img=10',
    },
    timestamp: '10:33',
    status: 'read',
    reactions: [{ emoji: '👍', count: 1, users: ['1'] }],
  },
  {
    id: '5',
    conversationId: '1',
    type: 'text',
    content: '太棒了！明天开会讨论下阶段计划？',
    senderId: '1',
    senderInfo: {
      id: '1',
      name: '张三',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
    timestamp: '10:35',
    status: 'read',
  },
])

const isMine = (senderId: string) => senderId === 'me'

function statusText(status?: UserInfo['status']) {
  switch (status) {
    case 'online':
      return '在线'
    case 'offline':
      return '离线'
    case 'busy':
      return '忙碌'
    case 'away':
      return '离开'
    default:
      return ''
  }
}

function handleSend(payload: { type: MessageType; content: string }) {
  const newMessage: Message = {
    id: Date.now().toString(),
    conversationId: props.conversation?.id || '',
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
  }
  messages.value.push(newMessage)

  // Scroll to bottom
  setTimeout(() => {
    messageListRef.value?.scrollToBottom()
  }, 50)

  emit('send', payload)
}

function handleRetry(message: Message) {
  message.status = 'sending'
  // Retry logic would go here
}

function handleRecall(message: Message) {
  // Recall logic would go here
}

function handleReaction(message: Message, emoji: string) {
  const reaction = message.reactions?.find((r) => r.emoji === emoji)
  if (reaction) {
    if (reaction.users.includes('me')) {
      reaction.count--
      reaction.users = reaction.users.filter((u) => u !== 'me')
    } else {
      reaction.count++
      reaction.users.push('me')
    }
  } else {
    message.reactions = message.reactions || []
    message.reactions.push({ emoji, count: 1, users: ['me'] })
  }
}

function handleTyping() {
  emit('typing')
}

function handleStopTyping() {
  emit('stopTyping')
}

function handleScrollToBottom() {
  messageListRef.value?.scrollToBottom()
}
</script>
