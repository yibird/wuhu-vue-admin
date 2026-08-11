import { progressBarPlugin } from './progressBar'
import { syncTabPlugin } from './syncTab'
import { titlePlugin } from './title'
import type { Router } from 'vue-router'
import type { RouterPlugin } from './types'

export const plugins: RouterPlugin[] = [
  progressBarPlugin,
  titlePlugin,
  syncTabPlugin,
]

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

  return {
    dispose() {
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
