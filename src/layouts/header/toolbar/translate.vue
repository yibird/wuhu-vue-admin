<template>
  <a-dropdown
    :trigger="['hover']"
    :menu="{
      items: localeMenuItems,
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
import { Locale, type LocaleType } from '@/constants'

const options = [
  {
    label: '中文简体',
    value: Locale.ZH_CN,
  },
  {
    label: 'English',
    value: Locale.EN,
  },
]
const { appLocale, changeLocale } = useLocale()
const localeMenuItems = computed(() =>
  options.map((item) => ({ key: item.value, label: item.label }))
)
const onLocaleClick = ({ key }: { key: string }) => {
  changeLocale(key as LocaleType)
}
</script>
