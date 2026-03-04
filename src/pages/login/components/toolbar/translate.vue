<template>
  <n-dropdown :options="options" :value="appLocale" @select="onSelect">
    <button
      class="flex size-40 cursor-pointer items-center justify-center rounded-8 transition hover:bg-[#f5f5f5]"
      type="button"
    >
      <Icon name="i-lucide:languages" :size="22" />
    </button>
  </n-dropdown>
</template>
<script setup lang="ts">
import { Locale, type LocaleType } from '@/constant'
import { useLocale } from '@/locales'

const options = [
  {
    label: '中文简体',
    key: Locale.ZH_CN,
  },
  {
    label: 'English',
    key: Locale.EN,
  },
]
const { appLocale, changeLocale } = useLocale()

const onSelect = (key: string) => {
  changeLocale(key as LocaleType)
}
</script>
