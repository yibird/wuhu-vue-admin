<template>
  <a-config-provider :theme="themeConfig" :locale="locale">
    <a-app class="full">
      <a-watermark
        v-if="app.showWatermark"
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
      </a-watermark>
      <RouterView />
    </a-app>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { useTheme } from '@/composables'
import { useLocale } from '@/locales'
import { useAppStore } from '@/store'
import { App as AntApp, ConfigProvider } from 'antdv-next'
import { computed, h, onBeforeUnmount, type VNodeChild } from 'vue'

const { themeConfig } = useTheme()
const { locale } = useLocale()
const { app } = useAppStore()

const holderRender = (children: VNodeChild) =>
  h(
    ConfigProvider,
    {
      locale: locale.value,
      theme: themeConfig.value,
    },
    {
      default: () => h(AntApp, null, () => children),
    }
  )

ConfigProvider.config({ holderRender })
onBeforeUnmount(() => ConfigProvider.config({ holderRender: undefined }))

const watermarkGap: [number, number] = [140, 96]
const watermarkLayerStyle = {
  inset: '0',
  overflow: 'visible',
  position: 'fixed',
} as const
const watermarkZIndex = 1100

const watermarkContent = computed(() => {
  return app.value.name.trim().toLowerCase() || 'wuhu-admin'
})

const watermarkFont = computed(() => ({
  color: `rgba(${app.value.themeColor}, 0.12)`,
  fontSize: 18,
  fontWeight: 600,
}))
</script>
