<template>
  <ConfigProvider :theme="themeConfig" :locale="locale" class="full">
    <RouterView />
    <AppWatermark />
  </ConfigProvider>
</template>
<script lang="ts" setup>
import { ConfigProvider } from 'antdv-next'
import { useTheme } from '@/theme'
import { useLocale } from '@/locales'
import { AppWatermark } from '@/components/app-watermark'
import type { VNodeChild } from 'vue'

const { themeConfig } = useTheme()
const { locale } = useLocale()

ConfigProvider.config({
  holderRender: (children: VNodeChild) =>
    h(
      ConfigProvider,
      {
        locale: locale.value,
        theme: themeConfig.value,
      },
      {
        default: () => children,
      }
    ),
})
onBeforeUnmount(() => ConfigProvider.config({ holderRender: undefined }))
</script>
