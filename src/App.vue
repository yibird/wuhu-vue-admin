<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeConfig"
    :locale="locale"
    :date-locale="dateLocale"
    class="full"
  >
    <ProgressProvider class="full">
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <RouterView />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
      <n-global-style />
    </ProgressProvider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { useTheme } from '@/composables'
import { useLocale } from '@/locales'
import { ProgressProvider } from '@bprogress/vue'

const { theme, themeConfig } = useTheme()
const { locale, dateLocale } = useLocale()
</script>
