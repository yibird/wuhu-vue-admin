import { useTitle } from '@vueuse/core'
import { useRegisterRoutes } from '../composable'
import { BProgress } from '@bprogress/core'


import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'
import type { IRouteMeta } from '../types'

function setTitle(to: RouteLocationNormalizedGeneric) {
  const meta = to.meta as IRouteMeta
  if (meta?.title) {
    useTitle(meta.title)
  }
}

export async function setupGlobalBeforeEachRouteGuard(router: Router) {
  const { isRegister, registerRoutes } = useRegisterRoutes(router)

  if (!isRegister.value) {
    await registerRoutes()
  }
  router.beforeEach(async (to, from) => {
    setTitle(to)
    BProgress.start()
  })
}
