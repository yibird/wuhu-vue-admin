<template>
  <div class="p-10 w-300">
    <!-- Search -->
    <div class="mb-10">
      <a-input v-model:value="searchValue" placeholder="搜索表情" allow-clear>
        <template #prefix>
          <Icon name="i-lucide:search" :size="14" class="text-regular" />
        </template>
      </a-input>
    </div>

    <!-- Tabs -->
    <div
      class="mb-10 flex gap-5 border-b-1 border-b-solid border-color-1 pb-10"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-10 py-6 text-sm rounded-4 cursor-pointer transition-colors"
        :class="[
          activeTab === tab.key
            ? 'bg-primary/10 text-primary'
            : 'text-regular hover:bg-hover',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Emoji grid -->
    <Scrollbar class="max-h-200">
      <!-- Recently used -->
      <div v-if="activeTab === 'recent' && recentEmojis.length > 0">
        <div class="mb-10">
          <div class="text-xs text-regular mb-8">最近使用</div>
          <div class="grid grid-cols-6 gap-4">
            <button
              v-for="emoji in recentEmojis"
              :key="emoji"
              class="size-40 flex items-center justify-center text-lg rounded-4 cursor-pointer hover:bg-hover transition-colors"
              @click="handleSelect(emoji)"
            >
              <span>{{ emoji }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Smileys -->
      <div v-if="activeTab === 'smileys'">
        <div class="mb-10">
          <div class="text-xs text-regular mb-8">笑脸</div>
          <div class="grid grid-cols-6 gap-4">
            <button
              v-for="emoji in smileyEmojis"
              :key="emoji"
              class="size-40 flex items-center justify-center text-lg rounded-4 cursor-pointer hover:bg-hover transition-colors"
              @click="handleSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Gestures -->
      <div v-if="activeTab === 'gestures'">
        <div class="mb-10">
          <div class="text-xs text-regular mb-8">手势</div>
          <div class="grid grid-cols-6 gap-4">
            <button
              v-for="emoji in gestureEmojis"
              :key="emoji"
              class="size-40 flex items-center justify-center text-lg rounded-4 cursor-pointer hover:bg-hover transition-colors"
              @click="handleSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Objects -->
      <div v-if="activeTab === 'objects'">
        <div class="mb-10">
          <div class="text-xs text-regular mb-8">物品</div>
          <div class="grid grid-cols-6 gap-4">
            <button
              v-for="emoji in objectEmojis"
              :key="emoji"
              class="size-40 flex items-center justify-center text-lg rounded-4 cursor-pointer hover:bg-hover transition-colors"
              @click="handleSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Symbols -->
      <div v-if="activeTab === 'symbols'">
        <div class="mb-10">
          <div class="text-xs text-regular mb-8">符号</div>
          <div class="grid grid-cols-6 gap-4">
            <button
              v-for="emoji in symbolEmojis"
              :key="emoji"
              class="size-40 flex items-center justify-center text-lg rounded-4 cursor-pointer hover:bg-hover transition-colors"
              @click="handleSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Search results -->
      <div v-if="searchValue && filteredEmojis.length > 0">
        <div class="mb-10">
          <div class="text-xs text-regular mb-8">搜索结果</div>
          <div class="grid grid-cols-6 gap-4">
            <button
              v-for="emoji in filteredEmojis"
              :key="emoji"
              class="size-40 flex items-center justify-center text-lg rounded-4 cursor-pointer hover:bg-hover transition-colors"
              @click="handleSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="searchValue && filteredEmojis.length === 0"
        class="text-center text-regular py-20"
      >
        未找到表情
      </div>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import type { EmojiPickerEmits } from '../../types'

const emit = defineEmits<EmojiPickerEmits>()

const searchValue = ref('')
const activeTab = ref('smileys')

const tabs = [
  { key: 'recent', label: '最近' },
  { key: 'smileys', label: '笑脸' },
  { key: 'gestures', label: '手势' },
  { key: 'objects', label: '物品' },
  { key: 'symbols', label: '符号' },
]

const recentEmojis = ref<string[]>(['👍', '❤️', '😊', '😂', '🎉'])

const smileyEmojis = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😊',
  '😇',
  '🥰',
  '😍',
  '🤩',
  '😘',
  '😗',
  '😚',
  '😙',
  '🥲',
  '😋',
  '😛',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🤫',
  '🤔',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😌',
  '😔',
  '😪',
  '🤤',
  '😴',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
  '🥴',
  '😵',
  '🤯',
  '🤠',
  '🥳',
  '🥸',
  '😎',
  '🤓',
  '🧐',
  '😕',
]

