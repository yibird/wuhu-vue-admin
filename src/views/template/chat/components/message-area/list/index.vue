<template>
  <Scrollbar
    ref="containerRef"
    class="h-full"
    content-class="min-h-full h-full p-15"
    @scroll="handleScroll"
  >
    <div v-if="loading" class="flex items-center justify-center py-20">
      <a-spin size="small" />
      <span class="ml-10 text-regular">加载中…</span>
    </div>

    <div v-else class="min-h-full h-full flex flex-col">
      <div
        v-if="messages.length === 0"
        class="min-h-360 flex flex-1 items-center justify-center"
      >
        <div class="text-center text-regular">
          <Icon
            name="i-lucide:message-square"
            :size="40"
            class="mb-10 opacity-50"
          />
          <div>暂无消息</div>
        </div>
      </div>

      <TransitionGroup
        v-else
        tag="div"
        name="message-list"
        class="min-h-full flex flex-1 flex-col"
        :class="compact ? 'gap-8' : 'gap-15'"
      >
        <MessageItem
          v-for="message in messages"
          :key="message.id"
          :favorite="favoriteIdSet.has(message.id)"
          :message="message"
          :is-mine="isMine(message.senderId)"
          @retry="$emit('retry', message)"
          @recall="$emit('recall', message)"
          @delete="$emit('delete', message)"
          @copy="$emit('copy', message)"
          @reply="$emit('reply', message)"
          @edit="$emit('edit', message)"
          @favorite="$emit('favorite', message)"
          @reaction="(emoji: string) => $emit('reaction', message, emoji)"
          @preview-image="(url: string) => $emit('previewImage', url)"
          @download="$emit('download', message)"
          @show-user="(user) => $emit('showUser', user)"
        />

        <div
          v-if="typing"
          key="typing-indicator"
          class="flex items-center gap-10 px-2 py-2"
        >
          <a-avatar
            :size="36"
            round
            fallback-src="https://i.pravatar.cc/100?img=1"
          />
          <div
            class="typing-bubble rounded-12 rounded-tl-2px bg-fill-quaternary px-13 py-10 shadow-all-sm"
            aria-live="polite"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </TransitionGroup>

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
  </Scrollbar>
</template>

<script setup lang="ts">
import MessageItem from './MessageItem.vue'
import type { Message, MessageListEmits } from '../../types'
import type { ScrollbarInstance } from '@/components/scrollbar'

interface Props {
  messages?: Message[]
  loading?: boolean
  typing?: boolean
  compact?: boolean
  favoriteMessageIds?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  loading: false,
  typing: false,
  compact: false,
  favoriteMessageIds: () => [],
})

const emit = defineEmits<MessageListEmits>()

const containerRef = ref<ScrollbarInstance | null>()
const showScrollButton = ref(false)
const isAtBottom = ref(true)
const isAutoScrolling = ref(false)
let scrollResetTimer: number | undefined
const favoriteIdSet = computed(() => new Set(props.favoriteMessageIds))

const isMine = (senderId: string) => senderId === 'me'

function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  const distanceToBottom =
    target.scrollHeight - target.scrollTop - target.clientHeight
  isAtBottom.value = distanceToBottom < 100
  showScrollButton.value = !isAtBottom.value && distanceToBottom > 500
}

function scrollToBottom() {
  const container = containerRef.value?.getScrollElement()
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

function scrollToNewMessage() {
  nextTick(() => {
    if (containerRef.value && isAtBottom.value && !isAutoScrolling.value) {
      scrollToBottom()
    }
  })
}

onMounted(() => {
  scrollToBottom()
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--w-motion-duration-base)
    var(--w-motion-ease-standard);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.message-list-enter-active,
.message-list-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.message-list-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}

.message-list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.message-list-move {
  transition: transform var(--w-motion-duration-base)
    var(--w-motion-ease-standard);
}

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
  animation: typing-bounce 1s ease-in-out infinite;
}

.typing-bubble span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: 0.3s;
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
  .message-list-enter-active,
  .message-list-leave-active,
  .message-list-move,
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 1ms;
  }

  .typing-bubble span {
    animation: none;
  }
}
</style>
