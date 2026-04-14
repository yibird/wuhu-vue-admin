import { useTitle } from '@vueuse/core'
import topbar from 'topbar'
import { useRegisterRoutes } from '../composable'

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
    topbar.config({
      autoRun: false,
      barThickness: 2,
      barColors: {
        '0.2': 'rgba(24, 144, 255,  .75)',
        '0.6': 'rgba(24, 144, 255,  .85)',
        '1.0': 'rgba(24, 144, 255,  1)',
      },
      shadowBlur: 0,
    })
    topbar.show()
  })
}
