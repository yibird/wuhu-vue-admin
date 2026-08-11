<template>
  <div>
    <a-divider>通用</a-divider>
    <ConfigItem title="语言">
      <a-select
        class="w-180"
        :options="localeOptions"
        :value="appLocale"
        @update:value="changeLocale"
      />
    </ConfigItem>
    <ConfigItem title="开启水印">
      <a-switch v-model:checked="app.showWatermark" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { Locale } from '@/constants'
import ConfigItem from '../ConfigItem.vue'
import { useLocale } from '@/locales'
import { useAppStore } from '@/store'

const localeOptions = [
  {
    label: '中文简体',
    value: Locale.ZH_CN,
  },
  {
    label: 'English',
    value: Locale.EN,
  },
]

const { app } = useAppStore()
const { appLocale, changeLocale } = useLocale()
</script>
