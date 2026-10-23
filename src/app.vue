<template>
  <a-config-provider :theme="themeConfig" :locale="locale" class="full">
    <RouterView />
    <AppWatermark />
  </a-config-provider>
</template>
<script lang="ts" setup>
import { useTheme } from '@/theme'
import { useLocale } from '@/locales'
import { AppWatermark } from '@/components/app-watermark'

const { themeConfig } = useTheme()
const { locale } = useLocale()
</script>
