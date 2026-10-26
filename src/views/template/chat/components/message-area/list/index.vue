<template>
  <div class="relative h-full">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <a-spin size="small" />
      <span class="ml-10 text-regular">加载中…</span>
    </div>

    <div v-else class="min-h-full h-full flex flex-col">
      <VirtualList
        ref="virtualListRef"
        class="min-h-0 flex-1"
        aria-label="消息列表"
        :items="renderedItems"
        :estimate-size="estimateRowSize"
        :get-item-key="getRowKey"
        @scroll="handleScroll"
      >
        <template #default="{ item }">
          <MessageItem
            v-if="item.type === 'message'"
            :favorite="favoriteIdSet.has(item.message.id)"
            :message="item.message"
            :is-mine="isMine(item.message.senderId)"
            :show-avatar="showAvatar"
            :show-timestamp="showTimestamp"
            @retry="$emit('retry', item.message)"
            @recall="$emit('recall', item.message)"
            @delete="$emit('delete', item.message)"
            @copy="$emit('copy', item.message)"
            @reply="$emit('reply', item.message)"
            @edit="$emit('edit', item.message)"
            @favorite="$emit('favorite', item.message)"
            @reaction="
              (emoji: string) => $emit('reaction', item.message, emoji)
            "
            @preview-image="(url: string) => $emit('previewImage', url)"
            @download="$emit('download', item.message)"
            @show-user="(user) => $emit('showUser', user)"
          />
          <div
            v-else
            class="flex items-center gap-10 px-2 py-2"
            aria-live="polite"
          >
            <a-avatar :size="36" round />
            <div
              class="typing-bubble rounded-12 rounded-tl-2px bg-secondary px-13 py-10 shadow-all-sm"
            >
              <span />
              <span />
              <span />
            </div>
          </div>
        </template>
        <template #empty>
          <Empty />
        </template>
      </VirtualList>

      <Unread
        :show="showUnread"
        :count="unreadCount"
        @locate="scrollToFirstUnread"
      />
      <ScrollToBottom :show="showScrollButton" @click="scrollToBottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageItem from './message-item.vue'
import { Empty, ScrollToBottom, Unread } from './components'
import { useMessageList } from './hooks'
import { VirtualList } from '../../common'
import type { Message, MessageListEmits } from '../../types'

interface Props {
  messages?: Message[]
  loading?: boolean
  typing?: boolean
  compact?: boolean
  favoriteMessageIds?: string[]
  unreadCount?: number
  showAvatar?: boolean
  showTimestamp?: boolean
}

interface VirtualListExpose {
  getScrollElement: () => HTMLElement | null
  scrollToIndex: (index: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  loading: false,
  typing: false,
  compact: false,
  favoriteMessageIds: () => [],
  unreadCount: 0,
  showAvatar: true,
  showTimestamp: true,
})

const emits = defineEmits<MessageListEmits>()

const virtualListRef = ref<VirtualListExpose | null>(null)
const favoriteIdSet = computed(() => new Set(props.favoriteMessageIds))

const {
  renderedItems,
  showUnread,
  showScrollButton,
  estimateRowSize,
  getRowKey,
  handleScroll,
  scrollToBottom,
  scrollToFirstUnread,
} = useMessageList({
  messages: () => props.messages,
  unreadCount: () => props.unreadCount,
  typing: () => props.typing,
  compact: () => props.compact,
  getScrollElement: () => virtualListRef.value?.getScrollElement() ?? null,
  scrollToIndex: (index) => virtualListRef.value?.scrollToIndex(index),
  onScrollToBottom: () => emits('scrollToBottom'),
  onUnreadClear: () => emits('unreadClear'),
})

const isMine = (senderId: string) => senderId === 'me'

defineExpose({
  scrollToBottom,
})
</script>

<style scoped>
.typing-bubble {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.typing-bubble span {
  width: 5px;
  height: 5px;
  background-color: rgb(var(--w-text-secondary));
  border-radius: 50%;
  animation: typing-bounce var(--w-motion-duration-loop-fast)
    var(--w-motion-ease-standard) infinite;
}

.typing-bubble span:nth-child(2) {
  animation-delay: var(--w-motion-delay-stagger);
}

.typing-bubble span:nth-child(3) {
  animation-delay: var(--w-motion-delay-stagger-long);
}

@keyframes typing-bounce {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing-bubble span {
    animation: none;
  }
}
</style>
