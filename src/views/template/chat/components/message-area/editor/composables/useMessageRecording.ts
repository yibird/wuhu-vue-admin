import { onScopeDispose, shallowRef } from 'vue'

interface UseMessageRecordingOptions {
  maxDuration?: number
  onSend: (duration: number) => void
  onTyping?: () => void
  onStopTyping?: () => void
}

/** 管理聊天编辑器的录音计时和生命周期，卸载时不会遗留 interval。 */
export function useMessageRecording(options: UseMessageRecordingOptions) {
  const isRecording = shallowRef(false)
  const recordingDuration = shallowRef(0)
  const maxDuration = options.maxDuration ?? 60
  let recordingTimer: number | undefined

  function clearRecordingTimer() {
    if (recordingTimer === undefined) return
    window.clearInterval(recordingTimer)
    recordingTimer = undefined
  }

  function startRecording() {
    if (isRecording.value) return
    isRecording.value = true
    recordingDuration.value = 0
    recordingTimer = window.setInterval(() => {
      recordingDuration.value += 1
      if (recordingDuration.value >= maxDuration) stopRecording()
    }, 1000)
    options.onTyping?.()
  }

  function stopRecording() {
    clearRecordingTimer()
    if (!isRecording.value) return

    const duration = recordingDuration.value
    isRecording.value = false
    recordingDuration.value = 0
    options.onStopTyping?.()
    if (duration > 0) options.onSend(duration)
  }

  function cancelRecording() {
    clearRecordingTimer()
    if (!isRecording.value) return
    isRecording.value = false
    recordingDuration.value = 0
    options.onStopTyping?.()
  }

  function toggleRecording() {
    if (isRecording.value) stopRecording()
    else startRecording()
  }

  onScopeDispose(() => {
    const wasRecording = isRecording.value
    clearRecordingTimer()
    isRecording.value = false
    recordingDuration.value = 0
    if (wasRecording) options.onStopTyping?.()
  })

  return {
    isRecording,
    recordingDuration,
    cancelRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  }
}
