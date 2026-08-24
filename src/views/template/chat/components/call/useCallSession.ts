import {
  computed,
  onUnmounted,
  ref,
  shallowRef,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'
import type { CallStatus } from './types'
import { useChatAudio } from '../../composables/useChatAudio'

interface UseCallSessionOptions {
  open: Ref<boolean>
  video: boolean
}

interface MediaRequestResult {
  stream: MediaStream | null
  warning?: string
}

export function useCallSession({ open, video }: UseCallSessionOptions) {
  const status = ref<CallStatus>('calling')
  const duration = ref(0)
  const micEnabled = ref(true)
  const cameraEnabled = ref(true)
  const speakerEnabled = ref(true)
  const permissionError = ref('')
  const mediaStream = shallowRef<MediaStream | null>(null)
  const localVideoRef = ref<HTMLVideoElement | null>(null)
  const { startOutgoingCallTone, stopOutgoingCallTone } = useChatAudio()

  let connectTimer: number | undefined
  let durationTimer: number | undefined
  let callToken = 0

  const hasLocalVideo = computed(() => {
    return (
      mediaStream.value?.getVideoTracks().some((track) => track.enabled) ??
      false
    )
  })

  const statusText = computed(() => {
    if (status.value === 'error') return '媒体设备不可用'
    if (status.value === 'calling') return '正在呼叫...'
    return `通话中 ${formatDuration(duration.value)}`
  })

  watch(
    open,
    (value) => {
      if (value) {
        startCall()
        return
      }
      cleanupCall()
    },
    { immediate: true }
  )

  watch(
    [open, status],
    ([isOpen, callStatus]) => {
      if (isOpen && callStatus === 'calling') {
        startOutgoingCallTone()
        return
      }
      stopOutgoingCallTone()
    },
    { immediate: true }
  )

  watch(localVideoRef, (element) => {
    if (element && mediaStream.value) {
      element.srcObject = mediaStream.value
    }
  })

  onUnmounted(cleanupCall)

  async function startCall() {
    cleanupCall()
    const token = callToken
    status.value = 'calling'
    duration.value = 0
    micEnabled.value = true
    cameraEnabled.value = video
    speakerEnabled.value = true
    permissionError.value = ''

    const result = await requestMedia()
    if (!isCurrentCall(token)) {
      result.stream?.getTracks().forEach((track) => track.stop())
      return
    }

    permissionError.value = result.warning ?? ''
    const stream = result.stream
    if (stream) {
      mediaStream.value = stream
      if (localVideoRef.value) {
        localVideoRef.value.srcObject = stream
      }
    }

    connectTimer = window.setTimeout(() => {
      if (!isCurrentCall(token) || status.value === 'error') return
      status.value = 'connected'
      startDurationTimer()
    }, 900)
  }

  async function requestMedia(): Promise<MediaRequestResult> {
    if (!navigator.mediaDevices?.getUserMedia) {
      return {
        stream: null,
        warning: '当前浏览器不支持媒体设备调用，已切换为模拟通话。',
      }
    }

    try {
      return {
        stream: await navigator.mediaDevices.getUserMedia({
          audio: true,
          video,
        }),
      }
    } catch {
      return {
        stream: null,
        warning: '无法访问麦克风或摄像头，已切换为模拟通话。',
      }
    }
  }

  function isCurrentCall(token: number) {
    return open.value && callToken === token
  }

  function startDurationTimer() {
    window.clearInterval(durationTimer)
    durationTimer = window.setInterval(() => {
      duration.value += 1
    }, 1000)
  }

  function toggleMic() {
    micEnabled.value = !micEnabled.value
    for (const track of mediaStream.value?.getAudioTracks() ?? []) {
      track.enabled = micEnabled.value
    }
  }

  function toggleCamera() {
    cameraEnabled.value = !cameraEnabled.value
    for (const track of mediaStream.value?.getVideoTracks() ?? []) {
      track.enabled = cameraEnabled.value
    }
  }

  function cleanupCall() {
    callToken += 1
    stopOutgoingCallTone()
    window.clearTimeout(connectTimer)
    window.clearInterval(durationTimer)
    connectTimer = undefined
    durationTimer = undefined

    for (const track of mediaStream.value?.getTracks() ?? []) {
      track.stop()
    }
    if (localVideoRef.value) {
      localVideoRef.value.srcObject = null
    }
    mediaStream.value = null
  }

  function setLocalVideoElement(
    element: Element | ComponentPublicInstance | null
  ) {
    localVideoRef.value = element instanceof HTMLVideoElement ? element : null
    if (localVideoRef.value && mediaStream.value) {
      localVideoRef.value.srcObject = mediaStream.value
    }
  }

  function formatDuration(value: number) {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return {
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
  }
}
