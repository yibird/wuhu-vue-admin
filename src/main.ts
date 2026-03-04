import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupRegisterGlobalComponents } from '@/components'
import { pinia } from '@/store'
import { setupPlugins } from '@/plugins'
import { i18n } from './locales'

import App from './App.vue'

import './style'

(async function boostrap() {
  const app = createApp(App).use(pinia)
  setupRegisterGlobalComponents(app)
  await setupRouter(app)
  app.use(i18n)
  app.mount('#app')
  setupPlugins(app)
})()

