export { setupGlobalRouteGuard } from './guard'
export { useGo } from './composable'
export { plugins, setupRouterPlugins } from './plugins'
export { router, setupRouter } from './setup'
export {
  isMenu,
  getComponentName,
  getSafeRedirect,
  menuToRoute,
  normalizePath,
  toChildRoutePath,
  toPascalCase,
} from './utils'
export type {
  RouterPlugin,
  RouterPluginHooks,
  RouterPluginOptions,
} from './plugins'
export type { IRoute, IRouteMeta } from './types'
