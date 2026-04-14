<template>
  <div>
    <n-divider>通用</n-divider>
    <ConfigItem title="语言">
      <n-select
        class="w-180"
        :options="localeOptions"
        :value="appLocale"
        @update-value="changeLocale"
      />
    </ConfigItem>
    <ConfigItem title="开启水印">
      <n-switch v-model:value="app.showWatermark" :round="false" />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { Locale } from '@/constant'
import ConfigItem from '../config-item.vue'
import { useLocale } from '@/locales'
import { appStore } from '@/store'
import { storeToRefs } from 'pinia'

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

const { app } = storeToRefs(appStore())
const { appLocale, changeLocale } = useLocale()
</script>
