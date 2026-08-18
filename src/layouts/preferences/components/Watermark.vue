<template>
  <Watermark
    v-if="showWatermark"
    aria-hidden="true"
    class="w-app-watermark pointer-events-none fixed inset-0 z-[var(--w-watermark-z-index)]"
    :content="watermarkContent"
    :font="watermarkFont"
    :gap="watermarkGap"
    :height="72"
    :inherit="true"
    :rotate="-18"
    :width="168"
    :z-index="watermarkZIndex"
    :style="watermarkLayerStyle"
  >
    <div class="full" />
  </Watermark>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store'
import { Watermark } from 'antdv-next'

const { app } = useAppStore()

const watermarkGap: [number, number] = [140, 96]
const watermarkLayerStyle = {
  inset: '0',
  overflow: 'visible',
  position: 'fixed',
} as const
const watermarkZIndex = 1100

const showWatermark = computed(() => app.value.showWatermark)
const watermarkContent = computed(() => {
  return app.value.name.trim().toLowerCase() || 'wuhu-admin'
})

const watermarkFont = computed(() => ({
  color: `rgba(${app.value.themeColor}, 0.12)`,
  fontSize: 18,
  fontWeight: 600,
}))
</script>
