import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useRegisterRoutes } from './composable'
import { plugins, setupRouterPlugins } from './plugins'
import { setupGlobalRouteGuard } from './guard'
import type { App } from 'vue'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export async function setupRouter(app: App) {
  const { isRegistered, registerRoutes } = useRegisterRoutes(router)
  if (!isRegistered.value) {
    await registerRoutes()
  }
  setupGlobalRouteGuard(router)
  const pluginRegistration = setupRouterPlugins(router, plugins)
  app.use(router)
  return () => {
    pluginRegistration.dispose()
  }
}
