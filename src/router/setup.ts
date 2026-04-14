import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useRegisterRoutes } from './composable'
import { plugins, setupRouterPlugins } from './plugins'
import type { App } from 'vue'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export async function setupRouter(app: App) {
  const { isRegister, registerRoutes } = useRegisterRoutes(router)
  if (!isRegister.value) {
    await registerRoutes()
  }
  setupRouterPlugins(router, plugins)
  app.use(router)
}
