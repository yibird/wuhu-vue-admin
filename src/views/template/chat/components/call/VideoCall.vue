<script setup lang="ts">
import WindowShell from './WindowShell.vue'
import { useCallSession } from './useCallSession'
import type { CallWindowEmits, CallWindowProps } from './types'

const props = defineProps<CallWindowProps>()
const emit = defineEmits<CallWindowEmits>()

const {
  cameraEnabled,
  hasLocalVideo,
  micEnabled,
  permissionError,
  speakerEnabled,
  status,
  statusText,
  cleanupCall,
  setLocalVideoElement,
  toggleCamera,
  toggleMic,
} = useCallSession({
  open: toRef(props, 'open'),
  video: true,
})

const remoteVideoText = computed(() => {
  if (status.value === 'calling') return '等待对方接听'
  if (status.value === 'error') return '已进入模拟通话'
  return '对方视频画面'
})

function endCall() {
  cleanupCall()
}
</script>

<template>
  <WindowShell
    :fallback-height="460"
    :fallback-width="420"
    :open="open"
    variant="video"
    title="视频通话"
    :status="status"
    :status-text="statusText"
    @end="endCall"
    @update:open="emit('update:open', $event)"
  >
    <div
      class="relative min-h-260 overflow-hidden rounded-8 bg-[rgb(15_23_42)] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_8%)]"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-90 [background:radial-gradient(circle_at_22%_14%,rgb(34_197_94_/_30%),transparent_30%),radial-gradient(circle_at_82%_16%,rgb(var(--w-color-primary)_/_30%),transparent_34%),linear-gradient(135deg,rgb(15_23_42),rgb(30_41_59))]"
      />
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent"
      />
      <div
        class="relative z-1 h-260 flex flex-col items-center justify-center px-18 text-center"
      >
        <a-avatar
          :src="conversation?.avatar"
          :size="82"
          fallback-src="https://i.pravatar.cc/100?img=1"
          class="ring-2 ring-white/18"
        />
        <div class="mt-12 max-w-250 truncate text-base font-700">
          {{ conversation?.title }}
        </div>
        <div
          class="mt-7 inline-flex items-center gap-6 rounded-full bg-white/12 px-10 py-5 text-xs text-white/76 backdrop-blur-12"
        >
          <span
            class="size-6 rounded-full"
            :class="status === 'connected' ? 'bg-success' : 'bg-warning'"
          />
          {{ remoteVideoText }}
        </div>
      </div>
      <div
        class="absolute bottom-12 right-12 z-2 h-90 w-124 overflow-hidden rounded-8 border-1 border-white/24 border-solid bg-[rgb(15_23_42_/_82%)] shadow-[0_16px_40px_rgb(0_0_0_/_26%)]"
      >
        <video
          v-show="cameraEnabled && hasLocalVideo"
          :ref="setLocalVideoElement"
          class="full object-cover"
          autoplay
          muted
          playsinline
        />
        <div
          v-if="!cameraEnabled || !hasLocalVideo"
          class="h-full flex flex-col items-center justify-center gap-6 text-white/78"
        >
          <Icon name="i-lucide:video-off" :size="20" />
          <span class="text-xs">摄像头已关闭</span>
        </div>
      </div>
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
        :class="{ 'call-action-disabled': !cameraEnabled }"
        :title="cameraEnabled ? '关闭摄像头' : '打开摄像头'"
        @click="toggleCamera"
      >
        <Icon
          :name="cameraEnabled ? 'i-lucide:video' : 'i-lucide:video-off'"
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
