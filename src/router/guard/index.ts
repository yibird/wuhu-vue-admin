import { setupGlobalBeforeEachRouteGuard } from './beforeEach'
import type { Router } from 'vue-router'

export function setupGlobalRouteGuard(router: Router) {
  setupGlobalBeforeEachRouteGuard(router)
}
