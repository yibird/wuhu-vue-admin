<template>
  <Watermark
    v-if="show"
    aria-hidden="true"
    class="w-app-watermark pointer-events-none fixed inset-0 z-[var(--w-watermark-z-index)]"
    :content="content"
    :font="font"
    :gap="[140, 96]"
    :height="72"
    :inherit="true"
    :rotate="-18"
    :width="168"
    :style="{ overflow: 'visible', position: 'fixed' }"
  >
    <div class="full" />
  </Watermark>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import { Watermark } from 'antdv-next'

const { app } = useAppStore()
const show = computed(() => app.value.showWatermark)
const content = computed(() => app.value.name)

const font = computed(() => ({
  color: `rgb(${app.value.themeColor} / 12%)`,
  fontSize: 18,
  fontWeight: 600,
}))
</script>
