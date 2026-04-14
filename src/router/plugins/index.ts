import { progressBarPlugin } from './progressBar'
import { titlePlugin } from './title'
import type { Router } from 'vue-router'
import type { RouterPlugin } from './types'

export const plugins: RouterPlugin[] = [progressBarPlugin, titlePlugin]

export function setupRouterPlugins(
  router: Router,
  plugins: RouterPlugin[] = []
) {
  router.beforeEach(async (to, from) => {
    for (const plugin of plugins) {
      if (plugin.hooks.onBeforeEach) {
        const result = await plugin.hooks.onBeforeEach(to, from)
        if (result === false) {
          return false
        }
      }
    }
  })

  // beforeResolve hook
  router.beforeResolve(async (to, from) => {
    for (const plugin of plugins) {
      if (plugin.hooks.onBeforeResolve) {
        const result = await plugin.hooks.onBeforeResolve(to, from)
        if (result === false) {
          return false
        }
      }
    }
  })

  // afterEach hook
  router.afterEach((to, from) => {
    for (const plugin of plugins) {
      if (plugin.hooks.onAfterEach) {
        plugin.hooks.onAfterEach(to, from)
      }
    }
  })
}

export * from './types'
