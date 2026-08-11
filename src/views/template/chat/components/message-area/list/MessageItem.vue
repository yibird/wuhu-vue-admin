<template>
  <a-dropdown
    v-model:open="contextMenuOpen"
    :trigger="['contextmenu']"
    :menu="messageActionMenu"
  >
    <div
      class="group relative flex gap-10 px-2 py-2"
      :class="isMine ? 'flex-row-reverse' : 'flex-row'"
      :aria-label="`${message.senderInfo?.name ?? '未知用户'}的${message.type}消息`"
      @contextmenu.prevent.stop
    >
      <button
        type="button"
        class="button size-36 shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:(outline-2 outline-primary outline-offset-2)"
        :disabled="!message.senderInfo"
        :title="
          message.senderInfo
            ? `查看${message.senderInfo.name}资料`
            : '暂无用户资料'
        "
        :aria-label="
          message.senderInfo
            ? `查看${message.senderInfo.name}资料`
            : '暂无用户资料'
        "
        @click.stop="handleUserClick"
      >
        <a-avatar
          :src="message.senderInfo?.avatar || 'https://i.pravatar.cc/100?img=1'"
          :size="36"
          round
        />
      </button>

      <!-- Content -->
      <div
        class="max-w-[70%] flex flex-col gap-6"
        :class="isMine ? 'items-end' : 'items-start'"
      >
        <div v-if="!isMine" class="text-xs text-regular px-4">
          {{ message.senderInfo?.name }}
        </div>

        <div
          class="max-w-full rounded-12 px-12 py-8 break-words shadow-all-sm"
          :class="[
            isMine
              ? 'bg-primary text-white rounded-tr-2px'
              : 'bg-fill-quaternary text-main rounded-tl-2px',
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

        <div
          v-if="message.replyInfo"
          class="max-w-full rounded-6 border-l-3 border-primary bg-fill-quaternary px-8 py-6 text-left text-xs text-secondary"
        >
          <div class="mb-2 text-primary">
            {{ message.replyInfo.senderName }}
          </div>
          <div class="truncate">{{ message.replyInfo.content }}</div>
        </div>

        <div v-if="message.reactions?.length" class="flex flex-wrap gap-6 px-4">
          <div
            v-for="reaction in message.reactions"
            :key="reaction.emoji"
            class="flex items-center gap-2 rounded-full border-1 border-color-2 border-solid bg-container px-6 py-2 cursor-pointer transition-colors hover:bg-hover"
            @click="$emit('reaction', reaction.emoji)"
          >
            <span>{{ reaction.emoji }}</span>
            <span v-if="reaction.count > 1" class="text-xs text-regular">{{
              reaction.count
            }}</span>
          </div>
        </div>

        <div class="flex items-center gap-8 px-4">
          <span class="whitespace-nowrap text-xs text-regular">
            {{ message.timestamp }}
          </span>
          <span v-if="message.editedAt" class="text-xs text-secondary">
            已编辑
          </span>
          <button
            type="button"
            class="button relative size-22 rounded-full transition-[background-color,box-shadow,opacity,transform,color] duration-180 hover:(-translate-y-1 bg-warning-tint text-warning shadow-all-sm) focus-visible:(outline-2 outline-warning outline-offset-2) active:(translate-y-0 scale-92)"
            :class="[
              favorite
                ? 'bg-warning-tint text-warning opacity-100'
                : 'text-secondary opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            ]"
            :title="favorite ? '取消收藏' : '收藏消息'"
            :aria-label="favorite ? '取消收藏消息' : '收藏消息'"
            @click.stop="handleFavoriteToggle"
          >
            <Icon
              name="i-lucide:star"
              :size="12"
              :class="{ 'fill-current': favorite }"
            />
            <Transition name="favorite-pop">
              <span
                v-if="favoritePulse"
                class="pointer-events-none absolute -top-22 left-0 whitespace-nowrap rounded-full bg-warning-tint px-7 py-2 text-11px text-warning shadow-all-sm"
              >
                {{ favoritePulseText }}
              </span>
            </Transition>
          </button>
          <div v-if="isMine" class="flex items-center">
            <Icon
              v-if="message.status === 'sending'"
              name="i-lucide:loader-2"
              :size="12"
              class="text-regular animate-spin"
            />
            <Icon
              v-else-if="message.status === 'sent'"
              name="i-lucide:check"
              :size="12"
              class="text-regular"
            />
            <Icon
              v-else-if="message.status === 'read'"
              name="i-lucide:check-check"
              :size="12"
              class="text-primary"
            />
            <button
              v-else-if="message.status === 'failed'"
              type="button"
              class="button size-16 text-error"
              title="点击重试"
              aria-label="重新发送失败消息"
              @click="$emit('retry')"
            >
              <Icon name="i-lucide:alert-circle" :size="12" />
            </button>
          </div>
        </div>

        <div
          v-if="showEmojiPicker"
          class="absolute -top-72 z-3 rounded-8 border-1 border-color-2 border-solid bg-container p-8 shadow-all-md"
          :class="isMine ? 'right-0' : 'left-0'"
        >
          <div class="grid grid-cols-8 gap-4">
            <button
              v-for="emoji in quickEmojis"
              :key="emoji"
              type="button"
              class="button size-28 rounded-4 text-xl transition-[background-color,box-shadow,transform] duration-150 hover:(-translate-y-1 bg-hover shadow-all-sm) active:(translate-y-0 scale-92)"
              :aria-label="`回应${emoji}`"
              @click="handleReaction(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </a-dropdown>
