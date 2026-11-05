export { setupGlobalRouteGuard } from './guard'
export { useGo, useRoutePrefetch } from './hooks'
export { plugins, setupRouterPlugins } from './plugins'
export { router, setupRouter } from './setup'
export {
  getComponentName,
  getSafeRedirect,
  isMenu,
  menuToRoute,
  normalizePath,
  prefetchRouteView,
  toChildRoutePath,
} from './utils'
export type {
  RouterPlugin,
  RouterPluginHooks,
  RouterPluginOptions,
} from './plugins'
export type { IRoute, IRouteMeta } from './types'
