import { createApp } from 'vue'
import { hideAppLoading } from 'virtual:app-loading'
import { router, setupRouter } from '@/router'
import { pinia } from '@/store'
import { globalComponents } from '@/components/setup'
import { globalDirectives } from '@/directives'
import { plugins } from '@/plugins'
import { i18n } from '@/locales'
import App from './app.vue'
import './styles'

;(async function bootstrap() {
  const app = createApp(App).use(pinia)
  await setupRouter(app)
  app
    .use(i18n)
    .use(globalComponents)
    .use(globalDirectives)
    .use(plugins)
    .mount('#app')
  await router.isReady()
  hideAppLoading()
})()
