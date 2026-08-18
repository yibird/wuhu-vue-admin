<template>
  <div class="box-border p-15 [container-type:inline-size] max-[575px]:p-12">
    <div
      v-if="imageList.length > 0"
      class="mb-10 flex items-center gap-8 flex-wrap"
    >
      <div
        v-for="(img, index) in imageList"
        :key="img"
        class="group relative size-64 overflow-hidden rounded-8 border-1 border-solid border-color-1 bg-fill-quaternary"
      >
        <img :src="img" alt="待发送图片" class="full object-cover" />
        <button
          type="button"
          class="button absolute right-4 top-4 size-18 rounded-full bg-mask text-white opacity-0 transition-[opacity,colors] group-hover:opacity-100 hover:bg-mask-2"
          aria-label="移除待发送图片"
          @click="removeImage(index)"
        >
          <Icon name="i-lucide:x" :size="12" />
        </button>
      </div>
      <button
        v-if="imageRemainingCount > 0"
        type="button"
        class="button size-64 flex-col gap-4 rounded-8 border-1 border-dashed border-color-2 bg-fill-quaternary text-secondary transition-colors hover:(border-color-primary bg-primary/8 text-primary)"
        title="继续添加图片"
        aria-label="继续添加图片"
        @click="triggerFileInput('image')"
      >
        <Icon name="i-lucide:plus" :size="18" />
        <span class="text-11px">添加</span>
      </button>
    </div>

    <div
      v-if="activeTipMessage"
      class="mb-10 rounded-6 border-l-4 border-primary bg-fill-quaternary p-10"
    >
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <div class="text-xs text-primary mb-2">
            {{
              editMessage
                ? '编辑消息'
                : `回复 ${replyMessage?.senderInfo?.name ?? ''}`
            }}
          </div>
          <div class="truncate text-sm text-secondary">
            {{ activeTipMessage.content }}
          </div>
        </div>
        <button
          type="button"
          class="button size-26 rounded-4 text-secondary hover:bg-hover"
          aria-label="取消回复或编辑"
          @click="cancelComposeContext"
        >
          <Icon name="i-lucide:x" :size="14" />
        </button>
      </div>
    </div>

    <div v-if="isRecording" class="mb-10 rounded-6 bg-fill-quaternary p-15">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-10">
          <div class="size-8 rounded-full bg-error animate-pulse" />
          <span class="text-sm text-regular"
            >正在录音… {{ recordingDuration }}s</span
          >
        </div>
        <div class="flex items-center gap-10">
          <button
            type="button"
            class="button rounded-4 px-15 py-6 text-sm text-secondary transition-colors hover:bg-hover"
            @click="cancelRecording"
          >
            取消
          </button>
          <button
            type="button"
            class="button rounded-4 bg-error px-15 py-6 text-sm text-white transition-colors hover:bg-error-2"
            @click="stopRecording"
          >
            停止
          </button>
        </div>
      </div>
    </div>

    <div
      class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-10 max-[575px]:grid-cols-[1fr_auto] max-[575px]:items-center"
    >
      <div
        class="relative min-w-0 shrink-0 flex items-center gap-6 max-[575px]:order-2"
      >
        <a-popover
          v-model:open="showEmojiPicker"
          :arrow="false"
          placement="topLeft"
          trigger="click"
          overlay-class-name="chat-editor-emoji-popover"
        >
          <template #content>
            <EmojiPicker @select="handleEmojiSelect" />
          </template>
          <button
            type="button"
            class="button size-36 rounded-6 text-secondary transition-[background-color,box-shadow,transform,color] duration-motion-base hover:(-translate-y-1 bg-hover text-primary shadow-all-sm) active:(translate-y-0 scale-92)"
            :class="
              showEmojiPicker ? 'bg-primary/10 text-primary shadow-all-sm' : ''
            "
            title="表情"
            aria-label="打开表情面板"
          >
            <Icon name="i-lucide:smile" :size="20" />
          </button>
        </a-popover>

        <Transition name="emoji-feedback">
          <span
            v-if="emojiFeedback"
            class="pointer-events-none absolute -top-18 left-0 whitespace-nowrap rounded-full bg-primary/10 px-7 py-2 text-11px text-primary shadow-all-sm"
          >
            {{ emojiFeedback }}
          </span>
        </Transition>

        <a-popover
          v-model:open="showImageMenu"
          :arrow="false"
          placement="topLeft"
          trigger="click"
          overlay-class-name="chat-editor-popover"
        >
          <template #content>
            <div class="w-300 max-w-[calc(100vw-32px)] p-10">
              <button
                type="button"
                class="button min-h-118 w-full flex-col gap-10 rounded-10 border-1 border-dashed px-12 py-14 text-center transition-colors"
                :class="[
                  isImageDragging
                    ? 'border-color-primary bg-primary/10 text-primary'
                    : 'border-color-2 bg-fill-quaternary hover:(border-color-primary bg-primary/8 text-primary)',
                ]"
                @dragover.prevent
                @dragenter.prevent="isImageDragging = true"
                @dragleave.prevent="isImageDragging = false"
                @drop.prevent="handleImageDrop"
                @click="triggerFileInput('image')"
              >
                <span
                  class="size-42 flex items-center justify-center rounded-full bg-container text-primary shadow-all-sm"
                >
                  <Icon name="i-lucide:image-up" :size="22" />
                </span>
                <span class="text-sm text-main font-500">选择或拖拽图片</span>
                <span class="text-xs text-secondary">
                  支持一次选择多张，最多 9 张
                </span>
              </button>

              <div class="mt-10 grid grid-cols-2 gap-8">
                <button
                  v-for="action in attachmentActions"
                  :key="action.key"
                  type="button"
                  class="button min-h-62 justify-start gap-10 rounded-8 border-1 border-solid border-color-1 bg-container px-10 py-9 text-left transition-colors hover:(border-color-primary bg-hover)"
                  @click="handleAttachmentAction(action.key)"
                >
                  <span
                    class="size-34 shrink-0 flex items-center justify-center rounded-8"
                    :class="action.iconClass"
                  >
                    <Icon :name="action.icon" :size="17" />
                  </span>
                  <span class="min-w-0 flex flex-col items-start gap-2">
                    <span class="text-sm text-main">{{ action.label }}</span>
                    <span class="text-xs text-secondary">
                      {{ action.description }}
                    </span>
                  </span>
                </button>
              </div>

              <div
                v-if="imageRemainingCount <= 0"
                class="mt-8 rounded-6 bg-warning-tint px-10 py-7 text-xs text-warning"
              >
                已达到最多 9 张图片
              </div>
            </div>
          </template>
          <button
            type="button"
            class="button size-36 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary)"
            title="图片"
            aria-label="打开图片和附件面板"
          >
            <Icon name="i-lucide:image-up" :size="20" />
          </button>
        </a-popover>

        <button
          type="button"
          class="button size-36 rounded-6 transition-colors hover:bg-hover"
          :class="[
            isRecording
              ? 'bg-error-tint text-error'
              : 'text-secondary hover:text-primary',
          ]"
          title="语音"
          :aria-label="isRecording ? '停止录音' : '开始录音'"
          @click="toggleRecording"
        >
          <Icon name="i-lucide:mic" :size="20" />
        </button>
      </div>

      <div class="min-w-0 max-[575px]:col-span-2 max-[575px]:order-1">
        <textarea
          ref="textarea"
          v-model="inputText"
          aria-label="输入消息"
          autocomplete="off"
          class="box-border block max-h-100 min-h-38 w-full resize-none overflow-y-auto rounded-12 border-1 border-solid border-color-2 bg-container px-12 py-8 text-sm text-main leading-20px outline-none transition-[border-color,box-shadow] placeholder:text-placeholder focus:(border-color-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/10%)]) disabled:(cursor-not-allowed bg-fill-quaternary text-disabled)"
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
        <a-popover
          v-model:open="showExtensionMenu"
          :arrow="false"
          placement="topRight"
          trigger="click"
          overlay-class-name="chat-editor-popover"
        >
          <template #content>
            <div class="w-320 max-w-[calc(100vw-32px)] p-10">
              <div class="mb-10 flex items-center justify-between">
                <div>
                  <div class="text-sm text-main font-600">更多发送方式</div>
                  <div class="mt-2 text-xs text-secondary">
                    选择常用内容或快捷能力
                  </div>
                </div>
                <button
                  type="button"
                  class="button size-28 rounded-6 text-secondary hover:(bg-hover text-primary)"
                  aria-label="关闭更多发送方式"
                  @click="showExtensionMenu = false"
                >
                  <Icon name="i-lucide:x" :size="15" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-8">
                <button
                  v-for="ext in extensions"
                  :key="ext.icon"
                  type="button"
                  class="button min-h-66 justify-start gap-10 rounded-8 border-1 border-solid border-color-1 bg-container px-10 py-9 text-left transition-colors hover:(border-color-primary bg-hover)"
                  @click="handleExtensionClick(ext)"
                >
                  <span
                    class="size-34 shrink-0 flex items-center justify-center rounded-8"
                    :class="ext.iconClass"
                  >
                    <Icon :name="ext.icon" :size="17" />
                  </span>
                  <span class="min-w-0 flex flex-col items-start gap-2">
                    <span class="text-sm text-main">{{ ext.label }}</span>
                    <span class="text-xs text-secondary">
                      {{ ext.description }}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </template>
          <button
            type="button"
            class="button size-36 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary)"
            title="更多"
            aria-label="打开更多发送方式"
          >
            <Icon name="i-lucide:plus-circle" :size="20" />
          </button>
        </a-popover>

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
import { useTextareaAutosize } from '@vueuse/core'
import EmojiPicker from './EmojiPicker.vue'
import type { ChatSendPayload, Message, MessageEditorEmits } from '../../types'
import type { EditorProps } from './types'

