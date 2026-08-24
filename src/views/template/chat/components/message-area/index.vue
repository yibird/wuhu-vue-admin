<template>
  <main class="h-full min-w-0 flex-1">
    <div class="h-full flex flex-col bg-container">
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

      <template v-else>
        <div
          class="h-60 flex items-center justify-between border-b-1 border-b-solid border-color-1 px-15"
        >
          <div class="min-w-0 flex items-center gap-10">
            <div class="relative">
              <a-avatar
                :src="conversation.avatar"
                :size="40"
                round
                fallback-src="https://i.pravatar.cc/100?img=1"
              />
              <span
                v-if="conversation.userInfo?.status"
                class="absolute bottom-0 right-0 size-8 rounded-full border-2 border-container"
                :class="{
                  'bg-success': conversation.userInfo.status === 'online',
                  'bg-fill': conversation.userInfo.status === 'offline',
                  'bg-error': conversation.userInfo.status === 'busy',
                  'bg-warning': conversation.userInfo.status === 'away',
                }"
              />
            </div>
            <div class="min-w-0">
              <div class="truncate text-main font-500">
                {{ conversation.title }}
              </div>
              <div
                class="mt-3 flex flex-wrap items-center gap-6 text-xs text-regular"
              >
                <span>{{ conversationStatus }}</span>
                <span v-if="conversation.pinned" class="conversation-chip">
                  <Icon name="i-lucide:pin" :size="11" />
                  置顶
                </span>
                <span v-if="conversation.muted" class="conversation-chip">
                  <Icon name="i-lucide:bell-off" :size="11" />
                  免打扰
                </span>
                <span
                  v-if="conversation.mentioned"
                  class="conversation-chip text-error"
                >
                  <Icon name="i-lucide:at-sign" :size="11" />
                  有人提到你
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-5">
            <button
              v-if="conversation.type === 'group'"
              type="button"
              class="button size-40 rounded-full text-secondary transition-[background-color,color,transform] hover:(bg-hover text-primary) active:scale-90"
              title="群公告"
              aria-label="打开群公告"
              @click="emit('openGroupPanel', 'announcement')"
            >
              <Icon name="i-lucide:megaphone" :size="18" />
            </button>
            <button
              v-if="conversation.type === 'group'"
              type="button"
              class="button size-40 rounded-full text-secondary transition-[background-color,color,transform] hover:(bg-hover text-primary) active:scale-90"
              title="群成员"
              aria-label="打开群成员列表"
              @click="emit('openGroupPanel', 'members')"
            >
              <Icon name="i-lucide:users" :size="18" />
            </button>
            <button
              type="button"
              class="button size-40 rounded-full text-secondary transition-[background-color,color,transform] hover:(bg-hover text-primary) active:scale-90"
              title="语音通话"
              aria-label="发起语音通话"
              @click="emit('call', 'voice')"
            >
              <Icon name="i-lucide:phone" :size="18" />
            </button>
            <button
              type="button"
              class="button size-40 rounded-full text-secondary transition-[background-color,color,transform] hover:(bg-hover text-primary) active:scale-90"
              title="视频通话"
              aria-label="发起视频通话"
              @click="emit('call', 'video')"
            >
              <Icon name="i-lucide:video" :size="18" />
            </button>
            <a-dropdown
              :trigger="['click']"
              :menu="{ items: headerActionItems, onClick: handleHeaderAction }"
            >
              <button
                type="button"
                class="button size-40 rounded-full text-secondary hover:(bg-hover text-primary)"
                title="更多"
                aria-label="打开会话更多操作"
              >
                <Icon name="i-lucide:more-vertical" :size="18" />
              </button>
            </a-dropdown>
          </div>
        </div>

        <Transition name="conversation-content" mode="out-in">
          <div :key="conversation.id" class="flex-1 overflow-hidden">
            <MessageList
              ref="messageListRef"
              :favorite-message-ids="favoriteMessageIds"
              :messages="messages"
              :typing="typing"
              :compact="settings.compactMode"
              @retry="handleRetry"
              @recall="handleRecall"
              @delete="(message) => emit('deleteMessage', message)"
              @copy="(message) => emit('copyMessage', message)"
              @reply="handleReply"
              @edit="handleEdit"
              @favorite="(message) => emit('toggleFavorite', message)"
              @reaction="handleReaction"
              @preview-image="(url) => emit('previewImage', url)"
              @download="(message) => emit('downloadMessage', message)"
              @show-user="(user) => emit('showUser', user)"
              @scroll-to-bottom="handleScrollToBottom"
            />
          </div>
        </Transition>

        <div class="border-t-1 border-t-solid border-color-1">
          <MessageEditor
            ref="editorRef"
            :reply-message="replyMessage"
            :edit-message="editMessage"
            :settings="settings"
            @send="handleSend"
            @typing="handleTyping"
            @stop-typing="handleStopTyping"
            @cancel-compose="clearComposeContext"
          />
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import MessageList from './list/index.vue'
import MessageEditor from './editor/index.vue'
import type { MenuProps } from 'antdv-next'
import { Icon } from '@/components/icon'
import type {
  ChatSendPayload,
  ChatSettings,
  Conversation,
  GroupPanelTab,
  Message,
  UserInfo,
} from '../types'
import { statusText } from '../../utils'

