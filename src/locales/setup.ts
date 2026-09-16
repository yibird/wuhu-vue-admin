import { createI18n } from 'vue-i18n'
import { zh_CN, en } from './lang'
import { Locale } from '@/constants'
import type { Locale as LocaleValue } from '@/config'

type MessageSchema = typeof zh_CN

export const i18n = createI18n<[MessageSchema], LocaleValue>({
  locale: Locale.ZH_CN,
  fallbackLocale: Locale.ZH_CN,
  globalInjection: true,
  legacy: false,
  messages: {
    zh_CN,
    en,
  },
})
