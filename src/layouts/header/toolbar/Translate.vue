<template>
  <a-dropdown
    :trigger="['hover']"
    :menu="{
      items: localeOptions,
      selectedKeys: [appLocale],
      onClick: onLocaleClick,
    }"
  >
    <button type="button" class="w-layout-toolbar-item" data-motion="tilt">
      <Icon name="i-lucide:languages" :size="20" />
    </button>
  </a-dropdown>
</template>
<script lang="ts" setup>
import { useLocale } from '@/locales'
import { localeOptions, type Locale } from '@/config'

const { appLocale, changeLocale } = useLocale()

const onLocaleClick = ({ key }: { key: string }) => {
  changeLocale(key as Locale)
}
</script>