const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: '输入消息…',
  disabled: false,
  replyMessage: null,
  editMessage: null,
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

const emit = defineEmits<MessageEditorEmits>()

const inputText = ref('')
const imageList = ref<string[]>([])
const isRecording = ref(false)
const recordingDuration = ref(0)
const showEmojiPicker = ref(false)
const emojiFeedback = shallowRef('')
const showImageMenu = ref(false)
const showExtensionMenu = ref(false)
const isImageDragging = ref(false)
const textareaRef = useTemplateRef<HTMLTextAreaElement>('textarea')
const imageInputRef = ref<HTMLInputElement>()
const fileInputRef = ref<HTMLInputElement>()

let recordingTimer: number | null = null
let emojiFeedbackTimer: number | undefined

const maxImageCount = 9

interface EditorAction {
  key: string
  label: string
  description: string
  icon: string
  iconClass: string
}

const attachmentActions: EditorAction[] = [
  {
    key: 'image',
    label: '图片',
    description: '本地相册',
    icon: 'i-lucide:image',
    iconClass: 'icon-primary-soft',
  },
  {
    key: 'file',
    label: '文件',
    description: '文档附件',
    icon: 'i-lucide:file-up',
    iconClass: 'bg-info-tint text-info',
  },
]

const extensions = [
  {
    key: 'location',
    label: '位置',
    description: '发送定位',
    icon: 'i-lucide:map-pin',
    iconClass: 'bg-success-tint text-success',
  },
  {
    key: 'card',
    label: '名片',
    description: '联系人卡片',
    icon: 'i-lucide:contact',
    iconClass: 'icon-primary-soft',
  },
  {
    key: 'code',
    label: '代码',
    description: '代码片段',
    icon: 'i-lucide:code-2',
    iconClass: 'bg-warning-tint text-warning',
  },
  {
    key: 'todo',
    label: '待办',
    description: '快速任务',
    icon: 'i-lucide:list-checks',
    iconClass: 'bg-info-tint text-info',
  },
]

