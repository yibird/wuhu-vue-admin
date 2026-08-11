<template>
  <div class="flex items-center gap-8 min-w-100">
    <button
      type="button"
      class="button size-28 rounded-full transition-colors hover:bg-hover"
      @click="$emit('toggle-play')"
    >
      <Icon :name="isPlaying ? 'i-lucide:pause' : 'i-lucide:play'" :size="16" />
    </button>
    <div class="h-24 flex-1 overflow-hidden rounded-full bg-fill-quaternary">
      <div class="h-full flex items-center px-6 gap-2">
        <div
          v-for="(height, index) in waveform"
          :key="index"
          class="w-2 rounded-full bg-primary/60"
          :style="{ height }"
        />
      </div>
    </div>
    <span class="text-xs text-regular">{{ formattedDuration }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
  isPlaying?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
})

defineEmits<{
  'toggle-play': []
}>()

const formattedDuration = computed(() => {
  const seconds = parseInt(props.content, 10) || 0
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const waveform = computed(() => {
  const seed = parseInt(props.content, 10) || 12
  return Array.from({ length: 20 }, (_, index) => {
    const height = 30 + ((seed * (index + 3) * 17) % 64)
    return `${height}%`
  })
})
</script>
