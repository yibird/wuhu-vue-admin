import type { Router, RouteLocationNormalized } from 'vue-router'

/**
 * Router Plugin Hooks
 */
export interface RouterPluginHooks {
  /** Called before route change starts */
  onBeforeEach?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => Promise<boolean | undefined> | boolean | undefined | void
  /** Called when route is resolved */
  onBeforeResolve?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => Promise<boolean | undefined> | boolean | undefined | void
  /** Called after route is finished */
  onAfterEach?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => void
}

/**
 * Router Plugin Interface
 */
export interface RouterPlugin {
  /** Plugin name */
  name: string
  /** Plugin hooks */
  hooks: RouterPluginHooks
}

/**
 * Router Plugin Options
 */
export interface RouterPluginOptions {
  /** Plugins to register */
  plugins?: RouterPlugin[]
}
