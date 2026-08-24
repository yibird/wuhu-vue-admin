import { progressBarPlugin } from './progressBar'
import { routeTabPlugin } from './routeTab'
import { titlePlugin } from './title'

import type { Router } from 'vue-router'
import type { RouterPlugin } from './types'

export const plugins: RouterPlugin[] = [
  progressBarPlugin,
  titlePlugin,
  routeTabPlugin,
]

export function setupRouterPlugins(
  router: Router,
  plugins: RouterPlugin[] = []
) {
  const removeBeforeEach = router.beforeEach(async (to, from) => {
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
  const removeBeforeResolve = router.beforeResolve(async (to, from) => {
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
  const removeAfterEach = router.afterEach((to, from) => {
    for (const plugin of plugins) {
      if (plugin.hooks.onAfterEach) {
        plugin.hooks.onAfterEach(to, from)
      }
    }
  })

  return {
    dispose() {
      removeBeforeEach()
      removeBeforeResolve()
      removeAfterEach()
      for (const plugin of plugins) {
        plugin.onDispose?.()
      }
    },
  }
}

export type {
  RouterPlugin,
  RouterPluginHooks,
  RouterPluginOptions,
} from './types'
