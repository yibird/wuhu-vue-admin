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
    status.value = 'calling'
    duration.value = 0
    micEnabled.value = true
    cameraEnabled.value = video
    speakerEnabled.value = true
    permissionError.value = ''

    await requestMedia()

    connectTimer = window.setTimeout(() => {
      status.value = status.value === 'error' ? 'error' : 'connected'
      startDurationTimer()
    }, 900)
  }

  async function requestMedia() {
    if (!navigator.mediaDevices?.getUserMedia) {
      permissionError.value = '当前浏览器不支持媒体设备调用，已切换为模拟通话。'
      status.value = 'error'
      return
    }

    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video,
      })

      if (localVideoRef.value) {
        localVideoRef.value.srcObject = mediaStream.value
      }
    } catch {
      permissionError.value = '无法访问麦克风或摄像头，已切换为模拟通话。'
      status.value = 'error'
    }
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
