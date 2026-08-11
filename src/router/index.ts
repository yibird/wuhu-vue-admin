export { setupGlobalRouteGuard } from './guard'
export { useGo, useRegisterRoutes } from './composable'
export { plugins, setupRouterPlugins } from './plugins'
export { router, setupRouter } from './setup'
export {
  isMenu,
  getSafeRedirect,
  menuToRoute,
  normalizeRoutePath,
  prefetchMenuRoute,
  prefetchRouteComponent,
  toChildRoutePath,
  toPascalCase,
} from './utils'
export type {
  RouterPlugin,
  RouterPluginHooks,
  RouterPluginOptions,
} from './plugins'
export type { IRoute, IRouteMeta } from './types'
