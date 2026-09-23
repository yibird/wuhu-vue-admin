import type { RouteLocationNormalized } from 'vue-router'

/**
 * Router Plugin Hooks
 */
export interface RouterPluginHooks {
  /**
   * 路由变化开始前调用
   */
  onBeforeEach?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => Promise<boolean | undefined> | boolean | undefined | void
  /**
   * 路由变化开始前调用
   */
  onBeforeResolve?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => Promise<boolean | undefined> | boolean | undefined | void
  /**
   * 路由变化完成后调用
   */
  onAfterEach?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => void
}

/**
 * Router Plugin Interface
 */
export interface RouterPlugin {
  /**
   * 插件名称
   */
  name: string
  /**
   * 插件钩子函数
   */
  hooks: RouterPluginHooks
  /**
   * 插件销毁时调用的清理函数
   */
  onDispose?: () => void
}

/**
 * Router Plugin Options
 */
export interface RouterPluginOptions {
  /**
   * 插件列表
   */
  plugins?: RouterPlugin[]
}
