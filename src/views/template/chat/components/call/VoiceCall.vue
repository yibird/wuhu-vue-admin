<script setup lang="ts">
import { toRef } from 'vue'
import { Icon } from '@/components'
import WindowShell from './WindowShell.vue'
import { useCallSession } from './useCallSession'
import type { CallWindowEmits, CallWindowProps } from './types'

const props = defineProps<CallWindowProps>()
const emit = defineEmits<CallWindowEmits>()

const {
  micEnabled,
  permissionError,
  speakerEnabled,
  status,
  statusText,
  cleanupCall,
  toggleMic,
} = useCallSession({
  open: toRef(props, 'open'),
  video: false,
})

function endCall() {
  cleanupCall()
}
</script>

<template>
  <WindowShell
    :fallback-height="430"
    :fallback-width="380"
    :open="open"
    title="语音通话"
    :status="status"
    :status-text="statusText"
    @end="endCall"
    @update:open="emit('update:open', $event)"
  >
    <div class="call-stage call-stage-voice">
      <div class="call-avatar-ring">
        <a-avatar
          :src="conversation?.avatar"
          :size="96"
          fallback-src="https://i.pravatar.cc/100?img=1"
        />
      </div>
      <div class="mt-16 text-lg text-main font-600">
        {{ conversation?.title }}
      </div>
      <div class="mt-6 text-sm text-secondary">{{ statusText }}</div>
    </div>

    <div
      v-if="permissionError"
      class="rounded-6 bg-warning/10 px-10 py-8 text-xs text-warning"
    >
      {{ permissionError }}
    </div>

    <div class="call-actions">
      <button
        type="button"
        class="call-action"
        :class="{ 'call-action-disabled': !micEnabled }"
        :title="micEnabled ? '关闭麦克风' : '打开麦克风'"
        @click="toggleMic"
      >
        <Icon
          :name="micEnabled ? 'i-lucide:mic' : 'i-lucide:mic-off'"
          :size="18"
        />
      </button>
      <button
        type="button"
        class="call-action"
        :class="{ 'call-action-disabled': !speakerEnabled }"
        :title="speakerEnabled ? '关闭扬声器' : '打开扬声器'"
        @click="speakerEnabled = !speakerEnabled"
      >
        <Icon
          :name="speakerEnabled ? 'i-lucide:volume-2' : 'i-lucide:volume-x'"
          :size="18"
        />
      </button>
      <button
        type="button"
        class="call-action call-action-end"
        title="挂断"
        @click="emit('update:open', false)"
      >
        <Icon name="i-lucide:phone-off" :size="19" />
      </button>
    </div>
  </WindowShell>
</template>
