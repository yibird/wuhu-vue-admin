import { createApp, nextTick } from 'vue'
import { router, setupRouter } from '@/router'
import { appStore, authStore, pinia } from '@/store'
import { globalComponents } from '@/components'
import { globalDirectives } from '@/directives'
import { applyAppLoadingTheme, plugins, hideAppLoading } from '@/plugins'
import { i18n } from '@/locales'
import { onSessionExpired } from '@/utils/http/sessionEvents'

import App from './App.vue'
import './styles'

;(async function bootstrap() {
  const app = createApp(App).use(pinia)
  const appConfig = appStore()
  applyAppLoadingTheme({
    themeColor: appConfig.app.themeColor,
    themeMode: appConfig.app.themeMode,
  })
  const disposeRouter = await setupRouter(app)
  const stopSessionExpired = onSessionExpired(async () => {
    authStore().logout()
    if (router.currentRoute.value.path !== '/login') {
      await router.replace('/login')
    }
  })
  const unmount = app.unmount.bind(app)
  app.unmount = () => {
    stopSessionExpired()
    disposeRouter()
    unmount()
  }
  app.use(i18n).use(globalComponents).use(globalDirectives).use(plugins)
  app.mount('#app')

  await nextTick()
  hideAppLoading()
})()
