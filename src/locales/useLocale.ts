import { storeToRefs } from 'pinia'
import {
  zhCN,
  dateZhCN,
  enGB,
  dateEnUS,
  type ConfigProviderProps,
} from 'naive-ui'
import { appStore } from '@/store'

import { Locale, type LocaleType } from '@/constant'
import { useI18n } from 'vue-i18n'

const locales: Record<
  LocaleType,
  {
    locale: ConfigProviderProps['locale']
    dateLocale: ConfigProviderProps['dateLocale']
  }
> = {
  [Locale.ZH_CN]: {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  [Locale.EN]: {
    locale: enGB,
    dateLocale: dateEnUS,
  },
}

export function useLocale() {
  const { app } = storeToRefs(appStore())
  const { locale: i18nLocale } = useI18n()

  const appLocale = computed(() => app.value.locale)

  const locale = computed(() => {
    const item = locales[appLocale.value] ?? locales[Locale.ZH_CN]
    return item.locale
  })

  const dateLocale = computed(() => {
    const item = locales[appLocale.value] ?? locales[Locale.ZH_CN]
    return item.dateLocale
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
    dateLocale,
    appLocale,
    changeLocale,
  }
}
