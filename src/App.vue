<template>
  <ConfigProvider :theme="themeConfig" :locale="locale">
    <div class="full">
      <RouterView />
    </div>
    <Watermark />
  </ConfigProvider>
</template>
<script lang="ts" setup>
import ConfigProvider from 'antdv-next/config-provider'
import { useTheme } from '@/composables'
import { useLocale } from '@/locales'
import { Watermark } from '@/layouts/preferences/components'
import { h, onBeforeUnmount, type VNodeChild } from 'vue'

const { themeConfig } = useTheme()
const { locale } = useLocale()

const holderRender = (children: VNodeChild) =>
  h(
    ConfigProvider,
    {
      locale: locale.value,
      theme: themeConfig.value,
    },
    {
      default: () => children,
    }
  )

ConfigProvider.config({ holderRender })
onBeforeUnmount(() => ConfigProvider.config({ holderRender: undefined }))
</script>
