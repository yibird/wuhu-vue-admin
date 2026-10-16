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

  /**
   * 统一重置录音状态，返回停表前累计的秒数；未在录音时返回 0。
   * 停止、取消和卸载三处共用，避免状态字段漏改。
   */
  function resetRecordingState() {
    const wasRecording = isRecording.value
    const duration = recordingDuration.value
    clearRecordingTimer()
    isRecording.value = false
    recordingDuration.value = 0
    if (wasRecording) options.onStopTyping?.()
    return wasRecording ? duration : 0
  }

  function stopRecording() {
    const duration = resetRecordingState()
    if (duration > 0) options.onSend(duration)
  }

  function cancelRecording() {
    resetRecordingState()
  }

  function toggleRecording() {
    if (isRecording.value) stopRecording()
    else startRecording()
  }

  onScopeDispose(resetRecordingState)

  return {
    isRecording,
    recordingDuration,
    cancelRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  }
}
