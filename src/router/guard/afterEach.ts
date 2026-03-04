import { BProgress } from '@bprogress/core';
import type { Router } from 'vue-router'

export function setupGlobalAfterEachRouteGuard(router: Router) {
  router.afterEach((to, from) => {
    BProgress.done();
  })
}
