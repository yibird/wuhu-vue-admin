import type { Router } from 'vue-router'

export function setupGlobalBeforeResolveRouteGuard(router: Router) {
  router.beforeResolve(async (to, from) => {
    return true
  })
}
