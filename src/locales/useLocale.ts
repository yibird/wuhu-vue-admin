import { useI18n } from 'vue-i18n'
import zhCN from 'antdv-next/locale/zh_CN'
import enGB from 'antdv-next/locale/en_GB'
import { useAppStore } from '@/store'
import { LOCALE, type Locale } from '@/constants'

import type { Locale as AntdvLocale } from 'antdv-next/dist/locale'

const locales: Record<Locale, AntdvLocale> = {
  [LOCALE.ZH_CN]: zhCN,
  [LOCALE.EN]: enGB,
}

const langs: Record<Locale, string> = {
  [LOCALE.ZH_CN]: 'zh-CN',
  [LOCALE.EN]: 'en',
}

/**
 * 同步 `<html lang>`
 *
 * @param locale 当前语言
 */
function setDocumentLang(locale: Locale) {
  document.documentElement.lang = langs[locale] ?? langs[LOCALE.ZH_CN]
}

export function useLocale() {
  const { locale: i18nLocale } = useI18n()
  const { app } = useAppStore()
  const appLocale = computed(() => app.value.locale)

  const locale = computed(() => {
    return locales[appLocale.value as Locale] ?? locales[LOCALE.ZH_CN]
  })

  const changeLocale = (newLocale: Locale) => {
    app.value.locale = newLocale
    i18nLocale.value = newLocale
    setDocumentLang(newLocale)
  }

  onMounted(() => {
    i18nLocale.value = appLocale.value
    setDocumentLang(appLocale.value)
  })

  return {
    locale,
    appLocale,
    changeLocale,
  }
}
