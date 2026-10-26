<template>
  <div class="box-border p-15 [container-type:inline-size] max-[575px]:p-12">
    <ImageAttachmentList
      :images="imageList"
      :remaining-count="imageRemainingCount"
      @add="triggerFileInput('image')"
      @remove="removeImage"
    />

    <ComposeTip
      :edit-message="editMessage"
      :reply-message="replyMessage"
      @cancel="emits('cancelCompose')"
    />

    <RecordingBar
      v-if="isRecording"
      :duration="recordingDuration"
      @cancel="cancelRecording"
      @stop="stopRecording"
    />

    <div
      class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-10 max-[575px]:grid-cols-[1fr_auto] max-[575px]:items-center"
    >
      <EditorToolbar
        ref="toolbarRef"
        :recording="isRecording"
        :feedback="feedback"
        :remaining-count="imageRemainingCount"
        @emoji-select="handleEmojiSelect"
        @pick-image="triggerFileInput('image')"
        @pick-file="triggerFileInput('file')"
        @add-images="addImages"
        @extension-select="handleExtensionSelect"
        @toggle-recording="toggleRecording"
      />

      <div class="min-w-0 max-[575px]:col-span-2 max-[575px]:order-1">
        <textarea
          ref="textarea"
          v-model="inputText"
          aria-label="输入消息"
          autocomplete="off"
          class="box-border block max-h-100 min-h-38 w-full resize-none overflow-y-auto rounded-12 b-1-regular bg-container px-12 py-8 text-sm text-main leading-20px outline-none transition-[border-color,box-shadow] placeholder:text-placeholder focus:(border-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/10%)]) disabled:(cursor-not-allowed bg-secondary text-disabled)"
          :placeholder="placeholder"
          :disabled="disabled"
          name="chat-message"
          rows="1"
          @keydown.enter.exact="handleEnterKey"
          @keydown.ctrl.enter.prevent="handleSend"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <div
        class="min-w-0 shrink-0 flex items-center justify-end gap-6 max-[575px]:order-3"
      >
        <a-button
          type="primary"
          class="min-w-72 shrink-0"
          :disabled="!canSend"
          @click="handleSend"
        >
          <template #icon>
            <Icon name="i-lucide:send" :size="16" />
          </template>
          {{ editMessage ? '保存' : '发送' }}
        </a-button>
      </div>
    </div>

    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      multiple
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
import { createDefaultChatSettings } from '../../settings/constants'
import { useTextareaAutosize } from '@vueuse/core'
import {
  ComposeTip,
  EditorToolbar,
  ImageAttachmentList,
  RecordingBar,
} from './components'
import {
  MAX_IMAGE_COUNT,
  MAX_IMAGE_SIZE,
  useImageAttachments,
  useMessageRecording,
} from './hooks'
import type { ChatSendPayload, Message, MessageEditorEmits } from '../../types'
import type { EditorAction, EditorProps } from './types'

const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: '输入消息…',
  disabled: false,
  replyMessage: null,
  editMessage: null,
  settings: () => createDefaultChatSettings(),
})

const emits = defineEmits<MessageEditorEmits>()

const inputText = ref('')
const feedback = shallowRef('')
const textareaRef = useTemplateRef<HTMLTextAreaElement>('textarea')
const toolbarRef = ref<InstanceType<typeof EditorToolbar>>()
const imageInputRef = ref<HTMLInputElement>()
const fileInputRef = ref<HTMLInputElement>()

let feedbackTimer: number | undefined

const canSend = computed(() => {
  return (
    Boolean(inputText.value.trim()) ||
    (!props.editMessage && imageList.value.length > 0)
  )
})

const maxImageSizeMB = MAX_IMAGE_SIZE / 1024 / 1024

const { imageList, imageRemainingCount, addImages, clearImages, removeImage } =
  useImageAttachments({
    onExceed: (count) =>
      showFeedback(`最多添加 ${MAX_IMAGE_COUNT} 张图片，已忽略 ${count} 张`),
    onOversize: () => showFeedback(`单张图片不能超过 ${maxImageSizeMB} MB`),
    onError: () => showFeedback('图片读取失败，请重试'),
  })

const {
  isRecording,
  recordingDuration,
  cancelRecording,
  stopRecording,
  toggleRecording,
} = useMessageRecording({
  onSend: (duration) =>
    emits('send', { type: 'voice', content: String(duration) }),
  onTyping: () => emits('typing'),
  onStopTyping: () => emits('stopTyping'),
})

useTextareaAutosize({
  element: textareaRef,
  input: inputText,
})

function handleSend() {
  const text = inputText.value.trim()
  if (props.editMessage && text) {
    emits('send', {
      type: props.editMessage.type,
      content: text,
      editId: props.editMessage.id,
    })
    resetInput()
    return
  }

  if (text) {
    const payload: ChatSendPayload = {
      type: 'text',
      content: text,
    }
    if (props.replyMessage) {
      payload.replyTo = props.replyMessage.id
      payload.replyInfo = {
        senderName: props.replyMessage.senderInfo?.name,
        content: props.replyMessage.content,
      }
    }
    emits('send', payload)
    inputText.value = ''
  }

  if (imageList.value.length > 0) {
    imageList.value.forEach((img) => {
      emits('send', { type: 'image', content: img })
    })
    clearImages()
  }

  toolbarRef.value?.closePanels()
}

function handleEnterKey(event: KeyboardEvent) {
  if (event.shiftKey || !props.settings.enterToSend) return

  event.preventDefault()
  handleSend()
}

function handleEmojiSelect(emoji: string) {
  const textarea = textareaRef.value
  const start = textarea?.selectionStart ?? inputText.value.length
  const end = textarea?.selectionEnd ?? inputText.value.length

  inputText.value =
    inputText.value.slice(0, start) + emoji + inputText.value.slice(end)

  nextTick(() => {
    const element = textareaRef.value
    if (!element) return

    const caret = start + emoji.length
    element.focus()
    element.setSelectionRange(caret, caret)
  })
}

/** 在工具栏上方弹一条短暂的提示气泡。 */
function showFeedback(text: string) {
  feedback.value = text
  if (feedbackTimer) window.clearTimeout(feedbackTimer)
  feedbackTimer = window.setTimeout(() => {
    feedback.value = ''
    feedbackTimer = undefined
  }, 900)
}

function handleExtensionSelect(action: EditorAction) {
  if (action.preset) inputText.value = action.preset
  nextTick(() => textareaRef.value?.focus())
}

function triggerFileInput(type: 'image' | 'file') {
  if (type === 'image') {
    imageInputRef.value?.click()
  } else {
    fileInputRef.value?.click()
  }
}

function handleImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  addImages(Array.from(target.files ?? []))
  target.value = ''
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emits('send', { type: 'file', content: file.name })
  }
  target.value = ''
}

function handleFocus() {
  emits('typing')
}

function handleBlur() {
  emits('stopTyping')
}

onBeforeUnmount(() => {
  if (feedbackTimer) {
    window.clearTimeout(feedbackTimer)
  }
})

watch(
  () => props.editMessage,
  (message) => {
    if (!message) return
    inputText.value = message.content
    nextTick(() => textareaRef.value?.focus())
  },
  { immediate: true }
)

function resetInput() {
  inputText.value = ''
  clearImages()
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  setReply: () => textareaRef.value?.focus(),
  setEdit: (message: Message) => {
    inputText.value = message.content
    nextTick(() => textareaRef.value?.focus())
  },
  clear: () => {
    resetInput()
  },
})
</script>
