<template>
  <div
    v-if="activeMessage"
    class="mb-10 rounded-6 b-1-regular bg-primary/10 p-10"
  >
    <div class="flex items-center justify-between">
      <div class="min-w-0">
        <div class="text-xs text-primary mb-2">{{ tipTitle }}</div>
        <div class="truncate text-sm text-secondary">
          {{ activeMessage.content }}
        </div>
      </div>
      <button
        type="button"
        class="button size-26 rounded-4 text-secondary hover:bg-hover"
        aria-label="取消回复或编辑"
        @click="emits('cancel')"
      >
        <Icon name="i-lucide:x" :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComposeTipProps } from '../types'

const props = withDefaults(defineProps<ComposeTipProps>(), {
  editMessage: null,
  replyMessage: null,
})

const emits = defineEmits<{
  cancel: []
}>()

const activeMessage = computed(() => props.editMessage ?? props.replyMessage)

const tipTitle = computed(() =>
  props.editMessage
    ? '编辑消息'
    : `回复 ${props.replyMessage?.senderInfo?.name ?? ''}`
)
</script>
