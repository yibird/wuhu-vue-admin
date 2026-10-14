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
    :style="watermarkLayerStyle"
  >
    <div class="full" />
  </Watermark>
</template>

<script setup lang="ts">
import { DEFAULT_APP_NAME, useAppStore } from '@/store'
import { Watermark } from 'antdv-next'

const { app } = useAppStore()

const watermarkGap: [number, number] = [140, 96]
/**
 * Watermark 内部会写入 position: relative 与 overflow: hidden,
 * 必须以更高优先级的内联样式覆盖,层级则统一交给 class 上的 --w-watermark-z-index 令牌
 */
const watermarkLayerStyle = {
  overflow: 'visible',
  position: 'fixed',
} as const

const showWatermark = computed(() => app.value.showWatermark)
const watermarkContent = computed(() => {
  return app.value.name.trim().toLowerCase() || DEFAULT_APP_NAME.toLowerCase()
})

const watermarkFont = computed(() => ({
  color: `rgba(${app.value.themeColor}, 0.12)`,
  fontSize: 18,
  fontWeight: 600,
}))
</script>
