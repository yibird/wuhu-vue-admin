<template>
  <div class="flex gap-10" :class="isMine ? 'flex-row-reverse' : 'flex-row'">
    <!-- Avatar -->
    <n-avatar
      :src="message.senderInfo?.avatar || 'https://i.pravatar.cc/100?img=1'"
      :size="36"
      round
      class="shrink-0"
    />

    <!-- Content -->
    <div
      class="max-w-[70%] flex flex-col gap-6"
      :class="isMine ? 'items-end' : 'items-start'"
    >
      <!-- Sender name (for group) -->
      <div v-if="!isMine" class="text-xs text-regular px-4">
        {{ message.senderInfo?.name }}
      </div>

      <!-- Message bubble -->
      <div
        class="px-12 py-8 rounded-12 break-words"
        :class="[
          isMine
            ? 'bg-primary text-white rounded-tr-2px'
            : 'bg-[#f5f5f5] text-main rounded-tl-2px',
        ]"
      >
        <TextContent
          v-if="message.type === 'text'"
          :content="message.content"
        />
        <ImageContent
          v-else-if="message.type === 'image'"
          :content="message.content"
          @preview="previewImage"
        />
        <EmojiContent
          v-else-if="message.type === 'emoji'"
          :content="message.content"
        />
        <VoiceContent
          v-else-if="message.type === 'voice'"
          :content="message.content"
          :is-playing="isPlaying"
          @toggle-play="togglePlay"
        />
        <FileContent
          v-else-if="message.type === 'file'"
          :content="message.content"
          @download="handleDownload"
        />
        <CustomContent v-else :content="message.content" />
      </div>

      <!-- Reactions -->
      <div v-if="message.reactions?.length" class="flex flex-wrap gap-6 px-4">
        <div
          v-for="reaction in message.reactions"
          :key="reaction.emoji"
          class="flex items-center gap-2 px-6 py-2 bg-white rounded-full border-1 border-solid border-[#e8e8e8] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
          @click="$emit('reaction', reaction.emoji)"
        >
          <span>{{ reaction.emoji }}</span>
          <span v-if="reaction.count > 1" class="text-xs text-regular">{{
            reaction.count
          }}</span>
        </div>
      </div>

      <!-- Time and status -->
      <div class="flex items-center gap-8 px-4">
        <span class="text-xs text-regular">{{ message.timestamp }}</span>
        <div v-if="isMine" class="flex items-center">
          <!-- Sending -->
          <Icon
            v-if="message.status === 'sending'"
            name="i-lucide:loader-2"
            :size="12"
            class="text-regular animate-spin"
          />
          <!-- Sent -->
          <Icon
            v-else-if="message.status === 'sent'"
            name="i-lucide:check"
            :size="12"
            class="text-regular"
          />
          <!-- Read -->
          <Icon
            v-else-if="message.status === 'read'"
            name="i-lucide:check-check"
            :size="12"
            class="text-primary"
          />
          <!-- Failed -->
          <button
            v-else-if="message.status === 'failed'"
            class="text-error"
            title="点击重试"
            @click="$emit('retry')"
          >
            <Icon name="i-lucide:alert-circle" :size="12" />
          </button>
        </div>
      </div>

      <!-- Actions menu -->
      <div
        v-if="showActions"
        class="absolute -top-30 flex items-center gap-2 px-8 py-4 bg-white rounded-full shadow-lg border-1 border-solid border-[#e8e8e8]"
        :class="isMine ? 'right-0' : 'left-0'"
      >
        <button
          class="p-6 rounded-4 hover:bg-[#f5f5f5] text-regular"
          title="回复"
          @click="handleReply"
        >
          <Icon name="i-lucide:reply" :size="14" />
        </button>
        <button
          class="p-6 rounded-4 hover:bg-[#f5f5f5] text-regular"
          title="表情"
          @click="showEmojiPicker = !showEmojiPicker"
        >
          <Icon name="i-lucide:smile" :size="14" />
        </button>
        <button
          v-if="isMine"
          class="p-6 rounded-4 hover:bg-[#f5f5f5] text-regular"
          title="撤回"
          @click="$emit('recall')"
        >
          <Icon name="i-lucide:undo-2" :size="14" />
        </button>
        <button
          v-if="isMine"
          class="p-6 rounded-4 hover:bg-[#f5f5f5] text-error"
          title="删除"
          @click="handleDelete"
        >
          <Icon name="i-lucide:trash-2" :size="14" />
        </button>
      </div>

      <!-- Emoji picker popup -->
      <div
        v-if="showEmojiPicker"
        class="absolute -top-60 p-8 bg-white rounded-lg shadow-lg border-1 border-solid border-[#e8e8e8]"
      >
        <div class="grid grid-cols-8 gap-4">
          <button
            v-for="emoji in quickEmojis"
            :key="emoji"
            class="p-4 text-xl rounded-4 hover:bg-[#f5f5f5] transition-colors"
            @click="handleReaction(emoji)"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, MessageItemEmits } from '../types'
import TextContent from './text.vue'
import ImageContent from './image.vue'
import EmojiContent from './emoji.vue'
import VoiceContent from './voice.vue'
import FileContent from './file.vue'
import CustomContent from './custom.vue'

interface Props {
  message: Message
  isMine: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<MessageItemEmits>()

const isPlaying = ref(false)
const showActions = ref(false)
const showEmojiPicker = ref(false)

const quickEmojis = ['👍', '❤️', '😊', '😂', '🎉', '🤔', '😢', '🙏']

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function previewImage(url: string) {
  console.log('preview image:', url)
}

function handleReply() {
  showActions.value = false
}

function handleDelete() {
  showActions.value = false
}

function handleDownload() {
  console.log('download file')
}

function handleReaction(emoji: string) {
  showEmojiPicker.value = false
  showActions.value = false
  emit('reaction', emoji)
}
</script>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
</style>
