import { onMounted, onUnmounted, shallowRef } from 'vue'

interface ToneOptions {
  duration: number
  frequency: number
  startAt: number
  volume: number
}

interface ActiveTone {
  gain: GainNode
  oscillator: OscillatorNode
}

const outgoingToneInterval = 2400

export function useChatAudio() {
  const audioContext = shallowRef<AudioContext>()
  const outgoingTimer = shallowRef<number>()
  const outgoingTones = new Set<ActiveTone>()
  let outgoingToneActive = false
  let outgoingToneGeneration = 0

  function getAudioContext() {
    if (typeof window === 'undefined' || !window.AudioContext) return

    if (!audioContext.value || audioContext.value.state === 'closed') {
      audioContext.value = new AudioContext()
    }
    return audioContext.value
  }

  async function getRunningAudioContext() {
    const context = getAudioContext()
    if (!context) return

    if (context.state === 'suspended') {
      try {
        await context.resume()
      } catch {
        return
      }
    }
    return context.state === 'running' ? context : undefined
  }

  function createTone(context: AudioContext, options: ToneOptions) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const fadeDuration = Math.min(0.025, options.duration / 4)
    const endAt = options.startAt + options.duration
    const tone = { gain, oscillator }

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(options.frequency, options.startAt)
    gain.gain.setValueAtTime(0.0001, options.startAt)
    gain.gain.exponentialRampToValueAtTime(
      options.volume,
      options.startAt + fadeDuration
    )
    gain.gain.setValueAtTime(options.volume, endAt - fadeDuration)
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.addEventListener(
      'ended',
      () => {
        outgoingTones.delete(tone)
        oscillator.disconnect()
        gain.disconnect()
      },
      { once: true }
    )
    oscillator.start(options.startAt)
    oscillator.stop(endAt)

    return tone
  }

  function scheduleOutgoingTone(context: AudioContext) {
    const startAt = context.currentTime + 0.02
    const pulses = [startAt, startAt + 0.46]

    for (const pulseAt of pulses) {
      for (const frequency of [440, 480]) {
        outgoingTones.add(
          createTone(context, {
            duration: 0.32,
            frequency,
            startAt: pulseAt,
            volume: 0.025,
          })
        )
      }
    }
  }

  function startOutgoingCallTone() {
    if (outgoingToneActive) return

    outgoingToneActive = true
    const generation = ++outgoingToneGeneration
    void getRunningAudioContext().then((context) => {
      if (
        !context ||
        !outgoingToneActive ||
        generation !== outgoingToneGeneration
      ) {
        return
      }

      scheduleOutgoingTone(context)
      outgoingTimer.value = window.setInterval(() => {
        if (context.state !== 'running') return
        scheduleOutgoingTone(context)
      }, outgoingToneInterval)
    })
  }

  function stopOutgoingCallTone() {
    outgoingToneActive = false
    outgoingToneGeneration += 1
    window.clearInterval(outgoingTimer.value)
    outgoingTimer.value = undefined

    const context = audioContext.value
    for (const tone of outgoingTones) {
      if (context?.state === 'running') {
        const stopAt = context.currentTime + 0.03
        tone.gain.gain.cancelScheduledValues(context.currentTime)
        tone.gain.gain.setValueAtTime(
          Math.max(tone.gain.gain.value, 0.0001),
          context.currentTime
        )
        tone.gain.gain.exponentialRampToValueAtTime(0.0001, stopAt)
        tone.oscillator.stop(stopAt)
      } else {
        tone.oscillator.stop()
      }
    }
    outgoingTones.clear()
  }

  function playIncomingMessageTone() {
    void getRunningAudioContext().then((context) => {
      if (!context) return

      const startAt = context.currentTime + 0.01
      createTone(context, {
        duration: 0.1,
        frequency: 1046.5,
        startAt,
        volume: 0.055,
      })
      createTone(context, {
        duration: 0.13,
        frequency: 1318.5,
        startAt: startAt + 0.09,
        volume: 0.045,
      })
    })
  }

  function unlockAudio() {
    void getRunningAudioContext().then((context) => {
      if (context) removeUnlockListeners()
    })
  }

  function removeUnlockListeners() {
    window.removeEventListener('pointerdown', unlockAudio, true)
    window.removeEventListener('keydown', unlockAudio, true)
  }

  function disposeAudio() {
    removeUnlockListeners()
    stopOutgoingCallTone()

    const context = audioContext.value
    audioContext.value = undefined
    if (context && context.state !== 'closed') {
      void context.close()
    }
  }

  onMounted(() => {
    window.addEventListener('pointerdown', unlockAudio, {
      capture: true,
    })
    window.addEventListener('keydown', unlockAudio, {
      capture: true,
    })
  })
  onUnmounted(disposeAudio)

  return {
    playIncomingMessageTone,
    startOutgoingCallTone,
    stopOutgoingCallTone,
  }
}