const canSend = computed(() => {
  return (
    Boolean(inputText.value.trim()) ||
    (!props.editMessage && imageList.value.length > 0)
  )
})

const activeTipMessage = computed(() => props.editMessage ?? props.replyMessage)
const imageRemainingCount = computed(
  () => maxImageCount - imageList.value.length
)

useTextareaAutosize({
  element: textareaRef,
  input: inputText,
})

function handleSend() {
  const text = inputText.value.trim()
  if (props.editMessage && text) {
    emit('send', {
      type: props.editMessage.type,
      content: text,
      editId: props.editMessage.id,
    })
    resetInput()
    return
  }

  if (inputText.value.trim()) {
    const payload: ChatSendPayload = {
      type: 'text',
      content: inputText.value.trim(),
    }
    if (props.replyMessage) {
      payload.replyTo = props.replyMessage.id
      payload.replyInfo = {
        senderName: props.replyMessage.senderInfo?.name,
        content: props.replyMessage.content,
      }
    }
    emit('send', payload)
    inputText.value = ''
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

function handleEnterKey(event: KeyboardEvent) {
  if (event.shiftKey || !props.settings.enterToSend) return

  event.preventDefault()
  handleSend()
}

function handleEmojiSelect(emoji: string) {
  const hasDraftContent =
    Boolean(inputText.value.trim()) || imageList.value.length > 0

  if (!hasDraftContent && !props.editMessage) {
    const payload: ChatSendPayload = {
      type: 'emoji',
      content: emoji,
    }
    if (props.replyMessage) {
      payload.replyTo = props.replyMessage.id
      payload.replyInfo = {
        senderName: props.replyMessage.senderInfo?.name,
        content: props.replyMessage.content,
      }
    }

    emit('send', payload)
    showEmojiPicker.value = false
    showEmojiFeedback(`${emoji} 已发送`)
    nextTick(() => textareaRef.value?.focus())
    return
  }

  inputText.value += emoji
  showEmojiPicker.value = false
  showEmojiFeedback(`${emoji} 已插入`)
  nextTick(() => textareaRef.value?.focus())
}

function showEmojiFeedback(text: string) {
  emojiFeedback.value = text
  if (emojiFeedbackTimer) window.clearTimeout(emojiFeedbackTimer)
  emojiFeedbackTimer = window.setTimeout(() => {
    emojiFeedback.value = ''
    emojiFeedbackTimer = undefined
  }, 900)
}

function handleExtensionClick(ext: EditorAction) {
  const presetMessageMap: Record<string, string> = {
    location: '[位置] 公司总部 18F 会议室',
    card: '[名片] 产品经理 王五',
    code: '```ts\nconst message = "hello"\n```',
    todo: '[待办] 请在今天 18:00 前确认评审结论',
  }
  inputText.value = presetMessageMap[ext.key] ?? inputText.value
  showExtensionMenu.value = false
  nextTick(() => textareaRef.value?.focus())
}

function handleAttachmentAction(key: string) {
  if (key === 'image' || key === 'file') {
    triggerFileInput(key)
  }
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
  addImages(Array.from(target.files ?? []))
  target.value = ''
}

function handleImageDrop(e: DragEvent) {
  isImageDragging.value = false
  addImages(Array.from(e.dataTransfer?.files ?? []))
  showImageMenu.value = false
}

function addImages(files: File[]) {
  const imageFiles = files
    .filter((file) => file.type.startsWith('image/'))
    .slice(0, Math.max(0, imageRemainingCount.value))

  imageFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      if (url && imageList.value.length < maxImageCount) {
        imageList.value.push(url)
      }
    }
    reader.readAsDataURL(file)
  })
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('send', { type: 'file', content: file.name })
  }
  target.value = ''
}

function removeImage(index: number) {
  imageList.value.splice(index, 1)
}

function cancelComposeContext() {
  emit('cancelCompose')
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
  recordingTimer = window.setInterval(() => {
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
  if (recordingDuration.value <= 0) {
    cancelRecording()
    return
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

function handleFocus() {
  emit('typing')
}

function handleBlur() {
  emit('stopTyping')
}

onBeforeUnmount(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
  }
  if (emojiFeedbackTimer) {
    window.clearTimeout(emojiFeedbackTimer)
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
  imageList.value = []
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

<style scoped>
.emoji-feedback-enter-active,
.emoji-feedback-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.emoji-feedback-enter-from,
.emoji-feedback-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.92);
}

.emoji-feedback-enter-to,
.emoji-feedback-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
