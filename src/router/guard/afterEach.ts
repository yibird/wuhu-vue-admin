import topbar from 'topbar'
import type { Router } from 'vue-router'

export function setupGlobalAfterEachRouteGuard(router: Router) {
  router.afterEach((to, from) => {
    topbar.hide()
  })
}
