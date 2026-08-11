<template>
  <MessageItem
    :message="message"
    :is-mine="isMine"
    @retry="$emit('retry')"
    @recall="$emit('recall')"
    @delete="$emit('delete')"
    @copy="$emit('copy')"
    @reply="$emit('reply')"
    @edit="$emit('edit')"
    @reaction="(emoji) => $emit('reaction', emoji)"
    @preview-image="(url) => $emit('previewImage', url)"
    @download="$emit('download')"
  />
</template>

<script setup lang="ts">
import MessageItem from '../MessageItem.vue'
import type { Message, MessageItemEmits } from '../../../types'

defineProps<{
  message: Message
  isMine: boolean
}>()

defineEmits<MessageItemEmits>()
</script>
