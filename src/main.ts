import { createApp } from 'vue'
import { router, setupRouter } from '@/router'
import { appStore, pinia, setupAuthSessionSync } from '@/store'
import { globalComponents } from '@/components'
import { globalDirectives } from '@/directives'
import { applyAppLoadingTheme, plugins, hideAppLoading } from '@/plugins'
import { i18n } from '@/locales'

import App from './App.vue'
import './styles'

;(async function bootstrap() {
  const app = createApp(App).use(pinia)
  const appConfig = appStore()
  applyAppLoadingTheme({
    themeColor: appConfig.app.themeColor,
    themeMode: appConfig.app.themeMode,
  })
  setupAuthSessionSync()
  await setupRouter(app)
  app.use(i18n).use(globalComponents).use(globalDirectives).use(plugins)
  await router.isReady()
  app.mount('#app')
  await document.fonts.ready
  hideAppLoading()
})()