interface Props {
  conversation?: Conversation
  favoriteMessageIds?: string[]
  messages?: Message[]
  typing?: boolean
  settings?: ChatSettings
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  favoriteMessageIds: () => [],
  typing: false,
  settings: () => ({
    enterToSend: true,
    desktopNotify: true,
    messageSound: true,
    readReceipt: true,
    dnd: false,
    compactMode: false,
    autoArchiveDays: 30,
  }),
})

const emit = defineEmits<{
  send: [message: ChatSendPayload]
  typing: []
  stopTyping: []
  retryMessage: [message: Message]
  recallMessage: [message: Message]
  deleteMessage: [message: Message]
  copyMessage: [message: Message]
  previewImage: [url: string]
  downloadMessage: [message: Message]
  showUser: [user: UserInfo]
  toggleFavorite: [message: Message]
  reactionMessage: [message: Message, emoji: string]
  call: [type: 'voice' | 'video']
  togglePin: [conversation: Conversation]
  toggleMute: [conversation: Conversation]
  clearMessages: [conversation: Conversation]
  openGroupPanel: [tab: GroupPanelTab]
}>()

const messageListRef = ref<InstanceType<typeof MessageList>>()
const editorRef = ref<InstanceType<typeof MessageEditor>>()
const replyMessage = ref<Message | null>(null)
const editMessage = ref<Message | null>(null)

const headerActionItems = computed<MenuProps['items']>(() => [
  {
    key: 'pin',
    label: props.conversation?.pinned ? '取消置顶' : '置顶会话',
    icon: renderMenuIcon(
      props.conversation?.pinned ? 'i-lucide:pin-off' : 'i-lucide:pin'
    ),
  },
  {
    key: 'mute',
    label: props.conversation?.muted ? '取消免打扰' : '消息免打扰',
    icon: renderMenuIcon(
      props.conversation?.muted ? 'i-lucide:bell' : 'i-lucide:bell-off'
    ),
  },
  {
    type: 'divider',
  },
  {
    key: 'clear',
    label: '清空消息',
    danger: true,
    icon: renderMenuIcon('i-lucide:eraser'),
  },
])

const conversationStatus = computed(() => {
  if (props.typing) return '正在输入…'
  if (props.conversation?.type === 'group') {
    const count = props.conversation.groupInfo?.memberCount ?? 0
    return count > 0 ? `${count} 位成员` : '群聊'
  }
  return statusText(props.conversation?.userInfo?.status)
})

function handleSend(payload: ChatSendPayload) {
  emit('send', payload)
  clearComposeContext()
  nextTick(() => messageListRef.value?.scrollToBottom())
}

function handleRetry(message: Message) {
  emit('retryMessage', message)
}

function handleRecall(message: Message) {
  emit('recallMessage', message)
}

function handleReaction(message: Message, emoji: string) {
  emit('reactionMessage', message, emoji)
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

function handleReply(message: Message) {
  replyMessage.value = message
  editMessage.value = null
  nextTick(() => editorRef.value?.setReply())
}

function handleEdit(message: Message) {
  editMessage.value = message
  replyMessage.value = null
  nextTick(() => editorRef.value?.setEdit(message))
}

function clearComposeContext() {
  replyMessage.value = null
  editMessage.value = null
}

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 15 })
}

function handleHeaderAction({ key }: { key: string }) {
  if (!props.conversation) return

  switch (key) {
    case 'pin':
      emit('togglePin', props.conversation)
      break
    case 'mute':
      emit('toggleMute', props.conversation)
      break
    case 'clear':
      emit('clearMessages', props.conversation)
      break
  }
}
</script>

<style scoped>
.conversation-chip {
  display: inline-flex;
  gap: 3px;
  align-items: center;
  padding: 1px 5px;
  color: rgb(var(--w-text-secondary));
  background-color: rgb(var(--w-bg-fill-1));
  border-radius: 4px;
}

.conversation-content-enter-active,
.conversation-content-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-moderate) var(--w-motion-ease-enter);
}

.conversation-content-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.conversation-content-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .conversation-content-enter-active,
  .conversation-content-leave-active {
    transition-duration: 1ms;
  }
}
</style>
