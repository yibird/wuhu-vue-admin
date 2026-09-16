import { authStore } from '@/store'
import { onSessionExpired } from '@/utils'

import type { Router } from 'vue-router'

export function setupSessionExpiredRouteGuard(router: Router) {
  return onSessionExpired(() => {
    authStore().logout()
    const current = router.currentRoute.value
    if (current.path === '/login') return
    router.replace({
      path: '/login',
      query:
        current.fullPath === '/' ? undefined : { redirect: current.fullPath },
    })
  })
}
