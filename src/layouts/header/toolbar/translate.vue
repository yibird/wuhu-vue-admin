<template>
  <n-popselect
    trigger="hover"
    :options="options"
    :value="appLocale"
    @update-value="changeLocale"
  >
    <button>
      <Icon name="i-lucide:languages" :size="20" />
    </button>
  </n-popselect>
</template>
<script lang="ts" setup>
import { useLocale } from '@/locales'
import { Locale } from '@/constant'

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
</script>
