<template>
  <div
    ref="containerRef"
    class="h-full overflow-y-auto px-15 py-15"
    @scroll="handleScroll"
  >
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <n-spin size="small" />
      <span class="ml-10 text-regular">加载中...</span>
    </div>

    <!-- Messages -->
    <div v-else class="flex flex-col gap-15">
      <div
        v-if="messages.length === 0"
        class="flex items-center justify-center h-full"
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

      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :is-mine="isMine(message.senderId)"
        @retry="$emit('retry', message)"
        @recall="$emit('recall', message)"
        @reaction="(emoji: string) => $emit('reaction', message, emoji)"
      />

      <!-- Scroll to bottom button -->
      <transition name="fade">
        <button
          v-if="showScrollButton"
          class="fixed bottom-180 right-100 p-8 rounded-full bg-white shadow-lg border-1 border-solid border-[#E8E8E8] text-regular hover:bg-[#f5f5f5] transition-all"
          title="滚动到底部"
          @click="scrollToBottom"
        >
          <Icon name="i-lucide:chevron-down" :size="18" />
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import MessageItem from './message-item.vue'
import type { Message, MessageListEmits } from '../../types'

interface Props {
  messages?: Message[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  loading: false,
})

const emit = defineEmits<MessageListEmits>()

const containerRef = ref<HTMLDivElement>()
const showScrollButton = ref(false)
const isAtBottom = ref(true)
const isAutoScrolling = ref(false)

const isMine = (senderId: string) => senderId === 'me'

function handleScroll(e: Event) {
  const target = e.target as HTMLDivElement
  const distanceToBottom =
    target.scrollHeight - target.scrollTop - target.clientHeight
  isAtBottom.value = distanceToBottom < 100
  showScrollButton.value = !isAtBottom.value && distanceToBottom > 500
}

function scrollToBottom() {
  if (containerRef.value && !isAutoScrolling.value) {
    isAutoScrolling.value = true
    containerRef.value.scrollTo({
      top: containerRef.value.scrollHeight,
      behavior: 'instant',
    })
    emit('scrollToBottom')
    // Reset flag after scroll completes
    setTimeout(() => {
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

watch(
  () => props.messages.length,
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
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
