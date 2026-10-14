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
  }

  onMounted(() => {
    i18nLocale.value = appLocale.value
  })

  return {
    locale,
    appLocale,
    changeLocale,
  }
}
