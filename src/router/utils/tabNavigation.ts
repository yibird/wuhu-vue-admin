import type { NavigationFailure, RouteLocationRaw, Router } from 'vue-router'

const routerNavigations = new WeakMap<
  Router,
  Map<string, Promise<NavigationFailure | void>>
>()

export function navigateTabRoute(router: Router, target: RouteLocationRaw) {
  const resolved = router.resolve(target)
  if (resolved.fullPath === router.currentRoute.value.fullPath) {
    return Promise.resolve()
  }

  let pendingNavigations = routerNavigations.get(router)
  if (!pendingNavigations) {
    pendingNavigations = new Map()
    routerNavigations.set(router, pendingNavigations)
  }

  const pending = pendingNavigations.get(resolved.fullPath)
  if (pending) return pending

  const request = router.push(resolved).finally(() => {
    if (pendingNavigations.get(resolved.fullPath) === request) {
      pendingNavigations.delete(resolved.fullPath)
    }
  })
  pendingNavigations.set(resolved.fullPath, request)
  return request
}
