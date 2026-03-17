import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { pinia } from '@/store'
import { globalComponents } from '@/components'
import { globalDirectives } from '@/directives'
import { plugins } from '@/plugins'
import { i18n } from '@/locales'

import App from './App.vue'
import './style'

;(async function boostrap() {
  const app = createApp(App).use(pinia)
  await setupRouter(app)
  app.use(i18n).use(globalComponents).use(globalDirectives).use(plugins)
  app.mount('#app')
})()
