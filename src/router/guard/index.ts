import { setupGlobalBeforeEachRouteGuard } from './beforeEach'
import { setupGlobalBeforeResolveRouteGuard } from './beforeResolve'
import { setupGlobalAfterEachRouteGuard } from './afterEach'
import type { Router } from 'vue-router'

export async function setupGlobalRouteGuard(router: Router) {
  await setupGlobalBeforeEachRouteGuard(router)
  setupGlobalBeforeResolveRouteGuard(router)
  setupGlobalAfterEachRouteGuard(router)
}
