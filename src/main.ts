import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { pinia } from '@/store'
import { setupPlugins } from '@/plugins'
import { setupDirectives } from './directives'
import { i18n } from './locales'

import App from './App.vue'
import './style'

;(async function boostrap() {
  const app = createApp(App).use(pinia)
  await setupRouter(app)
  app.use(i18n).use(setupDirectives)
  app.mount('#app')
  setupPlugins(app)
})()
