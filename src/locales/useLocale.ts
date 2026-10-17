import { useI18n } from 'vue-i18n'
import zhCN from 'antdv-next/locale/zh_CN'
import enGB from 'antdv-next/locale/en_GB'
import { useAppStore } from '@/store'
import { Locale } from '@/constants'

import type { Locale as AntdvLocale } from 'antdv-next/dist/locale'
import type { Locale as LocaleValue } from '@/config'

const locales: Record<LocaleValue, AntdvLocale> = {
  [Locale.ZH_CN]: zhCN,
  [Locale.EN]: enGB,
}

/**
 * 语言 → `<html lang>` 的 BCP 47 标记
 */
const langTags: Record<LocaleValue, string> = {
  [Locale.ZH_CN]: 'zh-CN',
  [Locale.EN]: 'en',
}

/**
 * 同步 `<html lang>`
 *
 * lang 决定 CJK 字形变体、断词与读屏发音,首屏由 index.html 内联脚本先行写入,
 * 运行时在这里跟随语言切换
 *
 * @param locale 当前语言
 */
function syncDocumentLang(locale: LocaleValue) {
  document.documentElement.lang = langTags[locale] ?? langTags[Locale.ZH_CN]
}

export function useLocale() {
  const { locale: i18nLocale } = useI18n()
  const { app } = useAppStore()
  const appLocale = computed(() => app.value.locale)

  const locale = computed(() => {
    return locales[appLocale.value] ?? locales[Locale.ZH_CN]
  })

  const changeLocale = (newLocale: LocaleValue) => {
    app.value.locale = newLocale
    i18nLocale.value = newLocale
    syncDocumentLang(newLocale)
  }

  onMounted(() => {
    i18nLocale.value = appLocale.value
    syncDocumentLang(appLocale.value)
  })

  return {
    locale,
    appLocale,
    changeLocale,
  }
}
