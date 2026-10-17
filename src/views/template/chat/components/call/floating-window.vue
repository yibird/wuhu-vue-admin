<template>
  <DragDropProvider>
    <VideoCall
      v-if="type === 'video'"
      key="video"
      :open="open"
      :conversation="conversation"
      @update:open="emits('update:open', $event)"
    />
    <VoiceCall
      v-else
      key="voice"
      :open="open"
      :conversation="conversation"
      @update:open="emits('update:open', $event)"
    />
  </DragDropProvider>
</template>

<script setup lang="ts">
import { DragDropProvider } from '@dnd-kit/vue'
import VoiceCall from './voice-call.vue'
import VideoCall from './video-call.vue'
import './style.less'
import type { Conversation } from '../types'

type CallType = 'voice' | 'video'

defineProps<{
  conversation?: Conversation
  open: boolean
  type: CallType
}>()

const emits = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>
