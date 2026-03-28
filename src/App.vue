<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeConfig"
    :locale="locale"
    :date-locale="dateLocale"
    class="full"
  >
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <RouterView />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
    <n-global-style />
  </n-config-provider>
</template>
<script lang="ts" setup>
import { useTheme } from '@/theme'
import { useLocale } from '@/locales'

const { theme, themeConfig } = useTheme()
const { locale, dateLocale } = useLocale()
</script>