const gestureEmojis = [
  '👋',
  '🤚',
  '🖐️',
  '✋',
  '🖖',
  '👌',
  '🤌',
  '🤏',
  '✌️',
  '🤞',
  '🤟',
  '🤘',
  '🤙',
  '👈',
  '👉',
  '👆',
  '🖕',
  '👇',
  '☝️',
  '👍',
  '👎',
  '✊',
  '👊',
  '🤛',
  '🤜',
  '👏',
  '🙌',
  '👐',
  '🤲',
  '🤝',
  '🙏',
  '✍️',
  '💅',
  '🤳',
  '💪',
  '🦾',
  '🦿',
  '🦵',
  '🦶',
  '👂',
  '🦻',
  '👃',
  '🧠',
  '🫀',
  '🫁',
  '🦷',
  '🦴',
  '👀',
  '👁️',
  '👅',
  '👄',
  '👶',
  '🧒',
  '👦',
  '👧',
  '🧑',
  '👱',
  '👨',
  '🧔',
  '👩',
  '🧓',
  '👴',
  '👵',
  '🙍',
]

const objectEmojis = [
  '⌚',
  '📱',
  '💻',
  '⌨️',
  '🖥️',
  '🖨️',
  '🖱️',
  '🖲️',
  '💾',
  '💿',
  '📀',
  '📼',
  '📷',
  '📸',
  '📹',
  '🎥',
  '📽️',
  '🎞️',
  '📞',
  '☎️',
  '📟',
  '📠',
  '📺',
  '📻',
  '🎙️',
  '🎚️',
  '🎛️',
  '🧭',
  '⏱️',
  '⏲️',
  '⏰',
  '🕰️',
  '⌛',
  '⏳',
  '📡',
  '🔋',
  '🔌',
  '💡',
  '🔒',
  '🔓',
  '🔐',
  '🔏',
  '🗝️',
  '🔑',
  '🗄️',
  '🔖',
  '📎',
  '🔗',
  '📁',
  '📂',
  '📃',
  '📄',
  '📅',
  '📆',
  '📇',
  '📈',
  '📉',
  '📊',
  '📋',
  '📌',
  '📍',
  '📎',
  '🗑️',
  '📏',
]

const symbolEmojis = [
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '🤍',
  '🤎',
  '💔',
  '❣️',
  '💕',
  '💞',
  '💓',
  '💗',
  '💖',
  '💘',
  '💝',
  '💟',
  '☮️',
  '✝️',
  '☪️',
  '🕉️',
  '☸️',
  '✡️',
  '🔯',
  '🕎',
  '☯️',
  '☦️',
  '🛐',
  '⛎',
  '♈',
  '♉',
  '♊',
  '♋',
  '♌',
  '♍',
  '♎',
  '♏',
  '♐',
  '♑',
  '♒',
  '♓',
  '🆔',
  '⚛️',
  '🉑',
  '☢️',
  '☣️',
  '📴',
  '📳',
  '🈶',
  '🈚',
  '🈸',
  '🈺',
  '🈷️',
  '✴️',
  '🆚',
  '💮',
  '🉐',
  '㊙️',
  '㊗️',
  '🈴',
  '🈵',
  '🈹',
]

const allEmojis = computed(() => [
  ...smileyEmojis,
  ...gestureEmojis,
  ...objectEmojis,
  ...symbolEmojis,
])

const filteredEmojis = computed(() => {
  if (!searchValue.value) return []
  const keyword = searchValue.value.toLowerCase()
  return allEmojis.value.filter((emoji) => emoji.includes(keyword))
})

function handleSelect(emoji: string) {
  // Add to recent
  const recent = recentEmojis.value
  const index = recent.indexOf(emoji)
  if (index > -1) {
    recent.splice(index, 1)
  }
  recent.unshift(emoji)
  if (recent.length > 10) {
    recent.pop()
  }

  emit('select', emoji)
}
</script>
