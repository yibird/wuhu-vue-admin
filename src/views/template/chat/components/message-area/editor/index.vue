<template>
  <div class="p-15">
    <!-- Image preview list -->
    <div
      v-if="imageList.length > 0"
      class="mb-10 flex items-center gap-8 flex-wrap"
    >
      <div
        v-for="(img, index) in imageList"
        :key="img"
        class="relative w-60 h-60 rounded-6 overflow-hidden border-1 border-solid border-[#e8e8e8]"
      >
        <img :src="img" class="w-full h-full object-cover" />
        <button
          class="absolute top-2 right-2 w-16 h-16 flex items-center justify-center bg-[#000]/50 rounded-full text-white hover:bg-[#000]/70 transition-colors"
          @click="removeImage(index)"
        >
          <Icon name="i-lucide:x" :size="12" />
        </button>
      </div>
    </div>

    <!-- Reply preview -->
    <div
      v-if="replyMessage"
      class="mb-10 p-10 bg-[#f5f5f5] rounded-6 border-l-4 border-primary"
    >
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs text-primary mb-2">
            回复 {{ replyMessage.senderInfo?.name }}
          </div>
          <div class="text-sm text-regular truncate">
            {{ replyMessage.content }}
          </div>
        </div>
        <button
          class="p-4 hover:bg-[#e8e8e8] rounded-4 text-regular"
          @click="cancelReply"
        >
          <Icon name="i-lucide:x" :size="14" />
        </button>
      </div>
    </div>

    <!-- Voice recording UI -->
    <div v-if="isRecording" class="mb-10 p-15 bg-[#f5f5f5] rounded-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-10">
          <div class="w-8 h-8 rounded-full bg-error animate-pulse" />
          <span class="text-sm text-regular"
            >正在录音... {{ recordingDuration }}s</span
          >
        </div>
        <div class="flex items-center gap-10">
          <button
            class="px-15 py-6 rounded-4 text-sm text-regular hover:bg-[#e8e8e8] transition-colors"
            @click="cancelRecording"
          >
            取消
          </button>
          <button
            class="px-15 py-6 rounded-4 text-sm bg-error text-white hover:bg-error/90 transition-colors"
            @click="stopRecording"
          >
            停止
          </button>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="flex items-end gap-10">
      <!-- Left actions -->
      <div class="flex items-center gap-6 shrink-0">
        <n-popover
          v-model:show="showEmojiPicker"
          :show-arrow="false"
          placement="top-start"
          trigger="click"
        >
          <template #trigger>
            <button
              class="p-8 rounded-4 hover:bg-[#f5f5f5] text-regular"
              title="表情"
            >
              <Icon name="i-lucide:smile" :size="20" />
            </button>
          </template>
          <EmojiPicker @select="handleEmojiSelect" />
        </n-popover>

        <n-popover
          v-model:show="showImageMenu"
          :show-arrow="false"
          placement="top-start"
          trigger="click"
        >
          <template #trigger>
            <button
              class="p-8 rounded-4 hover:bg-[#f5f5f5] text-regular"
              title="图片"
            >
              <Icon name="i-lucide:image" :size="20" />
            </button>
          </template>
          <div class="p-10 w-200">
            <button
              class="w-full p-8 rounded-4 text-sm text-left hover:bg-[#f5f5f5] transition-colors flex items-center gap-8"
              @click="triggerFileInput('image')"
            >
              <Icon name="i-lucide:image" :size="16" />
              <span>选择图片</span>
            </button>
            <button
              class="w-full p-8 rounded-4 text-sm text-left hover:bg-[#f5f5f5] transition-colors flex items-center gap-8"
              @click="triggerFileInput('file')"
            >
              <Icon name="i-lucide:file" :size="16" />
              <span>选择文件</span>
            </button>
          </div>
        </n-popover>

        <button
          class="p-8 rounded-4 hover:bg-[#f5f5f5]"
          :class="isRecording ? 'text-error bg-[#fee]' : 'text-regular'"
          title="语音"
          @click="toggleRecording"
        >
          <Icon name="i-lucide:mic" :size="20" />
        </button>
      </div>

      <!-- Text input -->
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          class="w-full min-h-36 max-h-100 px-12 py-8 border-1 border-solid border-[#e8e8e8] rounded-12 resize-none outline-none focus:border-primary transition-colors text-sm"
          :placeholder="placeholder"
          :disabled="disabled"
          rows="1"
          @keydown.enter.exact.prevent="handleSend"
          @input="autoResize"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-6 shrink-0">
        <n-popover
          v-model:show="showExtensionMenu"
          :show-arrow="false"
          placement="top-end"
          trigger="click"
        >
          <template #trigger>
            <button
              class="p-8 rounded-4 hover:bg-[#f5f5f5] text-regular"
              title="更多"
            >
              <Icon name="i-lucide:plus-circle" :size="20" />
            </button>
          </template>
          <div class="p-10 w-200">
            <button
              v-for="ext in extensions"
              :key="ext.icon"
              class="w-full p-8 rounded-4 text-sm text-left hover:bg-[#f5f5f5] transition-colors flex items-center gap-8"
              @click="handleExtensionClick(ext)"
            >
              <Icon :name="ext.icon" :size="16" />
              <span>{{ ext.label }}</span>
            </button>
          </div>
        </n-popover>

        <n-button type="primary" :disabled="!canSend" @click="handleSend">
          <template #icon>
            <Icon name="i-lucide:send" :size="16" />
          </template>
          发送
        </n-button>
      </div>
    </div>

    <!-- Hidden file inputs -->
    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageSelect"
    />
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import EmojiPicker from './emoji-picker.vue'
import type { Message, MessageEditorEmits } from '../../types'
import type { EditorProps } from './types'