</template>

<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import { computed, h, onBeforeUnmount, ref, shallowRef } from 'vue'
import { Icon } from '@/components'
import TextContent from './message/Text.vue'
import ImageContent from './message/Image.vue'
import EmojiContent from './message/Emoji.vue'
import VoiceContent from './message/Voice.vue'
import FileContent from './message/File.vue'
import CustomContent from './message/Custom.vue'
import type { Message, MessageItemEmits } from '../../types'

interface Props {
  favorite?: boolean
  message: Message
  isMine: boolean
}

const props = withDefaults(defineProps<Props>(), {
  favorite: false,
})

const emit = defineEmits<MessageItemEmits>()

const isPlaying = ref(false)
const showEmojiPicker = ref(false)
const contextMenuOpen = ref(false)
const favoritePulse = shallowRef(false)
const favoritePulseText = shallowRef('')
let favoritePulseTimer: number | undefined

const quickEmojis = ['👍', '❤️', '😊', '😂', '🎉', '🤔', '😢', '🙏']

const messageActionItems = computed<MenuProps['items']>(() => {
  const items: MenuProps['items'] = [
    {
      key: 'reply',
      label: '回复',
      icon: renderMenuIcon('i-lucide:reply'),
    },
    {
      key: 'copy',
      label: '复制',
      icon: renderMenuIcon('i-lucide:copy'),
    },
    {
      key: 'favorite',
      label: props.favorite ? '取消收藏' : '收藏消息',
      icon: renderMenuIcon(
        props.favorite ? 'i-lucide:star-off' : 'i-lucide:star'
      ),
    },
    {
      key: 'reaction',
      label: '添加表情',
      icon: renderMenuIcon('i-lucide:smile'),
    },
  ]

  if (props.message.type === 'file') {
    items.push({
      key: 'download',
      label: '下载文件',
      icon: renderMenuIcon('i-lucide:download'),
    })
  }

  if (props.isMine && props.message.type === 'text') {
    items.push({
      key: 'edit',
      label: '编辑',
      icon: renderMenuIcon('i-lucide:pencil'),
    })
  }

  if (props.isMine) {
    items.push(
      {
        key: 'recall',
        label: '撤回',
        icon: renderMenuIcon('i-lucide:undo-2'),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
        icon: renderMenuIcon('i-lucide:trash-2'),
      }
    )
  }

  return items
})

const messageActionMenu = computed(() => ({
  items: messageActionItems.value,
  onClick: ({ key }: { key: string }) => handleAction(key),
}))

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 15 })
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function handleDownload() {
  emit('download')
}

function previewImage(url: string) {
  emit('previewImage', url)
}

function handleUserClick() {
  if (!props.message.senderInfo) return
  emit('showUser', props.message.senderInfo)
}

function handleReaction(emoji: string) {
  showEmojiPicker.value = false
  emit('reaction', emoji)
}

function handleFavoriteToggle() {
  favoritePulseText.value = props.favorite ? '已取消' : '已收藏'
  favoritePulse.value = true
  if (favoritePulseTimer) window.clearTimeout(favoritePulseTimer)
  favoritePulseTimer = window.setTimeout(() => {
    favoritePulse.value = false
    favoritePulseTimer = undefined
  }, 900)
  emit('favorite')
}

function handleAction(key: string) {
  contextMenuOpen.value = false

  switch (key) {
    case 'reply':
      emit('reply')
      break
    case 'copy':
      emit('copy')
      break
    case 'favorite':
      handleFavoriteToggle()
      break
    case 'reaction':
      showEmojiPicker.value = true
      break
    case 'download':
      handleDownload()
      break
    case 'edit':
      emit('edit')
      break
    case 'recall':
      emit('recall')
      break
    case 'delete':
      emit('delete')
      break
  }
}

onBeforeUnmount(() => {
  if (favoritePulseTimer) window.clearTimeout(favoritePulseTimer)
})
</script>

<style scoped>
.favorite-pop-enter-active,
.favorite-pop-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.favorite-pop-enter-from,
.favorite-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.9);
}

.favorite-pop-enter-to,
.favorite-pop-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
