<template>
  <div class="flex items-center gap-8 min-w-100">
    <button
      class="p-6 rounded-full hover:bg-[#000]/10 transition-colors"
      @click="$emit('toggle-play')"
    >
      <Icon
        :name="isPlaying ? 'i-lucide:pause' : 'i-lucide:play'"
        :size="16"
      />
    </button>
    <div class="flex-1 h-24 rounded-full bg-[#e8e8e8] overflow-hidden">
      <div class="h-full flex items-center px-6 gap-2">
        <div
          v-for="i in 20"
          :key="i"
          class="w-2 rounded-full bg-primary/60"
          :style="{ height: `${Math.random() * 100}%` }"
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
</script>
