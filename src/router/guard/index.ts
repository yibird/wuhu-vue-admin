import { setupGlobalBeforeEachRouteGuard } from './before-each'
import { setupSessionExpiredRouteGuard } from './session-expired'
import type { Router } from 'vue-router'

export function setupGlobalRouteGuard(router: Router) {
  const disposeBeforeEach = setupGlobalBeforeEachRouteGuard(router)
  const unsubscribeSessionExpired = setupSessionExpiredRouteGuard(router)
  return () => {
    disposeBeforeEach()
    unsubscribeSessionExpired()
  }
}
