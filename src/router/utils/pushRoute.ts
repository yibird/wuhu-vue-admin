import type { NavigationFailure, RouteLocationRaw, Router } from 'vue-router'

/**
 * 路由导航中的请求缓存
 *
 * 同一个 Router 实例：
 * 同一个 fullPath 只允许存在一个 pending navigation
 */
const pendingRoutePushes = new WeakMap<
  Router,
  Map<string, Promise<NavigationFailure | void>>
>()

/**
 * 安全执行路由跳转
 *
 * @param router Router 实例
 * @param target 路由目标
 */
export function pushRoute(
  router: Router,
  target: RouteLocationRaw
): Promise<NavigationFailure | void> {
  const resolved = router.resolve(target)
  const currentPath = router.currentRoute.value.fullPath
  /**
   * 当前已经是目标路由
   */
  if (resolved.fullPath === currentPath) {
    return Promise.resolve()
  }
  let routeQueue = pendingRoutePushes.get(router)
  if (!routeQueue) {
    routeQueue = new Map()
    pendingRoutePushes.set(router, routeQueue)
  }

  const key = resolved.fullPath

  /**
   * 已存在相同导航请求，直接复用
   */
  const pending = routeQueue.get(key)

  if (pending) return pending

  /**
   * 创建新的导航任务
   */
  const request = router.push(resolved).finally(() => {
    /**
     * 只清理自己的请求 防止旧 Promise 清理掉新的请求
     */
    if (routeQueue?.get(key) === request) {
      routeQueue.delete(key)
    }
  })

  routeQueue.set(key, request)
  return request
}
