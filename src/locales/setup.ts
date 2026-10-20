import { createI18n } from 'vue-i18n'
import { zh_CN, en } from './lang'
import { LOCALE, type Locale } from '@/constants'

type MessageSchema = typeof zh_CN

export const i18n = createI18n<[MessageSchema], Locale>({
  locale: LOCALE.ZH_CN,
  fallbackLocale: LOCALE.ZH_CN,
  globalInjection: true,
  legacy: false,
  messages: {
    zh_CN,
    en,
  },
})
