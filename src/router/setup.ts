import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupGlobalRouteGuard } from './guard'

import type { App } from 'vue'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export async function setupRouter(app: App) {
  await setupGlobalRouteGuard(router)
  app.use(router)
}
