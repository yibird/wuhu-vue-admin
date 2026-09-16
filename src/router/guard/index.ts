import { setupGlobalBeforeEachRouteGuard } from './beforeEach'
import { setupSessionExpiredRouteGuard } from './sessionExpired'
import type { Router } from 'vue-router'

export function setupGlobalRouteGuard(router: Router) {
  const disposeBeforeEach = setupGlobalBeforeEachRouteGuard(router)
  const unsubscribeSessionExpired = setupSessionExpiredRouteGuard(router)
  return () => {
    disposeBeforeEach()
    unsubscribeSessionExpired()
  }
}
