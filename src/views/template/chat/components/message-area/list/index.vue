<template>
  <div class="relative px-10 h-full">
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
        :estimate-size="estimateMessageRowSize"
        :get-item-key="getMessageRowKey"
        @scroll="handleScroll"
      >
        <template #default="{ item }">
          <MessageItem
            v-if="item.type === 'message'"
            :favorite="favoriteIdSet.has(item.message.id)"
            :message="item.message"
            :is-mine="isMine(item.message.senderId)"
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
            <a-avatar
              :size="36"
              round
              fallback-src="https://i.pravatar.cc/100?img=1"
            />
            <div
              class="typing-bubble rounded-12 rounded-tl-2px bg-fill-quaternary px-13 py-10 shadow-all-sm"
            >
              <span />
              <span />
              <span />
            </div>
          </div>
        </template>

        <template #empty>
          <div class="min-h-360 flex h-full items-center justify-center">
            <div class="text-center text-regular">
              <Icon
                name="i-lucide:message-square"
                :size="40"
                class="mb-10 opacity-50"
              />
              <div>暂无消息</div>
            </div>
          </div>
        </template>
      </VirtualList>

      <transition name="fade">
        <button
          v-if="showUnreadBar"
          type="button"
          class="button absolute right-16 top-10 z-10 flex items-center gap-4 rounded-full border-1 border-color-1 border-solid bg-container py-4 pl-8 pr-11 text-xs text-primary shadow-all-md transition-colors hover:bg-hover"
          title="定位到第一条未读消息"
          aria-label="定位到第一条未读消息"
          @click="scrollToFirstUnread"
        >
          <Icon name="i-lucide:arrow-down" :size="13" />
          {{ unreadCount }} 条未读消息
        </button>
      </transition>

      <transition name="fade">
        <button
          v-if="showScrollButton"
          type="button"
          class="button fixed bottom-180 right-100 z-10 size-34 rounded-full border-1 border-color-1 border-solid bg-container text-secondary shadow-all-md transition-colors hover:(bg-hover text-primary)"
          title="滚动到底部"
          aria-label="滚动到底部"
          @click="scrollToBottom"
        >
          <Icon name="i-lucide:chevron-down" :size="18" />
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageItem from './message-item.vue'
import { VirtualList } from '../../common'
import type { Message, MessageListEmits } from '../../types'

interface Props {
  messages?: Message[]
  loading?: boolean
  typing?: boolean
  compact?: boolean
  favoriteMessageIds?: string[]
  unreadCount?: number
}

type MessageListItem =
  | { type: 'message'; message: Message }
  | { type: 'typing'; id: 'typing-indicator' }

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
})

const emit = defineEmits<MessageListEmits>()

const virtualListRef = ref<VirtualListExpose | null>(null)
const showScrollButton = ref(false)
const isAtBottom = ref(true)
const isAutoScrolling = ref(false)
let scrollResetTimer: number | undefined
/**
 * 进入会话时的第一条未读消息 id
 *
 * 用 id 而不是下标固定:会话打开后新增的消息会让「最后 N 条」的区间漂移
 */
const firstUnreadId = shallowRef('')
/** 未读条是否已被消费,点击后隐藏 */
const unreadDismissed = shallowRef(false)

if (props.unreadCount > 0 && props.messages.length > 0) {
  const index = Math.max(0, props.messages.length - props.unreadCount)
  firstUnreadId.value = props.messages[index]?.id ?? ''
}

const showUnreadBar = computed(
  () =>
    props.unreadCount > 0 &&
    Boolean(firstUnreadId.value) &&
    !unreadDismissed.value
)
const favoriteIdSet = computed(() => new Set(props.favoriteMessageIds))
const renderedItems = computed<MessageListItem[]>(() => {
  const items: MessageListItem[] = props.messages.map((message) => ({
    type: 'message',
    message,
  }))
  if (props.typing) items.push({ type: 'typing', id: 'typing-indicator' })
  return items
})

function estimateMessageRowSize(item: MessageListItem) {
  return item.type === 'typing' ? 58 : props.compact ? 72 : 92
}

function getMessageRowKey(item: MessageListItem) {
  return item.type === 'typing' ? item.id : item.message.id
}

const isMine = (senderId: string) => senderId === 'me'

function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  const distanceToBottom =
    target.scrollHeight - target.scrollTop - target.clientHeight
  isAtBottom.value = distanceToBottom < 100
  showScrollButton.value = !isAtBottom.value && distanceToBottom > 500
}

function scrollToBottom() {
  const container = virtualListRef.value?.getScrollElement()
  if (container && !isAutoScrolling.value) {
    isAutoScrolling.value = true
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
    emit('scrollToBottom')
    window.clearTimeout(scrollResetTimer)
    scrollResetTimer = window.setTimeout(() => {
      isAutoScrolling.value = false
    }, 100)
  }
}

function scrollToFirstUnread() {
  const index = renderedItems.value.findIndex(
    (item) => item.type === 'message' && item.message.id === firstUnreadId.value
  )
  if (index < 0) return

  unreadDismissed.value = true
  virtualListRef.value?.scrollToIndex(index)
  emit('unreadClear')
}

function scrollToNewMessage() {
  nextTick(() => {
    if (isAtBottom.value && !isAutoScrolling.value) {
      scrollToBottom()
    }
  })
}

onMounted(() => {
  nextTick(scrollToBottom)
})

onBeforeUnmount(() => {
  window.clearTimeout(scrollResetTimer)
})

watch(
  () => props.messages.length,
  () => {
    scrollToNewMessage()
  }
)

watch(
  () => props.typing,
  () => {
    scrollToNewMessage()
  }
)

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
