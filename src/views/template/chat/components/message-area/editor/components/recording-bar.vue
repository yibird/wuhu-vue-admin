<template>
  <div class="mb-10 rounded-6 bg-fill-quaternary p-15">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-10">
        <div class="size-8 rounded-full bg-error animate-pulse" />
        <span class="text-sm text-regular">正在录音… {{ duration }}s</span>
      </div>
      <div class="flex items-center gap-10">
        <button
          type="button"
          class="button rounded-4 px-15 py-6 text-sm text-secondary transition-colors hover:bg-hover"
          @click="emits('cancel')"
        >
          取消
        </button>
        <button
          type="button"
          class="button rounded-4 bg-error px-15 py-6 text-sm text-white transition-colors hover:bg-error-2"
          @click="emits('stop')"
        >
          停止
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecordingBarProps } from '../types'

defineProps<RecordingBarProps>()

const emits = defineEmits<{
  cancel: []
  stop: []
}>()
</script>
