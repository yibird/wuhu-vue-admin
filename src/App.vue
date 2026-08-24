<template>
  <ConfigProvider :theme="themeConfig" :locale="locale">
    <div class="full">
      <RouterView />
    </div>
    <Watermark />
  </ConfigProvider>
</template>
<script lang="ts" setup>
import { ConfigProvider } from 'antdv-next'
import { useTheme } from '@/composables'
import { useLocale } from '@/locales'
import { Watermark } from '@/layouts/preferences/components'

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
