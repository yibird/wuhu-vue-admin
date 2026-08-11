import { authStore, permissionStore } from '@/store'
import { hasPermission } from '@/store/permission/access'
import { getToken } from '@/utils'
import { getSafeRedirect } from '../utils'

import type { Router } from 'vue-router'
import type { IRouteMeta } from '../types'

function hasRoutePermission(required: IRouteMeta['permission']) {
  return hasPermission(new Set(permissionStore().permissions), required)
}

export function setupGlobalBeforeEachRouteGuard(router: Router) {
  router.beforeEach(async (to) => {
    const store = authStore()
    const token = getToken()
    const isPublic = to.matched.some((record) => record.meta.public === true)

    if (isPublic) {
      if (to.path === '/login' && token) {
        return getSafeRedirect(to.query.redirect)
      }
      return true
    }

    if (!token) {
      store.clearSession()
      return {
        path: '/login',
        query: to.fullPath === '/' ? undefined : { redirect: to.fullPath },
        replace: true,
      }
    }

    try {
      await store.restoreSession()
    } catch {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
        replace: true,
      }
    }

    const required = to.meta.permission as IRouteMeta['permission']
    if (!hasRoutePermission(required) && to.path !== '/403') {
      return { path: '/403', replace: true }
    }

    return true
  })
}
