import zhCN from 'antdv-next/locale/zh_CN'
import enGB from 'antdv-next/locale/en_GB'
import { useAppStore } from '@/store'
import type { Locale as AntdvLocale } from 'antdv-next/dist/locale'

import { Locale, type LocaleType } from '@/constants'
import { useI18n } from 'vue-i18n'

const locales: Record<
  LocaleType,
  {
    locale: AntdvLocale
  }
> = {
  [Locale.ZH_CN]: {
    locale: zhCN,
  },
  [Locale.EN]: {
    locale: enGB,
  },
}

export function useLocale() {
  const { app } = useAppStore()
  const { locale: i18nLocale } = useI18n()
  const appLocale = computed(() => app.value.locale)

  const locale = computed(() => {
    const item = locales[appLocale.value] ?? locales[Locale.ZH_CN]
    return item.locale
  })

  const changeLocale = (newLocale: LocaleType) => {
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
