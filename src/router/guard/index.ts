import { setupGlobalBeforeEachRouteGuard } from './beforeEach'
import type { Router } from 'vue-router'

export function setupGlobalRouteGuard(router: Router) {
  return setupGlobalBeforeEachRouteGuard(router)
}