const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: '输入消息...',
  disabled: false,
})

const emit = defineEmits<MessageEditorEmits>()

const inputText = ref('')
const imageList = ref<string[]>([])
const replyMessage = ref<Message>()
const isRecording = ref(false)
const recordingDuration = ref(0)
const showEmojiPicker = ref(false)
const showImageMenu = ref(false)
const showExtensionMenu = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const imageInputRef = ref<HTMLInputElement>()
const fileInputRef = ref<HTMLInputElement>()

let recordingTimer: ReturnType<typeof setInterval> | null = null

const extensions = [
  { key: 'location', label: '位置', icon: 'i-lucide:map-pin' },
  { key: 'card', label: '名片', icon: 'i-lucide:contact' },
  { key: 'code', label: '代码', icon: 'i-lucide:code' },
]

const canSend = computed(() => {
  return inputText.value.trim() || imageList.value.length > 0
})

function handleSend() {
  if (inputText.value.trim()) {
    emit('send', { type: 'text', content: inputText.value.trim() })
    inputText.value = ''
    autoResize()
  }

  if (imageList.value.length > 0) {
    imageList.value.forEach((img) => {
      emit('send', { type: 'image', content: img })
    })
    imageList.value = []
  }

  showEmojiPicker.value = false
  showImageMenu.value = false
  showExtensionMenu.value = false
}

function handleEmojiSelect(emoji: string) {
  inputText.value += emoji
  showEmojiPicker.value = false
  nextTick(() => {
    textareaRef.value?.focus()
    autoResize()
  })
}

function handleExtensionClick(ext: { key: string; label: string }) {
  showExtensionMenu.value = false
  // Handle extension actions
  console.log('extension click:', ext.key)
}

function triggerFileInput(type: 'image' | 'file') {
  showImageMenu.value = false
  if (type === 'image') {
    imageInputRef.value?.click()
  } else {
    fileInputRef.value?.click()
  }
}

function handleImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      if (url && imageList.value.length < 9) {
        imageList.value.push(url)
      }
    }
    reader.readAsDataURL(file)
  }
  target.value = ''
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Would handle file upload
    console.log('file selected:', file.name)
  }
  target.value = ''
}

function removeImage(index: number) {
  imageList.value.splice(index, 1)
}

function cancelReply() {
  replyMessage.value = undefined
}

function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

function startRecording() {
  isRecording.value = true
  recordingDuration.value = 0
  recordingTimer = setInterval(() => {
    recordingDuration.value++
    if (recordingDuration.value >= 60) {
      stopRecording()
    }
  }, 1000)
  emit('typing')
}

function stopRecording() {
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }
  isRecording.value = false
  emit('send', { type: 'voice', content: recordingDuration.value.toString() })
  recordingDuration.value = 0
  emit('stopTyping')
}

function cancelRecording() {
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }
  isRecording.value = false
  recordingDuration.value = 0
  emit('stopTyping')
}

function autoResize() {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`
  }
}

function handleFocus() {
  emit('typing')
}

function handleBlur() {
  emit('stopTyping')
}

// Expose methods
defineExpose({
  focus: () => textareaRef.value?.focus(),
  clear: () => {
    inputText.value = ''
    imageList.value = []
    replyMessage.value = undefined
  },
})
</script>
