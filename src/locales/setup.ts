import { createI18n } from 'vue-i18n'
import { zh_CN, en } from './lang'
import { Locale, type LocaleType } from '@/constant'

type MessageSchema = typeof zh_CN

export const i18n = createI18n<[MessageSchema], LocaleType>({
  locale: Locale.ZH_CN,
  fallbackLocale: Locale.ZH_CN,
  globalInjection: true,
  legacy: false,
  messages: {
    zh_CN,
    en,
  },
})
