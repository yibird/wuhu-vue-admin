<template>
  <div class="w-300 max-w-[calc(100vw-32px)] p-10">
    <button
      type="button"
      class="button min-h-118 w-full flex-col gap-10 rounded-10 border-1 border-dashed px-12 py-14 text-center transition-colors"
      :class="[
        dragging
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-color-2 bg-fill-quaternary hover:(border-primary bg-primary/8 text-primary)',
      ]"
      @dragover.prevent
      @dragenter.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop"
      @click="emit('pick', 'image')"
    >
      <span
        class="size-42 flex items-center justify-center rounded-full bg-container text-primary shadow-all-sm"
      >
        <Icon name="i-lucide:image-up" :size="22" />
      </span>
      <span class="text-sm text-main font-500">选择或拖拽图片</span>
      <span class="text-xs text-secondary">
        支持一次选择多张，最多 {{ MAX_IMAGE_COUNT }} 张
      </span>
    </button>

    <div class="mt-10 grid grid-cols-2 gap-8">
      <button
        v-for="action in actions"
        :key="action.key"
        type="button"
        class="button min-h-62 justify-start gap-10 rounded-8 border-1 border-solid border-color-1 bg-container px-10 py-9 text-left transition-colors hover:(border-primary bg-hover)"
        @click="emit('pick', action.key)"
      >
        <span
          class="size-34 shrink-0 flex items-center justify-center rounded-8"
          :class="action.iconClass"
        >
          <Icon :name="action.icon" :size="17" />
        </span>
        <span class="min-w-0 flex flex-col items-start gap-2">
          <span class="text-sm text-main">{{ action.label }}</span>
          <span class="text-xs text-secondary">{{ action.description }}</span>
        </span>
      </button>
    </div>

    <div
      v-if="remainingCount <= 0"
      class="mt-8 rounded-6 bg-warning-tint px-10 py-7 text-xs text-warning"
    >
      已达到最多 {{ MAX_IMAGE_COUNT }} 张图片
    </div>
  </div>
</template>

<script setup lang="ts">
import { MAX_IMAGE_COUNT } from '../hooks'
import type { AttachmentPanelProps } from '../types'

defineProps<AttachmentPanelProps>()

const emit = defineEmits<{
  addImages: [files: File[]]
  pick: [key: string]
}>()

const dragging = shallowRef(false)

function handleDrop(event: DragEvent) {
  dragging.value = false
  emit('addImages', Array.from(event.dataTransfer?.files ?? []))
}
</script>
