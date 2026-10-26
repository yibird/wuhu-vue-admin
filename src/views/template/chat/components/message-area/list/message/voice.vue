<template>
  <div
    class="voice-message min-w-150 flex items-center gap-10"
    :class="isMine ? 'flex-row-reverse' : 'flex-row'"
  >
    <button
      type="button"
      class="voice-message__play button size-30 shrink-0 flex-center rounded-full transition-[background-color,transform] duration-200 hover:scale-105 active:scale-95 focus-visible:(outline-2 outline-primary outline-offset-2)"
      :class="
        isMine
          ? 'bg-white/22 text-white hover:bg-white/32'
          : 'bg-primary/12 text-primary hover:bg-primary/20'
      "
      :aria-label="isPlaying ? '暂停语音' : '播放语音'"
      @click="$emit('toggle-play')"
    >
      <Icon
        :name="isPlaying ? 'i-lucide:pause' : 'i-lucide:play'"
        :size="14"
        :class="!isPlaying && 'ml-1'"
      />
    </button>

    <div
      class="voice-message__wave h-24 min-w-0 flex-1 flex items-center gap-2"
      :class="{ 'is-playing': isPlaying }"
    >
      <span
        v-for="(height, index) in waveform"
        :key="index"
        class="voice-message__bar w-2 rounded-full"
        :class="isMine ? 'bg-white/65' : 'bg-primary/55'"
        :style="{ height, animationDelay: `${index * 45}ms` }"
      />
    </div>

    <span
      class="shrink-0 text-xs font-500 tabular-nums"
      :class="isMine ? 'text-white/75' : 'text-secondary'"
    >
      {{ formattedDuration }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * @desc 语音时长,单位秒
   */
  content: string
  /**
   * @desc 是否正在播放
   * @default false
   */
  isPlaying?: boolean
  /**
   * @desc 是否为当前用户发送的消息,用于适配气泡配色
   * @default false
   */
  isMine?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  isMine: false,
})

defineEmits<{
  /**
   * @desc 切换播放/暂停
   */
  'toggle-play': []
}>()

const durationInSeconds = computed(() => parseInt(props.content, 10) || 0)

const formattedDuration = computed(() => {
  const mins = Math.floor(durationInSeconds.value / 60)
  const secs = durationInSeconds.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

/**
 * 波形高度按时长生成稳定的伪随机分布,避免每次渲染都跳动
 */
const waveform = computed(() => {
  const seed = durationInSeconds.value || 12
  return Array.from({ length: 24 }, (_, index) => {
    const height = 8 + ((seed * (index + 3) * 17) % 14)
    return `${height}px`
  })
})
</script>

<style scoped>
.voice-message__wave.is-playing .voice-message__bar {
  transform-origin: center;
  animation: voice-wave 900ms var(--w-motion-ease) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .voice-message__wave.is-playing .voice-message__bar {
    animation: none;
  }
}

@keyframes voice-wave {
  0%,
  100% {
    opacity: 0.55;
    transform: scaleY(0.45);
  }

  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
