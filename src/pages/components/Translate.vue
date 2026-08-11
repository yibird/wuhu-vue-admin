<template>
  <a-dropdown
    :menu="{ items: options, selectedKeys: [appLocale] }"
    @menu-click="onSelect"
  >
    <button
      :aria-label="$t('common.auth.language')"
      class="size-40 flex cursor-pointer items-center justify-center rounded-8 border-0 bg-transparent text-main outline-none transition-[background-color,color,transform,box-shadow] duration-180 hover:(bg-hover text-primary -translate-y-1) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)"
      type="button"
    >
      <Icon name="i-lucide:languages" :size="21" />
    </button>
  </a-dropdown>
</template>

<script setup lang="ts">
import { Locale, type LocaleType } from '@/constants'
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

const onSelect = ({ key }: { key: string }) => {
  changeLocale(key as LocaleType)
}
</script>
