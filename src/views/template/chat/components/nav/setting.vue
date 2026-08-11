<template>
  <div class="p-10 flex flex-col">
    <Motion
      as="button"
      type="button"
      class="button flex-col gap-4 rounded-6 px-12 py-8 text-secondary transition-colors hover:(bg-hover text-primary)"
      :while-hover="{ y: -2 }"
      :while-press="{ scale: 0.96 }"
      :transition="{ type: 'spring', stiffness: 420, damping: 28 }"
      title="设置"
      aria-label="打开聊天设置"
      @click="emit('openSettings')"
    >
      <div class="relative">
        <Icon name="i-lucide:settings" :size="22" />
      </div>
      <span class="text-xs">设置</span>
    </Motion>
  </div>
</template>
<script lang="ts" setup>
import { Motion } from 'motion-v'

const emit = defineEmits<{
  openSettings: []
}>()
</script>
