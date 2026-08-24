<script setup lang="ts">
import { DragDropProvider } from '@dnd-kit/vue'
import VoiceCall from './VoiceCall.vue'
import VideoCall from './VideoCall.vue'
import './style.less'
import type { Conversation } from '../types'

type CallType = 'voice' | 'video'

defineProps<{
  conversation?: Conversation
  open: boolean
  type: CallType
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <DragDropProvider>
    <VideoCall
      v-if="type === 'video'"
      key="video"
      :open="open"
      :conversation="conversation"
      @update:open="emit('update:open', $event)"
    />
    <VoiceCall
      v-else
      key="voice"
      :open="open"
      :conversation="conversation"
      @update:open="emit('update:open', $event)"
    />
  </DragDropProvider>
</template>
