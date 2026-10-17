<template>
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

    <Transition name="fade-pop">
      <span
        v-if="feedback"
        class="pointer-events-none absolute -top-18 left-0 whitespace-nowrap rounded-full bg-primary/10 px-7 py-2 text-11px text-primary shadow-all-sm"
      >
        {{ feedback }}
      </span>
    </Transition>

    <a-popover
      v-model:open="showAttachmentMenu"
      :arrow="false"
      placement="topLeft"
      trigger="click"
      overlay-class-name="chat-editor-popover"
    >
      <template #content>
        <AttachmentPanel
          :actions="attachmentActions"
          :remaining-count="remainingCount"
          @pick="handleAttachmentPick"
          @add-images="handleAddImages"
        />
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
      :class="
        recording
          ? 'bg-error-tint text-error'
          : 'text-secondary hover:text-primary'
      "
      title="语音"
      :aria-label="recording ? '停止录音' : '开始录音'"
      @click="emits('toggleRecording')"
    >
      <Icon name="i-lucide:mic" :size="20" />
    </button>

    <a-popover
      v-model:open="showExtensionMenu"
      :arrow="false"
      placement="topLeft"
      trigger="click"
      overlay-class-name="chat-editor-popover"
    >
      <template #content>
        <ExtensionPanel
          :actions="extensionActions"
          @close="showExtensionMenu = false"
          @select="handleExtensionSelect"
        />
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
  </div>
</template>

<script setup lang="ts">
import EmojiPicker from '../emoji-picker.vue'
import AttachmentPanel from './attachment-panel.vue'
import ExtensionPanel from './extension-panel.vue'
import { attachmentActions, extensionActions } from '../data'
import type { EditorAction, EditorToolbarProps } from '../types'

withDefaults(defineProps<EditorToolbarProps>(), {
  feedback: '',
})

const emits = defineEmits<{
  addImages: [files: File[]]
  emojiSelect: [emoji: string]
  extensionSelect: [action: EditorAction]
  pickFile: []
  pickImage: []
  toggleRecording: []
}>()

const showEmojiPicker = ref(false)
const showAttachmentMenu = ref(false)
const showExtensionMenu = ref(false)

function handleEmojiSelect(emoji: string) {
  showEmojiPicker.value = false
  emits('emojiSelect', emoji)
}

function handleAttachmentPick(key: string) {
  showAttachmentMenu.value = false
  if (key === 'file') emits('pickFile')
  else emits('pickImage')
}

function handleAddImages(files: File[]) {
  showAttachmentMenu.value = false
  emits('addImages', files)
}

function handleExtensionSelect(action: EditorAction) {
  showExtensionMenu.value = false
  emits('extensionSelect', action)
}

/** 关闭工具栏内的所有浮层。 */
function closePanels() {
  showEmojiPicker.value = false
  showAttachmentMenu.value = false
  showExtensionMenu.value = false
}

defineExpose({ closePanels })
</script>
